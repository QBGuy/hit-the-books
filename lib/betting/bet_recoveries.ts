import { createClient } from '@/lib/supabase/server'
import axios from 'axios'

// Types for better type safety
interface OddsAPIEvent {
  id: string
  sport: string
  commence_time: string
  bookmakers: Array<{
    key: string
    markets: Array<{
      key: string
      outcomes: Array<{
        name: string
        price: number
      }>
    }>
  }>
}

interface RawOdds {
  sport: string
  bookie: string
  odds_1: number
  odds_2: number
  team_1: string
  team_2: string
  live: boolean
  within_7_days: boolean
  event_time: string
  event_id: string
}

interface Opportunity {
  sport: string
  bookie_1: string
  odds_1: number
  team_1: string
  bookie_2: string
  odds_2: number
  team_2: string
  stake_2: number
  profit: number
  betfair_scalar: number
  bookie: string
  bet_type: 'bonus' | 'turnover'
  timestamp: string
}

// Utility functions
function sydneyTimestamp(): string {
  return new Date().toISOString()
}

function betfairScalars(data: any[]): any[] {
  return data.map(row => {
    let betfairScalar = 0.93
    if (row.sport === 'aussierules_afl') betfairScalar = 0.95
    if (row.sport === 'rugbyleague_nrl') betfairScalar = 0.9
    return { ...row, betfair_scalar: betfairScalar }
  })
}

// Odds API scraper
async function getSportOddsOddsapi(): Promise<RawOdds[]> {
  try {
    const ODDS_API_KEY = process.env.ODDS_API_KEY
    if (!ODDS_API_KEY) {
      throw new Error('ODDS_API_KEY not configured')
    }

    const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4/sports'

    // Get available sports
    const sportsResponse = await axios.get(`${ODDS_API_BASE_URL}`, {
      params: { apiKey: ODDS_API_KEY }
    })

    // Filter for relevant sports
    const relevantSports = [
      'aussierules_afl',
      'rugbyleague_nrl',
      'soccer_australia_aleague',
      'basketball_nbl',
      'cricket_big_bash'
    ]

    const availableSports = sportsResponse.data
      .filter((sport: any) => relevantSports.includes(sport.key))
      .map((sport: any) => sport.key)

    console.log(`Found ${availableSports.length} relevant sports`)

    let allOdds: RawOdds[] = []

    // Get odds for each sport
    for (const sport of availableSports) {
      try {
        const oddsResponse = await axios.get(`${ODDS_API_BASE_URL}/${sport}/odds`, {
          params: {
            apiKey: ODDS_API_KEY,
            regions: 'au',
            markets: 'h2h',
            oddsFormat: 'decimal',
            bookmakers: 'betright,betr_au,ladbrokes_au,neds,pointsbetau,sportsbet,tab,tabtouch,topsport,playup,unibet'
          }
        })

        const odds: OddsAPIEvent[] = oddsResponse.data
        console.log(`Found ${odds.length} events for ${sport}`)

        // Process each event
        for (const event of odds) {
          const bookmakers = event.bookmakers || []
          
          for (const bookmaker of bookmakers) {
            const markets = bookmaker.markets || []
            
            for (const market of markets) {
              if (market.key === 'h2h' && market.outcomes && market.outcomes.length === 2) {
                const [outcome1, outcome2] = market.outcomes
                
                // Calculate if within 7 days
                const eventTime = new Date(event.commence_time)
                const now = new Date()
                const within7Days = (eventTime.getTime() - now.getTime()) <= 7 * 24 * 60 * 60 * 1000
                
                allOdds.push({
                  sport: sport,
                  bookie: bookmaker.key,
                  odds_1: parseFloat(outcome1.price.toString()),
                  odds_2: parseFloat(outcome2.price.toString()),
                  team_1: outcome1.name,
                  team_2: outcome2.name,
                  live: false,
                  within_7_days: within7Days,
                  event_time: event.commence_time,
                  event_id: event.id
                })
              }
            }
          }
        }

        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        console.error(`Error fetching odds for ${sport}:`, error instanceof Error ? error.message : error)
        continue
      }
    }

    console.log(`Total odds collected: ${allOdds.length}`)
    return allOdds

  } catch (error) {
    console.error('Error in getSportOddsOddsapi:', error)
    throw error
  }
}

// Get all sport odds
async function getSportOddsAll(bookies: string[] = ["oddsapi"]): Promise<RawOdds[]> {
  const bookieMap: Record<string, () => Promise<RawOdds[]>> = {
    "oddsapi": getSportOddsOddsapi,
  }

  const validBookies = bookies.filter(b => bookieMap[b])
  if (validBookies.length === 0) {
    validBookies.push("oddsapi")
  }

  let df: RawOdds[] = []
  
  for (const bookie of validBookies) {
    try {
      const dfBookie = await bookieMap[bookie]()
      df = df.concat(dfBookie)
    } catch (error) {
      console.error(`Error fetching odds from ${bookie}:`, error)
    }
  }

  // Swap odds and teams where odds_2 > odds_1
  df = df.map(row => {
    if (row.odds_2 > row.odds_1) {
      return {
        ...row,
        odds_1: row.odds_2,
        odds_2: row.odds_1,
        team_1: row.team_2,
        team_2: row.team_1
      }
    }
    return row
  })

  // Filter for non-live events within 7 days
  return df.filter(row => !row.live && row.within_7_days)
}

// Calculate low holds (turnover bets)
function getLowHolds(df: RawOdds[]): Opportunity[] {
  // Swap odds and teams for second dataset
  const dfSwapped = df.map(row => ({
    ...row,
    odds_1: row.odds_2,
    odds_2: row.odds_1,
    team_1: row.team_2,
    team_2: row.team_1
  }))

  // Combine original and swapped data
  const combined = df.concat(dfSwapped)

  // Create cross-join (merge) of the data
  const dfc = []
  for (const row1 of combined) {
    for (const row2 of combined) {
      if (row1.sport === row2.sport && 
          row1.team_1 === row2.team_1 && 
          row1.team_2 === row2.team_2 &&
          row1.bookie !== row2.bookie) {
        
        dfc.push({
          sport: row1.sport,
          bookie_x: row1.bookie,
          odds_1: row1.odds_1,
          team_1: row1.team_1,
          bookie_y: row2.bookie,
          odds_2: row2.odds_2,
          team_2: row2.team_2
        })
      }
    }
  }

  // Apply Betfair scalars
  const dfcWithScalars = betfairScalars(dfc)

  // Calculate stakes and recovery
  const dfcCalculated = dfcWithScalars.map(row => {
    const stakeOther = row.odds_1 / row.odds_2
    const stake1Bf = 1 / (row.betfair_scalar * (row.odds_2 - 1) + 1)
    const stake2Bf = row.odds_1 / (row.betfair_scalar * (row.odds_2 - 1) + 1)
    
    const stake1 = row.bookie_x === 'betfair_ex_au' ? stake1Bf : stakeOther
    const stake2 = row.bookie_y === 'betfair_ex_au' ? stake2Bf : stakeOther
    const recovery = row.odds_1 - (1 + stake2)

    return {
      sport: row.sport,
      bookie_1: row.bookie_x,
      odds_1: row.odds_1,
      team_1: row.team_1,
      bookie_2: row.bookie_y,
      odds_2: row.odds_2,
      team_2: row.team_2,
      stake_2: stake2,
      recovery: recovery,
      betfair_scalar: row.betfair_scalar
    }
  })

  // Sort by recovery in descending order
  dfcCalculated.sort((a, b) => b.recovery - a.recovery)

  // Get unique bookies excluding 'betfair_ex_au'
  const bookies = [...new Set(dfcCalculated.map(row => row.bookie_1).filter(b => b !== 'betfair_ex_au'))]

  const dfOutGs = []
  
  for (const bookie of bookies) {
    // Select top 25 opportunities per bookie
    const dfFiltered = dfcCalculated
      .filter(row => row.bookie_1 === bookie || row.bookie_2 === bookie)
      .slice(0, 25)
      .map(row => ({ ...row, bookie: bookie }))
    
    dfOutGs.push(...dfFiltered)
  }

  // Sort by recovery and round values
  const dfFinGs = dfOutGs
    .sort((a, b) => b.recovery - a.recovery)
    .map(row => ({
      sport: row.sport,
      bookie_1: row.bookie_1,
      odds_1: row.odds_1,
      team_1: row.team_1,
      bookie_2: row.bookie_2,
      odds_2: row.odds_2,
      team_2: row.team_2,
      stake_2: Math.round(row.stake_2 * 10000) / 10000,
      profit: Math.round(row.recovery * 10000) / 10000,
      betfair_scalar: Math.round(row.betfair_scalar * 10000) / 10000,
      bookie: row.bookie,
      bet_type: 'turnover' as const,
      timestamp: sydneyTimestamp()
    }))

  return dfFinGs
}

// Calculate bonus recoveries
function getBonusRecoveries(df: RawOdds[]): Opportunity[] {
  const df1 = df.filter(row => row.bookie !== 'betfair_ex_au')
  
  // Create cross-join for bonus recoveries
  const dfc = []
  for (const row1 of df1) {
    for (const row2 of df) {
      if (row1.sport === row2.sport && 
          row1.team_1 === row2.team_1 && 
          row1.team_2 === row2.team_2 &&
          row1.bookie !== row2.bookie) {
        
        dfc.push({
          sport: row1.sport,
          bookie_x: row1.bookie,
          odds_1: row1.odds_1,
          team_1: row1.team_1,
          bookie_y: row2.bookie,
          odds_2: row2.odds_2,
          team_2: row2.team_2
        })
      }
    }
  }

  // Apply Betfair scalars
  const dfcWithScalars = betfairScalars(dfc)

  // Calculate stakes and recovery
  const dfcCalculated = dfcWithScalars.map(row => {
    const stake2Other = (row.odds_1 - 1) / row.odds_2
    const stake2Bf = (row.odds_1 - 1) / (row.betfair_scalar * (row.odds_2 - 1) + 1)
    const stake2 = row.bookie_y === 'betfair_ex_au' ? stake2Bf : stake2Other
    const recovery = (row.odds_1 - 1) - stake2

    return {
      sport: row.sport,
      bookie_1: row.bookie_x,
      odds_1: row.odds_1,
      team_1: row.team_1,
      bookie_2: row.bookie_y,
      odds_2: row.odds_2,
      team_2: row.team_2,
      stake_2: stake2,
      recovery: recovery,
      betfair_scalar: row.betfair_scalar
    }
  })

  // Sort by recovery and get top 25 per bookie
  const bookieGroups: Record<string, any[]> = {}
  dfcCalculated.forEach(row => {
    if (!bookieGroups[row.bookie_1]) {
      bookieGroups[row.bookie_1] = []
    }
    bookieGroups[row.bookie_1].push(row)
  })

  const dfcTop25: any[] = []
  Object.values(bookieGroups).forEach(group => {
    group
      .sort((a, b) => b.recovery - a.recovery)
      .slice(0, 25)
      .forEach(row => dfcTop25.push(row))
  })

  // Round values and add bet_type
  return dfcTop25.map(row => ({
    sport: row.sport,
    bookie_1: row.bookie_1,
    odds_1: row.odds_1,
    team_1: row.team_1,
    bookie_2: row.bookie_2,
    odds_2: row.odds_2,
    team_2: row.team_2,
    stake_2: Math.round(row.stake_2 * 10000) / 10000,
    profit: Math.round(row.recovery * 10000) / 10000,
    betfair_scalar: Math.round(row.betfair_scalar * 10000) / 10000,
    bookie: row.bookie_1,
    bet_type: 'bonus' as const,
    timestamp: sydneyTimestamp()
  }))
}

// Post results to Supabase
async function postResults(dfOdds: RawOdds[]): Promise<Opportunity[]> {
  try {
    // Get results from both functions
    const dfRecoveries = getBonusRecoveries(dfOdds)
    const dfLowHolds = getLowHolds(dfOdds)
    
    // Combine results
    const dfCombined = [...dfRecoveries, ...dfLowHolds]
      .sort((a, b) => b.profit - a.profit)
    
    // Write to Supabase
    const supabase = await createClient()
    
    try {
      // Clear existing data from opportunities table
      const { error: deleteError } = await supabase
        .from('opportunities')
        .delete()
        .neq('id', 0)
      
      if (deleteError) {
        console.warn('Error clearing existing opportunities:', deleteError)
      }
      
      // Insert new data
      const { data, error } = await supabase
        .from('opportunities')
        .insert(dfCombined)
        .select()
      
      if (error) {
        console.error('Error writing to Supabase:', error)
        throw error
      } else {
        console.log(`Successfully inserted ${data.length} rows into Supabase`)
      }
    } catch (error) {
      console.error('Error writing to Supabase:', error)
      throw error
    }
    
    // Log top opportunities
    const topOpportunities = dfCombined.slice(0, 10)
    console.log('\n=== TOP 10 OPPORTUNITIES ===')
    topOpportunities.forEach((row, index) => {
      console.log(`${index + 1}. ${row.sport}: ${row.team_1} vs ${row.team_2}`)
      console.log(`   ${row.bookie_1} (${row.odds_1.toFixed(2)}) vs ${row.bookie_2} (${row.odds_2.toFixed(2)})`)
      console.log(`   Profit: ${(row.profit * 100).toFixed(1)}% | Bet Type: ${row.bet_type}\n`)
    })
    
    return dfCombined
    
  } catch (error) {
    console.error('Error in postResults:', error)
    throw error
  }
}

// Main function
export async function processOdds(bookies: string[] = ["oddsapi"]): Promise<Opportunity[]> {
  try {
    console.log('Starting odds processing...')
    const dfOdds = await getSportOddsAll(bookies)
    console.log(`Collected ${dfOdds.length} odds entries`)
    
    if (dfOdds.length === 0) {
      console.log('No odds data collected, skipping processing')
      return []
    }
    
    const results = await postResults(dfOdds)
    console.log(`Processed ${results.length} opportunities`)
    
    return results
  } catch (error) {
    console.error('Error in processOdds:', error)
    throw error
  }
}

// Export for testing
export { getSportOddsAll, getBonusRecoveries, getLowHolds, postResults } 