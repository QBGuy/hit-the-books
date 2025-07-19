#!/usr/bin/env npx tsx

import { createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import { calculateDataAge, isDataFresh, formatSydneyTime } from '../lib/utils/timestamp-utils'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testTimestampFixVerification() {
  console.log('✅ Testing Timestamp Fix Verification')
  console.log('=====================================')
  
  try {
    const supabase = createStandaloneClient()
    
    // Get the latest opportunity
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
    
    if (error || !opportunities?.length) {
      console.error('❌ Error fetching opportunities:', error)
      return
    }
    
    const latest = opportunities[0]
    const dbTimestamp = latest.timestamp
    
    console.log('\n📊 BEFORE FIX:')
    console.log('==============')
    console.log(`Raw DB timestamp: ${dbTimestamp}`)
    console.log(`Has 'Z' suffix: ${dbTimestamp.includes('Z')}`)
    
    // Test the utility functions
    const age = calculateDataAge(dbTimestamp)
    const isFresh = isDataFresh(dbTimestamp)
    const sydneyTime = formatSydneyTime(dbTimestamp)
    
    console.log(`\n🔧 AFTER FIX (using utilities):`)
    console.log(`Age: ${age} seconds`)
    console.log(`Is fresh: ${isFresh}`)
    console.log(`Sydney time: ${sydneyTime}`)
    
    // Compare with old method
    const oldMethod = Math.floor((new Date().getTime() - new Date(dbTimestamp).getTime()) / 1000)
    console.log(`\n📏 COMPARISON:`)
    console.log(`Old method age: ${oldMethod} seconds`)
    console.log(`New method age: ${age} seconds`)
    console.log(`Difference: ${Math.abs(oldMethod - age)} seconds`)
    
    if (Math.abs(oldMethod - age) > 3600) {
      console.log('⚠️  Large difference detected - timezone issue confirmed')
      console.log('💡 The utility functions are fixing the 10-hour issue!')
    } else {
      console.log('✅ No significant difference - timestamps handled correctly')
    }
    
    // Test freshness threshold
    const FRESHNESS_THRESHOLD = 60
    console.log(`\n🎯 FRESHNESS TEST:`)
    console.log(`Threshold: ${FRESHNESS_THRESHOLD} seconds`)
    console.log(`Data age: ${age} seconds`)
    console.log(`Is fresh: ${isFresh}`)
    console.log(`Needs refresh: ${!isFresh}`)
    
    if (isFresh) {
      console.log('✅ Data appears fresh!')
    } else {
      console.log('🔄 Data needs refresh')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testTimestampFixVerification() 