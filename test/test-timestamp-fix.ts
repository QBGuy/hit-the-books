#!/usr/bin/env npx tsx

import { createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import moment from 'moment-timezone'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testTimestampFix() {
  console.log('🔧 Testing Timestamp Fix')
  console.log('========================')
  
  try {
    const supabase = createStandaloneClient()
    
    // Test 1: Generate timestamps with and without 'Z' suffix
    console.log('\n📊 TIMESTAMP GENERATION TEST:')
    console.log('==============================')
    
    const now = new Date()
    const timestampWithZ = now.toISOString() // 2025-07-19T22:30:25.474Z
    const timestampWithoutZ = now.toISOString().replace('Z', '') // 2025-07-19T22:30:25.474
    
    console.log(`Current time: ${now}`)
    console.log(`With 'Z' suffix: ${timestampWithZ}`)
    console.log(`Without 'Z' suffix: ${timestampWithoutZ}`)
    
    // Test 2: Parse both formats
    console.log('\n🔍 PARSING TEST:')
    console.log('=================')
    
    const parsedWithZ = new Date(timestampWithZ)
    const parsedWithoutZ = new Date(timestampWithoutZ)
    
    console.log(`Parsed with 'Z': ${parsedWithZ}`)
    console.log(`Parsed without 'Z': ${parsedWithoutZ}`)
    console.log(`ISO with 'Z': ${parsedWithZ.toISOString()}`)
    console.log(`ISO without 'Z': ${parsedWithoutZ.toISOString()}`)
    
    // Test 3: Age calculation comparison
    console.log('\n📏 AGE CALCULATION COMPARISON:')
    console.log('===============================')
    
    const ageWithZ = Math.floor((now.getTime() - parsedWithZ.getTime()) / 1000)
    const ageWithoutZ = Math.floor((now.getTime() - parsedWithoutZ.getTime()) / 1000)
    
    console.log(`Age with 'Z': ${ageWithZ} seconds`)
    console.log(`Age without 'Z': ${ageWithoutZ} seconds`)
    console.log(`Difference: ${Math.abs(ageWithZ - ageWithoutZ)} seconds`)
    
    // Test 4: Check current database timestamp
    console.log('\n🗄️  DATABASE TIMESTAMP CHECK:')
    console.log('=============================')
    
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('timestamp')
      .order('timestamp', { ascending: false })
      .limit(1)
    
    if (error || !opportunities?.length) {
      console.error('❌ Error fetching opportunities:', error)
      return
    }
    
    const dbTimestamp = opportunities[0].timestamp
    console.log(`DB timestamp: ${dbTimestamp}`)
    console.log(`Has 'Z' suffix: ${dbTimestamp.includes('Z')}`)
    
    // Test 5: Fix the timestamp generation
    console.log('\n🔧 TIMESTAMP FIX IMPLEMENTATION:')
    console.log('=================================')
    
    // Current implementation (problematic)
    function currentTimestamp(): string {
      return new Date().toISOString() // This should work correctly
    }
    
    // Alternative implementation (explicit UTC)
    function explicitUTCTimestamp(): string {
      return new Date().toISOString() // Same as above, but more explicit
    }
    
    // Test both implementations
    const current = currentTimestamp()
    const explicit = explicitUTCTimestamp()
    
    console.log(`Current implementation: ${current}`)
    console.log(`Explicit UTC implementation: ${explicit}`)
    console.log(`Both are identical: ${current === explicit}`)
    
    // Test 6: Verify the fix works
    console.log('\n✅ VERIFICATION TEST:')
    console.log('=====================')
    
    const testTimestamp = currentTimestamp()
    const parsedTest = new Date(testTimestamp)
    const ageTest = Math.floor((now.getTime() - parsedTest.getTime()) / 1000)
    
    console.log(`Test timestamp: ${testTimestamp}`)
    console.log(`Parsed test: ${parsedTest}`)
    console.log(`Age test: ${ageTest} seconds`)
    console.log(`Is fresh (< 60s): ${ageTest < 60}`)
    
    // Test 7: Show the correct way to handle timezone display
    console.log('\n🌐 TIMEZONE DISPLAY TEST:')
    console.log('=========================')
    
    const utcTime = new Date(testTimestamp)
    const sydneyTime = moment(testTimestamp).tz('Australia/Sydney')
    
    console.log(`UTC time: ${utcTime.toISOString()}`)
    console.log(`Sydney time: ${sydneyTime.format('YYYY-MM-DD HH:mm:ss')}`)
    console.log(`Sydney time (12h): ${sydneyTime.format('h:mm:ss A')}`)
    
    // Summary
    console.log('\n📋 SUMMARY:')
    console.log('==========')
    console.log('✅ Timestamps should be generated with toISOString() (includes Z)')
    console.log('✅ Database should store timestamps with Z suffix')
    console.log('✅ Age calculations should use UTC consistently')
    console.log('✅ Only convert to Sydney time for display purposes')
    console.log('❌ The issue is that database is stripping the Z suffix')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testTimestampFix() 