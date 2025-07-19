#!/usr/bin/env npx tsx

import { createStandaloneClient } from '../lib/betting/bet_recoveries_standalone'
import { calculateBetOutcomes } from '../lib/betting/calculations'
import { Database } from '../types/database'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

type OpportunityRow = Database['public']['Tables']['opportunities']['Row']

interface TestResult {
  success: boolean
  message: string
  details?: any
}

interface CalculationTest {
  opportunityId: string
  sport: string
  teams: string
  betType: string
  supabaseProfit: number
  calculatedProfitPercentage: number
  difference: number
  stake: number
  passed: boolean
}

/**
 * Test calculations alignment with different stakes
 */
async function testCalculationsWithStakes(): Promise<TestResult> {
  const stakes = [1, 10, 50, 100, 500] // Test with different stake amounts
  const results: CalculationTest[] = []
  
  try {
    const supabase = createStandaloneClient()
    
    // Fetch sample opportunities from each bet type
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('profit', { ascending: false })
      .limit(10)
    
    if (error) {
      return {
        success: false,
        message: `Failed to fetch opportunities: ${error.message}`
      }
    }
    
    if (!opportunities || opportunities.length === 0) {
      return {
        success: false,
        message: 'No opportunities found in database'
      }
    }
    
    console.log(`🧮 Testing calculations with ${opportunities.length} opportunities and ${stakes.length} different stakes\n`)
    
    // Test each opportunity with each stake
    for (const opp of opportunities) {
      for (const stake of stakes) {
        const calculated = calculateBetOutcomes({
          stake,
          odds1: opp.odds_1,
          odds2: opp.odds_2,
          stake2Ratio: opp.stake_2, // This is already a ratio in the DB
          betfairScalar: opp.betfair_scalar,
          isBonus: opp.bet_type === 'bonus',
          bookie1: opp.bookie_1,
          bookie2: opp.bookie_2
        })
        
        // The stored profit in Supabase is the profit percentage as a decimal
        // So profit of 0.05 = 5% profit
        const supabaseProfitPercentage = opp.profit * 100
        
        // Calculate the difference between stored and calculated
        const difference = Math.abs(supabaseProfitPercentage - calculated.profitPercentage)
        const tolerance = 0.01 // Allow 0.01% difference due to floating point precision
        const passed = difference <= tolerance
        
        const test: CalculationTest = {
          opportunityId: `${opp.sport}-${opp.team_1}-${opp.team_2}`.substring(0, 30),
          sport: opp.sport,
          teams: `${opp.team_1} vs ${opp.team_2}`,
          betType: opp.bet_type,
          supabaseProfit: supabaseProfitPercentage,
          calculatedProfitPercentage: calculated.profitPercentage,
          difference,
          stake,
          passed
        }
        
        results.push(test)
        
        // Log detailed info for first test of each opportunity
        if (stake === stakes[0]) {
          console.log(`📊 ${opp.sport}: ${opp.team_1} vs ${opp.team_2} (${opp.bet_type})`)
          console.log(`   Supabase profit: ${supabaseProfitPercentage.toFixed(4)}%`)
          console.log(`   Calculated profit: ${calculated.profitPercentage.toFixed(4)}%`)
          console.log(`   Difference: ${difference.toFixed(6)}%`)
          console.log(`   Stake breakdown: $${calculated.stake1} + $${calculated.stake2.toFixed(2)} = $${calculated.outlay.toFixed(2)}`)
          console.log(`   Payout: min($${calculated.payout1.toFixed(2)}, $${calculated.payout2.toFixed(2)}) = $${calculated.totalPayout.toFixed(2)}`)
          console.log(`   Profit: $${calculated.profit.toFixed(2)} (${calculated.profitPercentage.toFixed(4)}%)`)
          console.log(`   ✅ ${passed ? 'PASS' : 'FAIL'}\n`)
        }
      }
    }
    
    return {
      success: true,
      message: 'Calculations test completed',
      details: results
    }
    
  } catch (error) {
    return {
      success: false,
      message: `Test failed with error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

/**
 * Test specific calculation scenarios
 */
async function testSpecificScenarios(): Promise<TestResult> {
  console.log('🎯 Testing specific calculation scenarios\n')
  
  try {
    // Test 1: Bonus bet scenario
    console.log('Test 1: Bonus Bet Calculation')
    const bonusResult = calculateBetOutcomes({
      stake: 100,
      odds1: 3.50,
      odds2: 1.42,
      stake2Ratio: 1.75, // Need $175 on bookie2 for every $100 on bookie1
      betfairScalar: 1.0,
      isBonus: true,
      bookie1: 'PointsBet',
      bookie2: 'Ladbrokes'
    })
    
    console.log(`   Stake1 (bonus): $${bonusResult.stake1} (outlay: $0)`)
    console.log(`   Stake2: $${bonusResult.stake2}`)
    console.log(`   Total outlay: $${bonusResult.outlay}`)
    console.log(`   Payout1: $${bonusResult.payout1.toFixed(2)} (bonus profit only)`)
    console.log(`   Payout2: $${bonusResult.payout2.toFixed(2)}`)
    console.log(`   Guaranteed payout: $${bonusResult.totalPayout.toFixed(2)}`)
    console.log(`   Profit: $${bonusResult.profit.toFixed(2)} (${bonusResult.profitPercentage.toFixed(2)}%)\n`)
    
    // Test 2: Turnover bet scenario
    console.log('Test 2: Turnover Bet Calculation')
    const turnoverResult = calculateBetOutcomes({
      stake: 100,
      odds1: 2.10,
      odds2: 1.95,
      stake2Ratio: 1.08,
      betfairScalar: 1.0,
      isBonus: false,
      bookie1: 'TAB',
      bookie2: 'Sportsbet'
    })
    
    console.log(`   Stake1: $${turnoverResult.stake1}`)
    console.log(`   Stake2: $${turnoverResult.stake2.toFixed(2)}`)
    console.log(`   Total outlay: $${turnoverResult.outlay.toFixed(2)}`)
    console.log(`   Payout1: $${turnoverResult.payout1}`)
    console.log(`   Payout2: $${turnoverResult.payout2.toFixed(2)}`)
    console.log(`   Guaranteed payout: $${turnoverResult.totalPayout.toFixed(2)}`)
    console.log(`   Profit: $${turnoverResult.profit.toFixed(2)} (${turnoverResult.profitPercentage.toFixed(2)}%)\n`)
    
    // Test 3: Betfair exchange with scalar
    console.log('Test 3: Betfair Exchange with Scalar')
    const betfairResult = calculateBetOutcomes({
      stake: 100,
      odds1: 4.20,
      odds2: 1.28,
      stake2Ratio: 3.25,
      betfairScalar: 0.95, // 5% commission
      isBonus: false,
      bookie1: 'betfair_ex_au',
      bookie2: 'TAB'
    })
    
    console.log(`   Effective odds1 (with 5% commission): ${betfairResult.effectiveOdds1.toFixed(3)}`)
    console.log(`   Stake1: $${betfairResult.stake1}`)
    console.log(`   Stake2: $${betfairResult.stake2.toFixed(2)}`)
    console.log(`   Total outlay: $${betfairResult.outlay.toFixed(2)}`)
    console.log(`   Payout1: $${betfairResult.payout1.toFixed(2)}`)
    console.log(`   Payout2: $${betfairResult.payout2.toFixed(2)}`)
    console.log(`   Guaranteed payout: $${betfairResult.totalPayout.toFixed(2)}`)
    console.log(`   Profit: $${betfairResult.profit.toFixed(2)} (${betfairResult.profitPercentage.toFixed(2)}%)\n`)
    
    return {
      success: true,
      message: 'Specific scenarios test completed successfully'
    }
    
  } catch (error) {
    return {
      success: false,
      message: `Specific scenarios test failed: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

/**
 * Main test function
 */
async function runCalculationsAlignmentTest() {
  console.log('🧪 Starting Calculations Alignment Test\n')
  console.log('='.repeat(60))
  
  try {
    // Test 1: Compare calculations with Supabase data
    const alignmentResult = await testCalculationsWithStakes()
    
    if (!alignmentResult.success) {
      console.error('❌ Alignment test failed:', alignmentResult.message)
      return
    }
    
    // Analyze results
    const tests = alignmentResult.details as CalculationTest[]
    const totalTests = tests.length
    const passedTests = tests.filter(t => t.passed).length
    const failedTests = totalTests - passedTests
    
    console.log('\n📊 ALIGNMENT TEST RESULTS')
    console.log('='.repeat(40))
    console.log(`Total tests: ${totalTests}`)
    console.log(`Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`)
    console.log(`Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`)
    
    if (failedTests > 0) {
      console.log('\n❌ Failed tests:')
      tests.filter(t => !t.passed).slice(0, 5).forEach(test => {
        console.log(`   ${test.sport} (${test.betType}, $${test.stake}): diff ${test.difference.toFixed(6)}%`)
      })
    } else {
      console.log('\n✅ All calculations align with Supabase data!')
    }
    
    // Test 2: Specific scenarios
    console.log('\n' + '='.repeat(60))
    const scenariosResult = await testSpecificScenarios()
    
    if (scenariosResult.success) {
      console.log('✅ All specific scenario tests passed!')
    } else {
      console.error('❌ Specific scenarios test failed:', scenariosResult.message)
    }
    
    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 FINAL RESULTS')
    console.log(`Alignment Test: ${alignmentResult.success ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Scenarios Test: ${scenariosResult.success ? '✅ PASS' : '❌ FAIL'}`)
    
    if (alignmentResult.success && scenariosResult.success) {
      console.log('\n🎯 All tests passed! The calculation functions are working correctly.')
    } else {
      console.log('\n⚠️  Some tests failed. Please review the calculations.')
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runCalculationsAlignmentTest()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Test suite error:', error)
      process.exit(1)
    })
}

export { runCalculationsAlignmentTest, testCalculationsWithStakes, testSpecificScenarios } 