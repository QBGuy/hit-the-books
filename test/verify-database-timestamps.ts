/**
 * Database Timestamp Verification Test
 * 
 * This test:
 * 1. Checks current database timestamps
 * 2. Runs a refresh to add new data
 * 3. Verifies the timestamp formats and calculations
 * 4. Tests the API response for freshness
 * 
 * Usage: npx ts-node test/verify-database-timestamps.ts
 */

import { createClient } from '@/lib/supabase/server'
import moment from 'moment-timezone'

async function verifyDatabaseTimestamps() {
  console.log('🔍 Database Timestamp Verification')
  console.log('===================================')
  
  try {
    const supabase = await createClient()
    
    // Step 1: Check current database state
    console.log('\n📊 Step 1: Current database state')
    console.log('----------------------------------')
      const { data: currentData, error: currentError } = await supabase
      .from('opportunities')
      .select('timestamp, sport, team_1, team_2')
      .order('timestamp', { ascending: false })
      .limit(3)
    
    if (currentError) {
      console.error('❌ Error fetching current data:', currentError)
      return
    }
    
    console.log(`📈 Found ${currentData?.length || 0} records`)
    
    if (currentData && currentData.length > 0) {
      console.log('\n📋 Latest records:')
      currentData.forEach((record, index) => {
        const timestamp = new Date(record.timestamp)
        const sydneyTime = moment(timestamp).tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')
        const ageSeconds = Math.floor((Date.now() - timestamp.getTime()) / 1000)
        
        console.log(`   ${index + 1}. ${record.sport}: ${record.team_1} vs ${record.team_2}`)
        console.log(`      Timestamp: ${record.timestamp}`)
        console.log(`      As Date: ${timestamp.toISOString()}`)
        console.log(`      Sydney: ${sydneyTime}`)
        console.log(`      Age: ${ageSeconds} seconds (${Math.floor(ageSeconds / 60)} minutes)`)
        console.log('')
      })
    }
    
    // Step 2: Test API freshness calculation
    console.log('\n🌐 Step 2: API freshness calculation test')
    console.log('------------------------------------------')
    
    if (currentData && currentData.length > 0) {
      const latestRecord = currentData[0]
      const now = new Date()
      const lastUpdateTime = new Date(latestRecord.timestamp)
      const ageInSeconds = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000)
      
      console.log(`⏰ Current time (UTC): ${now.toISOString()}`)
      console.log(`⏰ Current time (Sydney): ${moment(now).tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')}`)
      console.log(`💾 Latest DB timestamp: ${latestRecord.timestamp}`)
      console.log(`💾 Latest DB time parsed: ${lastUpdateTime.toISOString()}`)
      console.log(`💾 Latest DB time (Sydney): ${moment(lastUpdateTime).tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')}`)
      console.log(`📏 Age calculation: ${ageInSeconds} seconds`)
      console.log(`📏 Age in minutes: ${Math.floor(ageInSeconds / 60)}`)
      console.log(`📏 Age in hours: ${(ageInSeconds / 3600).toFixed(2)}`)
      
      const FRESHNESS_THRESHOLD = 60
      const isStale = ageInSeconds > FRESHNESS_THRESHOLD
      const isFresh = ageInSeconds <= FRESHNESS_THRESHOLD
      
      console.log(`\n🎯 Freshness check:`)
      console.log(`   Threshold: ${FRESHNESS_THRESHOLD} seconds`)
      console.log(`   Is fresh: ${isFresh}`)
      console.log(`   Is stale: ${isStale}`)
      console.log(`   Needs refresh: ${isStale}`)
      
      // Check for the "10 hours old" issue
      const ageInHours = ageInSeconds / 3600
      if (ageInHours > 8) {
        console.log(`\n⚠️  POTENTIAL ISSUE DETECTED:`)
        console.log(`   Data appears to be ${ageInHours.toFixed(1)} hours old`)
        console.log(`   This might be the "10 hours old" timezone issue`)
        
        // Test alternative calculations
        console.log(`\n🧪 Alternative calculations:`)
        
        // What if we interpret the DB timestamp as Sydney time?
        const timestampAsSydney = moment.tz(latestRecord.timestamp, 'Australia/Sydney')
        const nowSydney = moment().tz('Australia/Sydney')
        const sydneyAge = nowSydney.diff(timestampAsSydney, 'seconds')
        
        console.log(`   If DB timestamp was Sydney time: ${sydneyAge} seconds (${(sydneyAge / 3600).toFixed(1)} hours)`)
        
        // Timezone offset impact
        const offsetHours = moment().tz('Australia/Sydney').utcOffset() / 60
        const offsetAdjustedAge = ageInSeconds - (offsetHours * 3600)
        
        console.log(`   Timezone offset: ${offsetHours} hours`)
        console.log(`   Offset-adjusted age: ${offsetAdjustedAge} seconds (${(offsetAdjustedAge / 3600).toFixed(1)} hours)`)
      }
    }
    
    // Step 3: Test what sydneyTimestamp() function produces
    console.log('\n🏗️  Step 3: sydneyTimestamp() function test')
    console.log('-------------------------------------------')
    
    function sydneyTimestamp(): string {
      return new Date().toISOString() // Current implementation
    }
    
    const currentSydneyTimestamp = sydneyTimestamp()
    const actualSydneyTime = moment().tz('Australia/Sydney').toISOString()
    const utcNow = new Date().toISOString()
    
    console.log(`🔴 sydneyTimestamp() returns: ${currentSydneyTimestamp}`)
    console.log(`🟢 Actual Sydney time: ${actualSydneyTime}`)
    console.log(`⚪ UTC now: ${utcNow}`)
    
    const timestampDiff = new Date(actualSydneyTime).getTime() - new Date(currentSydneyTimestamp).getTime()
    console.log(`📏 Difference: ${timestampDiff / 1000} seconds (${timestampDiff / 3600000} hours)`)
    
    if (Math.abs(timestampDiff) > 1000) {
      console.log(`⚠️  sydneyTimestamp() is NOT returning Sydney time!`)
      console.log(`💡 It's returning UTC time despite the function name`)
    } else {
      console.log(`✅ sydneyTimestamp() appears to be working correctly`)
    }
    
    // Step 4: Recommendations
    console.log('\n💡 Recommendations')
    console.log('===================')
    
    if (currentData && currentData.length > 0) {
      const latestRecord = currentData[0]
      const ageInHours = Math.floor((Date.now() - new Date(latestRecord.timestamp).getTime()) / 1000) / 3600
      
      if (ageInHours > 8) {
        console.log('🔴 ISSUE CONFIRMED: Data appears much older than expected')
        console.log('')
        console.log('Likely causes and solutions:')
        console.log('1. 🔧 sydneyTimestamp() returns UTC but name suggests Sydney')
        console.log('   - Rename to utcTimestamp() or fix to return actual Sydney time')
        console.log('')
        console.log('2. 🔧 Mixed timezone handling in frontend')
        console.log('   - Ensure all age calculations use UTC consistently')
        console.log('   - Only convert to Sydney for display purposes')
        console.log('')
        console.log('3. 🔧 Check data-freshness-indicator.tsx component')
        console.log('   - Verify it receives UTC timestamps from API')
        console.log('   - Ensure ageInSeconds calculation is done on server')
      } else {
        console.log('✅ Timestamps appear to be working correctly')
        console.log('🔍 If you\'re still seeing issues, check:')
        console.log('   - Frontend component state management')
        console.log('   - API response caching')
        console.log('   - Browser timezone settings')
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Export for use in other tests
export { verifyDatabaseTimestamps }

// Run if called directly
if (require.main === module) {
  verifyDatabaseTimestamps().catch(console.error)
}
