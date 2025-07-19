#!/usr/bin/env npx tsx

import { processOdds, createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function simpleTest() {
  console.log('🚀 Simple Bet Recoveries Test\n')
  
  try {
    // Run bet recoveries
    console.log('📊 Running bet recoveries processing...')
    const opportunities = await processOdds(['oddsapi'])
    
    console.log(`\n✅ Successfully processed ${opportunities.length} opportunities!`)
    
    // Check what's in the database
    console.log('\n📋 Checking database...')
    const supabase = createStandaloneClient()
    const { data: dbOpportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('❌ Database error:', error)
    } else {
      console.log(`📈 Found ${dbOpportunities.length} opportunities in database`)
      if (dbOpportunities.length > 0) {
        const latest = dbOpportunities[0]
        const latestTime = new Date(latest.timestamp)
        const now = new Date()
        const ageInMinutes = (now.getTime() - latestTime.getTime()) / (1000 * 60)
        
        console.log(`⏰ Latest opportunity: ${ageInMinutes.toFixed(1)} minutes old`)
        console.log(`🎯 Sample: ${latest.sport} - ${latest.team_1} vs ${latest.team_2}`)
        console.log(`💰 Profit: ${(latest.profit * 100).toFixed(1)}% | Type: ${latest.bet_type}`)
      }
    }
    
    console.log('\n🎉 Test completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test
simpleTest() 