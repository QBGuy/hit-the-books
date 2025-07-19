#!/usr/bin/env npx tsx

import { createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import moment from 'moment-timezone'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testTimestampIssue() {
  console.log('🔍 Testing Timestamp Issue')
  console.log('==========================')
  
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
    
    console.log('\n📊 DATABASE TIMESTAMP ANALYSIS:')
    console.log('===============================')
    console.log(`Raw DB timestamp: ${dbTimestamp}`)
    
    // Parse the timestamp
    const dbDate = new Date(dbTimestamp)
    console.log(`Parsed as Date: ${dbDate}`)
    console.log(`ISO String: ${dbDate.toISOString()}`)
    console.log(`Local String: ${dbDate.toString()}`)
    
    // Current time analysis
    const now = new Date()
    console.log(`\n⏰ CURRENT TIME ANALYSIS:`)
    console.log(`Current UTC: ${now.toISOString()}`)
    console.log(`Current Local: ${now.toString()}`)
    console.log(`Current Sydney: ${moment().tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')}`)
    
    // Age calculations
    const ageInMs = now.getTime() - dbDate.getTime()
    const ageInSeconds = Math.floor(ageInMs / 1000)
    const ageInMinutes = Math.floor(ageInSeconds / 60)
    const ageInHours = Math.floor(ageInMinutes / 60)
    
    console.log(`\n📏 AGE CALCULATIONS:`)
    console.log(`Age in milliseconds: ${ageInMs}`)
    console.log(`Age in seconds: ${ageInSeconds}`)
    console.log(`Age in minutes: ${ageInMinutes}`)
    console.log(`Age in hours: ${ageInHours}`)
    
    // Timezone-specific calculations
    console.log(`\n🌐 TIMEZONE ANALYSIS:`)
    
    // Convert DB timestamp to Sydney time
    const dbSydney = moment(dbTimestamp).tz('Australia/Sydney')
    const nowSydney = moment().tz('Australia/Sydney')
    
    console.log(`DB time in Sydney: ${dbSydney.format('YYYY-MM-DD HH:mm:ss')}`)
    console.log(`Current time in Sydney: ${nowSydney.format('YYYY-MM-DD HH:mm:ss')}`)
    
    // Calculate age using Sydney timezone
    const ageInSecondsSydney = Math.floor(nowSydney.diff(dbSydney) / 1000)
    const ageInMinutesSydney = Math.floor(ageInSecondsSydney / 60)
    const ageInHoursSydney = Math.floor(ageInMinutesSydney / 60)
    
    console.log(`Age (Sydney calc): ${ageInSecondsSydney} seconds (${ageInMinutesSydney} minutes, ${ageInHoursSydney} hours)`)
    
    // Check for the 10-hour issue
    console.log(`\n🔍 10-HOUR ISSUE ANALYSIS:`)
    const timezoneOffset = moment().tz('Australia/Sydney').utcOffset() / 60
    console.log(`Sydney timezone offset: ${timezoneOffset} hours`)
    
    if (Math.abs(ageInHours - ageInHoursSydney) > 0.1) {
      console.log(`⚠️  DIFFERENCE DETECTED: UTC age (${ageInHours}h) vs Sydney age (${ageInHoursSydney}h)`)
    }
    
    // Test the API freshness calculation
    console.log(`\n🧮 API FRESHNESS CALCULATION TEST:`)
    const FRESHNESS_THRESHOLD = 60 // seconds
    const isStale = ageInSeconds > FRESHNESS_THRESHOLD
    const isFresh = ageInSeconds <= FRESHNESS_THRESHOLD
    
    console.log(`Freshness threshold: ${FRESHNESS_THRESHOLD} seconds`)
    console.log(`Age in seconds: ${ageInSeconds}`)
    console.log(`Is fresh: ${isFresh}`)
    console.log(`Is stale: ${isStale}`)
    console.log(`Needs refresh: ${isStale}`)
    
    // Check if this matches the 10-hour issue
    if (ageInHours >= 10) {
      console.log(`\n🚨 10-HOUR ISSUE CONFIRMED:`)
      console.log(`Data appears to be ${ageInHours} hours old`)
      console.log(`This suggests a timezone conversion problem`)
      
      // Show what the timestamp should be if it was current
      const expectedTimestamp = new Date(Date.now() - (ageInHours * 60 * 60 * 1000))
      console.log(`Expected timestamp if data was fresh: ${expectedTimestamp.toISOString()}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testTimestampIssue()
