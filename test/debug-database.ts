#!/usr/bin/env npx tsx

import { createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function debugDatabase() {
  console.log('🔍 Debugging Database State\n')
  
  try {
    const supabase = createStandaloneClient()
    
    // Check total count in opportunities table
    console.log('📊 Checking total opportunities count...')
    const { count, error: countError } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Count error:', countError)
    } else {
      console.log(`📈 Total opportunities in database: ${count}`)
    }
    
    // Check the newest 10 opportunities
    console.log('\n📋 Checking newest opportunities...')
    const { data: newest, error: newestError } = await supabase
      .from('opportunities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)
    
    if (newestError) {
      console.error('❌ Newest query error:', newestError)
    } else {
      console.log(`Found ${newest.length} newest opportunities:`)
      newest.forEach((opp, index) => {
        const age = (new Date().getTime() - new Date(opp.timestamp).getTime()) / (1000 * 60)
        console.log(`${index + 1}. ${opp.sport} - ${opp.team_1} vs ${opp.team_2}`)
        console.log(`   Profit: ${(opp.profit * 100).toFixed(1)}% | Age: ${age.toFixed(1)} min | Type: ${opp.bet_type}`)
      })
    }
    
    // Check if there are any opportunities with recent timestamps
    console.log('\n⏰ Checking for recent opportunities (last 10 minutes)...')
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { data: recent, error: recentError } = await supabase
      .from('opportunities')
      .select('*')
      .gte('timestamp', tenMinutesAgo)
      .order('timestamp', { ascending: false })
    
    if (recentError) {
      console.error('❌ Recent query error:', recentError)
    } else {
      console.log(`Found ${recent.length} opportunities from last 10 minutes`)
      if (recent.length > 0) {
        recent.slice(0, 3).forEach((opp, index) => {
          console.log(`${index + 1}. ${opp.sport} - ${opp.team_1} vs ${opp.team_2} | Profit: ${(opp.profit * 100).toFixed(1)}%`)
        })
      }
    }
    
    // Test a simple insert to see if it works
    console.log('\n🧪 Testing a simple insert...')
    const testOpportunity = {
      sport: 'test',
      bookie_1: 'test_bookie_1',
      odds_1: 2.0,
      team_1: 'Test Team 1',
      bookie_2: 'test_bookie_2',
      odds_2: 2.0,
      team_2: 'Test Team 2',
      stake_2: 1.0,
      profit: 0.1,
      betfair_scalar: 1.0,
      bookie: 'test_bookie_1',
      bet_type: 'test',
      timestamp: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('opportunities')
      .insert([testOpportunity])
      .select()
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError)
    } else {
      console.log('✅ Insert test successful:', insertData.length, 'row inserted')
      
      // Clean up test data
      await supabase
        .from('opportunities')
        .delete()
        .eq('sport', 'test')
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run the debug
debugDatabase() 