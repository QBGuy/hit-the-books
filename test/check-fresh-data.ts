#!/usr/bin/env npx tsx

import { createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function checkFreshData() {
  console.log('🔍 Checking Fresh Data in Database\n')
  
  try {
    const supabase = createStandaloneClient()
    
    // Get count of all opportunities
    const { count, error: countError } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📈 Total opportunities: ${count}`)
    
    // Get the absolute newest entries by ID (not timestamp)
    const { data: newest, error: newestError } = await supabase
      .from('opportunities')
      .select('*')
      .order('id', { ascending: false })
      .limit(10)
    
    if (newestError) {
      console.error('❌ Error:', newestError)
      return
    }
    
    console.log('\n📊 Latest 10 opportunities (by ID):')
    newest.forEach((opp, index) => {
      console.log(`${index + 1}. ${opp.sport} - ${opp.team_1} vs ${opp.team_2}`)
      console.log(`   Profit: ${(opp.profit * 100).toFixed(1)}% | Type: ${opp.bet_type}`)
      console.log(`   Timestamp: ${opp.timestamp}`)
      console.log(`   ID: ${opp.id}\n`)
    })
    
    // Check what timestamp format we're getting
    if (newest.length > 0) {
      const latest = newest[0]
      console.log('🕒 Timestamp Analysis:')
      console.log(`Raw timestamp: ${latest.timestamp}`)
      console.log(`Parsed date: ${new Date(latest.timestamp)}`)
      console.log(`Current time: ${new Date()}`)
      console.log(`Time difference: ${((new Date().getTime() - new Date(latest.timestamp).getTime()) / 1000 / 60).toFixed(1)} minutes`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkFreshData() 