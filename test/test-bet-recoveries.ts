#!/usr/bin/env npx tsx

/**
 * Test script for bet_recoveries functionality
 * 
 * This script:
 * 1. Tests the bet_recoveries odds fetching and calculation
 * 2. Validates that opportunities are posted to Supabase
 * 3. Checks the data structure and calculations
 * 4. Provides detailed logging for debugging
 */

import { processOdds, createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Types
interface TestResult {
  success: boolean
  message: string
  data?: any
  error?: any
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Test configuration
const TEST_CONFIG = {
  MAX_RUNTIME_MINUTES: 5,
  MIN_EXPECTED_OPPORTUNITIES: 1,
  MAX_EXPECTED_OPPORTUNITIES: 1000,
  REQUIRED_FIELDS: [
    'sport', 'bookie_1', 'odds_1', 'team_1', 
    'bookie_2', 'odds_2', 'team_2', 'stake_2', 
    'profit', 'betfair_scalar', 'bookie', 'bet_type', 'timestamp'
  ]
}

// Initialize Supabase client for testing
function createTestClient() {
  return createStandaloneClient()
}

// Utility functions
function logSection(title: string) {
  console.log('\n' + '='.repeat(60))
  console.log(`  ${title}`)
  console.log('='.repeat(60))
}

function logTest(testName: string, result: TestResult) {
  const status = result.success ? '✅ PASS' : '❌ FAIL'
  console.log(`${status} ${testName}`)
  if (result.message) {
    console.log(`   ${result.message}`)
  }
  if (result.error) {
    console.log(`   Error: ${result.error.message || result.error}`)
  }
  if (result.data && typeof result.data === 'object') {
    console.log(`   Data: ${JSON.stringify(result.data, null, 2).slice(0, 200)}...`)
  }
}

// Validation functions
function validateEnvironmentVariables(): TestResult {
  const requiredVars = [
    'ODDS_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    return {
      success: false,
      message: `Missing required environment variables: ${missing.join(', ')}`,
    }
  }

  return {
    success: true,
    message: 'All required environment variables are present'
  }
}

function validateOpportunityData(opportunities: any[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if we have data
  if (!Array.isArray(opportunities)) {
    errors.push('Opportunities is not an array')
    return { isValid: false, errors, warnings }
  }

  if (opportunities.length === 0) {
    warnings.push('No opportunities found')
    return { isValid: true, errors, warnings }
  }

  // Check count bounds
  if (opportunities.length < TEST_CONFIG.MIN_EXPECTED_OPPORTUNITIES) {
    warnings.push(`Found only ${opportunities.length} opportunities, expected at least ${TEST_CONFIG.MIN_EXPECTED_OPPORTUNITIES}`)
  }

  if (opportunities.length > TEST_CONFIG.MAX_EXPECTED_OPPORTUNITIES) {
    warnings.push(`Found ${opportunities.length} opportunities, more than expected maximum ${TEST_CONFIG.MAX_EXPECTED_OPPORTUNITIES}`)
  }

  // Validate each opportunity
  opportunities.forEach((opp, index) => {
    // Check required fields
    for (const field of TEST_CONFIG.REQUIRED_FIELDS) {
      if (!(field in opp) || opp[field] === null || opp[field] === undefined) {
        errors.push(`Opportunity ${index}: Missing required field '${field}'`)
      }
    }

    // Validate data types and values
    if (typeof opp.odds_1 !== 'number' || opp.odds_1 <= 1) {
      errors.push(`Opportunity ${index}: Invalid odds_1 value: ${opp.odds_1}`)
    }

    if (typeof opp.odds_2 !== 'number' || opp.odds_2 <= 1) {
      errors.push(`Opportunity ${index}: Invalid odds_2 value: ${opp.odds_2}`)
    }

    if (typeof opp.stake_2 !== 'number' || opp.stake_2 <= 0) {
      errors.push(`Opportunity ${index}: Invalid stake_2 value: ${opp.stake_2}`)
    }

    if (typeof opp.profit !== 'number') {
      errors.push(`Opportunity ${index}: Invalid profit value: ${opp.profit}`)
    }

    if (!['bonus', 'turnover'].includes(opp.bet_type)) {
      errors.push(`Opportunity ${index}: Invalid bet_type: ${opp.bet_type}`)
    }

    // Check team names are different
    if (opp.team_1 === opp.team_2) {
      errors.push(`Opportunity ${index}: team_1 and team_2 are the same`)
    }

    // Check bookies are different
    if (opp.bookie_1 === opp.bookie_2) {
      errors.push(`Opportunity ${index}: bookie_1 and bookie_2 are the same`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Test functions
async function testEnvironmentSetup(): Promise<TestResult> {
  try {
    return validateEnvironmentVariables()
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate environment',
      error
    }
  }
}

async function testSupabaseConnection(): Promise<TestResult> {
  try {
    const supabase = createTestClient()
    
    // Test connection by querying the opportunities table
    const { data, error } = await supabase
      .from('opportunities')
      .select('id')
      .limit(1)

    if (error) {
      return {
        success: false,
        message: 'Failed to connect to Supabase',
        error
      }
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create Supabase client',
      error
    }
  }
}

async function testOddsAPIConnection(): Promise<TestResult> {
  try {
    const ODDS_API_KEY = process.env.ODDS_API_KEY
    if (!ODDS_API_KEY) {
      return {
        success: false,
        message: 'ODDS_API_KEY not found'
      }
    }

    // Test API connection with a simple request
    const axios = require('axios')
    const response = await axios.get('https://api.the-odds-api.com/v4/sports', {
      params: { apiKey: ODDS_API_KEY },
      timeout: 10000
    })

    if (response.status === 200 && Array.isArray(response.data)) {
      return {
        success: true,
        message: `Odds API connection successful. Found ${response.data.length} sports.`
      }
    } else {
      return {
        success: false,
        message: `Unexpected API response: ${response.status}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to connect to Odds API',
      error: error.response?.data || error.message || error
    }
  }
}

async function testBetRecoveriesProcessing(): Promise<TestResult> {
  try {
    console.log('Starting bet recoveries processing...')
    const startTime = Date.now()
    
    // Set timeout for the operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout')), TEST_CONFIG.MAX_RUNTIME_MINUTES * 60 * 1000)
    })

    const processPromise = processOdds(['oddsapi'])
    
    const opportunities = await Promise.race([processPromise, timeoutPromise]) as any[]
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000

    console.log(`Processing completed in ${duration.toFixed(1)} seconds`)

    // Validate the results
    const validation = validateOpportunityData(opportunities)

    if (!validation.isValid) {
      return {
        success: false,
        message: `Data validation failed: ${validation.errors.join(', ')}`,
        data: { 
          opportunitiesCount: opportunities.length,
          validationErrors: validation.errors,
          validationWarnings: validation.warnings
        }
      }
    }

    return {
      success: true,
      message: `Successfully processed ${opportunities.length} opportunities`,
      data: {
        opportunitiesCount: opportunities.length,
        duration: duration,
        validationWarnings: validation.warnings,
        sampleOpportunity: opportunities[0]
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process odds',
      error
    }
  }
}

async function testSupabaseDataIntegrity(): Promise<TestResult> {
  try {
    const supabase = createTestClient()
    
    // Query the opportunities table
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)

    if (error) {
      return {
        success: false,
        message: 'Failed to query opportunities from Supabase',
        error
      }
    }

    if (!opportunities || opportunities.length === 0) {
      return {
        success: false,
        message: 'No opportunities found in Supabase table'
      }
    }

    // Check if data is recent (within last 30 minutes)
    const latestOpportunity = opportunities[0]
    const latestTimestamp = new Date(latestOpportunity.timestamp)
    const now = new Date()
    const ageInMinutes = (now.getTime() - latestTimestamp.getTime()) / (1000 * 60)

    // Allow for recently inserted data (within 30 minutes)
    if (ageInMinutes > 30) {
      return {
        success: false,
        message: `Latest opportunity is ${ageInMinutes.toFixed(1)} minutes old, may be stale data. Run the bet recoveries processing first.`
      }
    }

    // Validate data structure
    const validation = validateOpportunityData(opportunities)
    
    if (!validation.isValid) {
      return {
        success: false,
        message: `Database data validation failed: ${validation.errors.join(', ')}`,
        data: { validationErrors: validation.errors }
      }
    }

    return {
      success: true,
      message: `Found ${opportunities.length} recent opportunities in database`,
      data: {
        opportunitiesCount: opportunities.length,
        latestTimestamp: latestTimestamp.toISOString(),
        ageInMinutes: ageInMinutes.toFixed(1),
        validationWarnings: validation.warnings
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to test Supabase data integrity',
      error
    }
  }
}

// Main test runner
async function runAllTests() {
  logSection('BET RECOVERIES FUNCTIONALITY TEST')
  
  console.log('🚀 Starting comprehensive test suite...\n')

  const tests = [
    { name: 'Environment Setup', test: testEnvironmentSetup },
    { name: 'Supabase Connection', test: testSupabaseConnection },
    { name: 'Odds API Connection', test: testOddsAPIConnection },
    { name: 'Bet Recoveries Processing', test: testBetRecoveriesProcessing },
    { name: 'Supabase Data Integrity', test: testSupabaseDataIntegrity }
  ]

  const results: Array<{ name: string; result: TestResult }> = []

  for (const { name, test } of tests) {
    console.log(`\n📋 Running test: ${name}`)
    try {
      const result = await test()
      logTest(name, result)
      results.push({ name, result })
    } catch (error) {
      const result = { 
        success: false, 
        message: 'Test execution failed', 
        error 
      }
      logTest(name, result)
      results.push({ name, result })
    }
  }

  // Summary
  logSection('TEST SUMMARY')
  
  const passed = results.filter(r => r.result.success).length
  const failed = results.filter(r => !r.result.success).length
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\n❌ Failed tests:')
    results
      .filter(r => !r.result.success)
      .forEach(({ name, result }) => {
        console.log(`   • ${name}: ${result.message}`)
      })
  }

  if (passed === results.length) {
    console.log('\n🎉 All tests passed! Bet recoveries functionality is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.')
  }

  return { totalTests: results.length, passed, failed, results }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0)
    })
    .catch((error) => {
      console.error('Fatal error running tests:', error)
      process.exit(1)
    })
}

export { runAllTests, validateOpportunityData } 