import { Database } from '@/types/database'
import { calculateBetOutcomes, formatCurrency, formatPercentage } from './calculations'

// Database types from Supabase
export type OpportunityRow = Database['public']['Tables']['opportunities']['Row']

// UI-friendly opportunity interface
export interface Opportunity {
  id: string
  sport: string
  team1: string
  team2: string
  bookie1: string
  bookie2: string
  odds1: number
  odds2: number
  stake2: number
  profit: number
  profitPercentage: number
  profitAmount: string
  betfairScalar: number
  bookie: string
  betType: 'bonus' | 'turnover'
  timestamp: string
  // Calculated fields based on user stake
  calculatedStake1?: number
  calculatedStake2?: number
  calculatedProfit?: number
  calculatedProfitAmount?: string
}

// Simple hash function for generating consistent unique IDs
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// Transform database row to UI-friendly opportunity
export function transformOpportunityData(
  row: OpportunityRow, 
  userStake: number = 100,
  index: number = 0
): Opportunity {
  const isBonus = row.bet_type === 'bonus'
  
  // Calculate bet outcomes with user's stake
  const calculations = calculateBetOutcomes({
    stake: userStake,
    odds1: row.odds_1,
    odds2: row.odds_2,
    stake2Ratio: row.stake_2, // This is already a ratio in the DB
    betfairScalar: row.betfair_scalar,
    isBonus,
    bookie1: row.bookie_1,
    bookie2: row.bookie_2
  })

  // Create a unique ID by including all distinguishing fields
  // Add index and hash to handle any potential duplicates
  const dataString = `${row.sport}-${row.team_1}-${row.team_2}-${row.bookie_1}-${row.bookie_2}-${row.odds_1.toFixed(3)}-${row.odds_2.toFixed(3)}-${row.profit.toFixed(6)}-${row.bet_type}-${row.timestamp}`
  const uniqueId = `${simpleHash(dataString)}-${index}`

  return {
    id: uniqueId,
    sport: row.sport,
    team1: row.team_1,
    team2: row.team_2,
    bookie1: row.bookie_1,
    bookie2: row.bookie_2,
    odds1: row.odds_1,
    odds2: row.odds_2,
    stake2: row.stake_2,
    profit: row.profit,
    profitPercentage: row.profit * 100, // Convert to percentage
    profitAmount: formatCurrency(row.profit * userStake),
    betfairScalar: row.betfair_scalar,
    bookie: row.bookie,
    betType: row.bet_type as 'bonus' | 'turnover',
    timestamp: row.timestamp,
    // Add calculated fields
    calculatedStake1: calculations.stake1,
    calculatedStake2: calculations.stake2,
    calculatedProfit: calculations.profit,
    calculatedProfitAmount: formatCurrency(calculations.profit)
  }
}

// API response interface
export interface OpportunitiesResponse {
  opportunities: OpportunityRow[]
  count: number
  lastUpdated: string | null
  ageInSeconds: number | null
  isStale: boolean
  isFresh: boolean
  freshnessThreshold: number
  needsRefresh: boolean
}

// Fetch opportunities from API
export async function fetchOpportunities(
  betType: string = 'all',
  bookie: string = 'all'
): Promise<OpportunitiesResponse> {
  const params = new URLSearchParams()
  if (betType !== 'all') params.append('betType', betType)
  if (bookie !== 'all') params.append('bookie', bookie)
  
  const response = await fetch(`/api/opportunities?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch opportunities: ${response.statusText}`)
  }
  
  return response.json()
}

// Refresh opportunities data by calling the refresh endpoint
export async function refreshOpportunities(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/opportunities/refresh', {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Error refreshing opportunities:', error)
    throw error
  }
}

// Get unique bookies from opportunities for filtering
export function getUniqueBookies(opportunities: Opportunity[]): string[] {
  const bookies = new Set<string>()
  
  opportunities.forEach(opp => {
    bookies.add(opp.bookie1)
    bookies.add(opp.bookie2)
  })
  
  return Array.from(bookies).sort()
}

// Get available sports from opportunities
export function getUniqueSports(opportunities: Opportunity[]): string[] {
  const sports = new Set(opportunities.map(opp => opp.sport))
  return Array.from(sports).sort()
}

// Filter opportunities based on criteria
export function filterOpportunities(
  opportunities: Opportunity[],
  filters: {
    betType?: string
    bookie?: string
    sport?: string
    minProfit?: number
  }
): Opportunity[] {
  return opportunities.filter(opp => {
    if (filters.betType && filters.betType !== 'all' && opp.betType !== filters.betType) {
      return false
    }
    
    if (filters.bookie && filters.bookie !== 'all') {
      const bookieMatch = opp.bookie1.toLowerCase().includes(filters.bookie.toLowerCase()) ||
                         opp.bookie2.toLowerCase().includes(filters.bookie.toLowerCase())
      if (!bookieMatch) return false
    }
    
    if (filters.sport && filters.sport !== 'all' && opp.sport !== filters.sport) {
      return false
    }
    
    if (filters.minProfit && opp.profit < filters.minProfit) {
      return false
    }
    
    return true
  })
} 