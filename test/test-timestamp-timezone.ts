/**
 * Test for timestamp and timezone handling issues
 * 
 * This test checks:
 * 1. Running bet_recoveries to refresh opportunities table
 * 2. Pulling opportunities table data
 * 3. Checking timestamps in Sydney time vs UTC
 * 4. Verifying data freshness calculations
 * 
 * The main issue being tested: the refresh check thinks data is 10 hours old
 * due to timezone conversion problems.
 */

import { processOdds } from '@/lib/betting/bet_recoveries'
import { createClient } from '@/lib/supabase/server'
import moment from 'moment-timezone'

interface TestResult {
  step: string
  success: boolean
  data?: any
  error?: string
  timestamp: string
}

interface TimestampAnalysis {
  dbTimestamp: string
  dbTimestampParsed: Date
  currentUTC: Date
  currentSydney: string
  ageInSecondsUTC: number
  ageInSecondsSydney: number
  timezoneOffset: number
  issue: string | null
}

async function testTimestampTimezone(): Promise<void> {
  const results: TestResult[] = []
  
  console.log('🧪 Starting Timestamp & Timezone Test')
  console.log('=====================================')
  
  try {
    // Step 1: Record initial state
    console.log('\n📊 Step 1: Recording initial state...')
    const supabase = await createClient()
    
    const { data: initialData, error: initialError } = await supabase
      .from('opportunities')
      .select('timestamp')
      .order('timestamp', { ascending: false })
      .limit(1)
    
    const initialTimestamp = initialData?.[0]?.timestamp || null
    
    results.push({
      step: 'Initial state check',
      success: !initialError,
      data: { 
        hasData: !!initialData?.length,
        latestTimestamp: initialTimestamp,
        recordCount: initialData?.length || 0
      },
      error: initialError?.message,
      timestamp: new Date().toISOString()
    })
    
    console.log(`   📈 Initial records: ${initialData?.length || 0}`)
    console.log(`   🕐 Latest timestamp: ${initialTimestamp || 'None'}`)
    
    // Step 2: Run bet_recoveries to refresh opportunities
    console.log('\n🔄 Step 2: Running bet_recoveries to refresh opportunities...')
    
    const refreshStartTime = new Date()
    console.log(`   ⏰ Refresh started at: ${refreshStartTime.toISOString()} (UTC)`)
    console.log(`   🇦🇺 Sydney time: ${moment(refreshStartTime).tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')}`)
    
    let refreshResults
    try {
      refreshResults = await processOdds(['oddsapi'])
      
      results.push({
        step: 'Refresh opportunities',
        success: true,
        data: { 
          processedCount: refreshResults.length,
          refreshTime: refreshStartTime.toISOString()
        },
        timestamp: new Date().toISOString()
      })
      
      console.log(`   ✅ Successfully processed ${refreshResults.length} opportunities`)
      
    } catch (refreshError) {
      results.push({
        step: 'Refresh opportunities',
        success: false,
        error: refreshError instanceof Error ? refreshError.message : 'Unknown refresh error',
        timestamp: new Date().toISOString()
      })
      
      console.log(`   ❌ Refresh failed: ${refreshError}`)
      throw refreshError
    }
    
    // Step 3: Pull updated opportunities table
    console.log('\n📥 Step 3: Pulling updated opportunities table...')
    
    const { data: updatedData, error: fetchError } = await supabase
      .from('opportunities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5)
    
    if (fetchError) {
      results.push({
        step: 'Fetch updated opportunities',
        success: false,
        error: fetchError.message,
        timestamp: new Date().toISOString()
      })
      console.log(`   ❌ Fetch failed: ${fetchError.message}`)
      return
    }
    
    results.push({
      step: 'Fetch updated opportunities',
      success: true,
      data: { 
        recordCount: updatedData?.length || 0,
        latestTimestamp: updatedData?.[0]?.timestamp
      },
      timestamp: new Date().toISOString()
    })
    
    console.log(`   📊 Fetched ${updatedData?.length || 0} records`)
    console.log(`   🕐 Latest DB timestamp: ${updatedData?.[0]?.timestamp}`)
    
    // Step 4: Analyze timestamps and timezone issues
    console.log('\n🔍 Step 4: Analyzing timestamps and timezone conversion...')
    
    if (updatedData && updatedData.length > 0) {
      const latestRecord = updatedData[0]
      const analysis = analyzeTimestamp(latestRecord.timestamp)
      
      results.push({
        step: 'Timestamp analysis',
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      })
      
      // Display detailed analysis
      console.log('\n📋 TIMESTAMP ANALYSIS:')
      console.log('====================')
      console.log(`   🗄️  DB Timestamp: ${analysis.dbTimestamp}`)
      console.log(`   🌍  DB Time Parsed (UTC): ${analysis.dbTimestampParsed.toISOString()}`)
      console.log(`   🇦🇺  DB Time in Sydney: ${moment(analysis.dbTimestampParsed).tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')}`)
      console.log(`   ⏰  Current UTC: ${analysis.currentUTC.toISOString()}`)
      console.log(`   🇦🇺  Current Sydney: ${analysis.currentSydney}`)
      console.log(`   📏  Age (UTC calculation): ${analysis.ageInSecondsUTC} seconds`)
      console.log(`   📏  Age (Sydney calculation): ${analysis.ageInSecondsSydney} seconds`)
      console.log(`   🌐  Timezone offset: ${analysis.timezoneOffset} hours`)
      
      if (analysis.issue) {
        console.log(`   ⚠️   ISSUE DETECTED: ${analysis.issue}`)
      } else {
        console.log(`   ✅  No timezone issues detected`)
      }
      
      // Test freshness calculation like the UI does
      console.log('\n🧮 FRESHNESS CALCULATION TEST:')
      console.log('===============================')
      
      const FRESHNESS_THRESHOLD = 60 // seconds
      const isStale = analysis.ageInSecondsUTC > FRESHNESS_THRESHOLD
      const isFresh = analysis.ageInSecondsUTC <= FRESHNESS_THRESHOLD
      const needsRefresh = isStale
      
      console.log(`   🎯  Freshness threshold: ${FRESHNESS_THRESHOLD} seconds`)
      console.log(`   📊  Age in seconds: ${analysis.ageInSecondsUTC}`)
      console.log(`   ✅  Is fresh: ${isFresh}`)
      console.log(`   🔴  Is stale: ${isStale}`)
      console.log(`   🔄  Needs refresh: ${needsRefresh}`)
      
      // Test what happens if we use Sydney timezone for age calculation
      console.log('\n🇦🇺 SYDNEY TIMEZONE TEST:')
      console.log('=========================')
      
      const sydneyAge = analysis.ageInSecondsSydney
      const isFreshSydney = sydneyAge <= FRESHNESS_THRESHOLD
      const isStaleSydney = sydneyAge > FRESHNESS_THRESHOLD
      
      console.log(`   📊  Age (Sydney calc): ${sydneyAge} seconds`)
      console.log(`   ✅  Is fresh (Sydney): ${isFreshSydney}`)
      console.log(`   🔴  Is stale (Sydney): ${isStaleSydney}`)
      
      if (Math.abs(analysis.ageInSecondsUTC - analysis.ageInSecondsSydney) > 5) {
        console.log(`   ⚠️   SIGNIFICANT DIFFERENCE DETECTED between UTC and Sydney calculations!`)
      }
    }
    
    // Step 5: Test the API endpoint response
    console.log('\n🌐 Step 5: Testing API endpoint timestamp handling...')
    
    try {
      const apiResponse = await fetch('http://localhost:3000/api/opportunities')
      const apiData = await apiResponse.json()
      
      results.push({
        step: 'API endpoint test',
        success: apiResponse.ok,
        data: {
          lastUpdated: apiData.lastUpdated,
          ageInSeconds: apiData.ageInSeconds,
          isStale: apiData.isStale,
          isFresh: apiData.isFresh,
          needsRefresh: apiData.needsRefresh
        },
        timestamp: new Date().toISOString()
      })
      
      console.log(`   📡  API Response:`)
      console.log(`       Last Updated: ${apiData.lastUpdated}`)
      console.log(`       Age in Seconds: ${apiData.ageInSeconds}`)
      console.log(`       Is Fresh: ${apiData.isFresh}`)
      console.log(`       Is Stale: ${apiData.isStale}`)
      console.log(`       Needs Refresh: ${apiData.needsRefresh}`)
      
    } catch (apiError) {
      results.push({
        step: 'API endpoint test',
        success: false,
        error: apiError instanceof Error ? apiError.message : 'API test failed',
        timestamp: new Date().toISOString()
      })
      console.log(`   ❌ API test failed: ${apiError}`)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
  
  // Summary
  console.log('\n📋 TEST SUMMARY:')
  console.log('================')
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌'
    console.log(`${index + 1}. ${status} ${result.step}`)
    if (result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })
  
  const successCount = results.filter(r => r.success).length
  const totalCount = results.length
  
  console.log(`\n🎯 Overall: ${successCount}/${totalCount} steps successful`)
  
  // Write results to file for later analysis
  const fs = require('fs')
  const path = require('path')
  
  const resultsFilePath = path.join(__dirname, 'timestamp-test-results.json')
  fs.writeFileSync(resultsFilePath, JSON.stringify({
    testRun: new Date().toISOString(),
    results,
    summary: {
      successCount,
      totalCount,
      overallSuccess: successCount === totalCount
    }
  }, null, 2))
  
  console.log(`\n💾 Detailed results saved to: ${resultsFilePath}`)
}

function analyzeTimestamp(dbTimestamp: string): TimestampAnalysis {
  const dbTimestampParsed = new Date(dbTimestamp)
  const currentUTC = new Date()
  const currentSydney = moment().tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss')
  
  // Calculate age using UTC (standard approach)
  const ageInSecondsUTC = Math.floor((currentUTC.getTime() - dbTimestampParsed.getTime()) / 1000)
  
  // Calculate age using Sydney timezone
  const currentSydneyMoment = moment().tz('Australia/Sydney')
  const dbSydneyMoment = moment(dbTimestampParsed).tz('Australia/Sydney')
  const ageInSecondsSydney = Math.floor(currentSydneyMoment.diff(dbSydneyMoment) / 1000)
  
  // Get timezone offset
  const timezoneOffset = moment().tz('Australia/Sydney').utcOffset() / 60
  
  // Detect potential issues
  let issue: string | null = null
  
  // Check if the timestamp looks like it might be in the wrong timezone
  const ageDifferenceHours = Math.abs(ageInSecondsUTC - ageInSecondsSydney) / 3600
  
  if (ageDifferenceHours > 8) {
    issue = `Large discrepancy between UTC and Sydney age calculations (${ageDifferenceHours.toFixed(1)} hours difference)`
  } else if (ageInSecondsUTC > 36000) { // More than 10 hours old
    issue = `Data appears very old (${(ageInSecondsUTC / 3600).toFixed(1)} hours), possible timezone issue`
  }
  
  return {
    dbTimestamp,
    dbTimestampParsed,
    currentUTC,
    currentSydney,
    ageInSecondsUTC,
    ageInSecondsSydney,
    timezoneOffset,
    issue
  }
}

// Run the test
if (require.main === module) {
  testTimestampTimezone().catch(console.error)
}

export { testTimestampTimezone, analyzeTimestamp }
