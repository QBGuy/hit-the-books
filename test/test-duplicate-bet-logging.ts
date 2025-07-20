import { createClient } from '@/lib/supabase/server'

async function testDuplicateBetLogging() {
  console.log('🧪 Testing Duplicate Bet Logging Prevention')
  console.log('===========================================')

  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Authentication required for this test')
      return
    }

    console.log(`👤 Testing with user: ${user.email}`)

    // Test 1: Check for existing duplicate bet logs
    console.log('\n📋 Test 1: Checking for existing duplicate bet logs...')
    const { data: existingLogs, error: fetchError } = await supabase
      .from('bet_log')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(20)

    if (fetchError) {
      console.error('❌ Failed to fetch bet logs:', fetchError)
      return
    }

    console.log(`✅ Found ${existingLogs?.length || 0} existing bet logs`)

    // Check for duplicates by looking for identical records within a short time window
    const duplicates = findDuplicateBets(existingLogs || [])
    
    if (duplicates.length > 0) {
      console.log('⚠️  Found potential duplicate bet logs:')
      duplicates.forEach((duplicate, index) => {
        console.log(`   Duplicate ${index + 1}:`)
        console.log(`     IDs: ${duplicate.map(log => log.id).join(', ')}`)
        console.log(`     Sport: ${duplicate[0].sport}`)
        console.log(`     Teams: ${duplicate[0].team_1} vs ${duplicate[0].team_2}`)
        console.log(`     Bet Type: ${duplicate[0].bet_type}`)
        console.log(`     Timestamps: ${duplicate.map(log => log.timestamp).join(', ')}`)
        console.log(`     Time difference: ${getTimeDifference(duplicate[0].timestamp, duplicate[1].timestamp)} seconds`)
      })
    } else {
      console.log('✅ No duplicate bet logs found in existing data')
    }

    // Test 2: Check recent bet logs for patterns
    console.log('\n📋 Test 2: Analyzing recent bet logging patterns...')
    const recentLogs = existingLogs?.slice(0, 10) || []
    
    if (recentLogs.length > 0) {
      console.log('📊 Recent bet logging activity:')
      recentLogs.forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.sport} - ${log.team_1} vs ${log.team_2} (${log.bet_type})`)
        console.log(`      Timestamp: ${log.timestamp}`)
        console.log(`      Profit: $${log.profit}`)
      })
    }

    // Test 3: Check user actions for bet_logged events
    console.log('\n📋 Test 3: Checking user actions for bet_logged events...')
    const { data: userActions, error: actionsError } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', user.id)
      .eq('action_type', 'bet_logged')
      .order('timestamp', { ascending: false })
      .limit(20)

    let duplicateActions: any[][] = []
    
    if (actionsError) {
      console.error('❌ Failed to fetch user actions:', actionsError)
    } else {
      console.log(`✅ Found ${userActions?.length || 0} bet_logged user actions`)
      
      // Check for duplicate user actions
      duplicateActions = findDuplicateActions(userActions || [])
      
      if (duplicateActions.length > 0) {
        console.log('⚠️  Found potential duplicate user actions:')
        duplicateActions.forEach((duplicate, index) => {
          console.log(`   Duplicate Action ${index + 1}:`)
          console.log(`     IDs: ${duplicate.map(action => action.id).join(', ')}`)
          console.log(`     Sport: ${duplicate[0].action_details?.sport}`)
          console.log(`     Bet Type: ${duplicate[0].action_details?.bet_type}`)
          console.log(`     Timestamps: ${duplicate.map(action => action.timestamp).join(', ')}`)
        })
      } else {
        console.log('✅ No duplicate user actions found')
      }
    }

    console.log('\n🎯 Test Summary:')
    console.log('================')
    
    if (duplicates.length > 0) {
      console.log('⚠️  DUPLICATE BET LOGS DETECTED!')
      console.log('   This indicates the duplication issue is still present')
      console.log('   Check the frontend code for multiple API calls')
    } else {
      console.log('✅ No duplicate bet logs detected')
      console.log('   The duplication prevention appears to be working')
    }

    if (duplicateActions.length > 0) {
      console.log('⚠️  DUPLICATE USER ACTIONS DETECTED!')
      console.log('   This indicates multiple bet logging attempts')
    } else {
      console.log('✅ No duplicate user actions detected')
    }

    console.log('\n💡 Recommendations:')
    if (duplicates.length > 0 || duplicateActions.length > 0) {
      console.log('   - Check React StrictMode settings')
      console.log('   - Verify useEffect dependencies in bet logging modal')
      console.log('   - Add request deduplication in the API')
      console.log('   - Check for multiple event handlers')
    } else {
      console.log('   - The fix appears to be working correctly')
      console.log('   - Continue monitoring for new duplicates')
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

function findDuplicateBets(betLogs: any[]): any[][] {
  const duplicates: any[][] = []
  
  for (let i = 0; i < betLogs.length; i++) {
    for (let j = i + 1; j < betLogs.length; j++) {
      const log1 = betLogs[i]
      const log2 = betLogs[j]
      
      // Check if these are the same bet (same teams, sport, bet type, stakes)
      if (log1.sport === log2.sport &&
          log1.team_1 === log2.team_1 &&
          log1.team_2 === log2.team_2 &&
          log1.bet_type === log2.bet_type &&
          log1.stake_1 === log2.stake_1 &&
          log1.stake_2 === log2.stake_2 &&
          log1.odds_1 === log2.odds_1 &&
          log1.odds_2 === log2.odds_2) {
        
        // Check if they were created within 5 seconds of each other
        const timeDiff = Math.abs(new Date(log1.timestamp).getTime() - new Date(log2.timestamp).getTime())
        if (timeDiff < 5000) { // 5 seconds
          duplicates.push([log1, log2])
        }
      }
    }
  }
  
  return duplicates
}

function findDuplicateActions(userActions: any[]): any[][] {
  const duplicates: any[][] = []
  
  for (let i = 0; i < userActions.length; i++) {
    for (let j = i + 1; j < userActions.length; j++) {
      const action1 = userActions[i]
      const action2 = userActions[j]
      
      // Check if these are the same action (same sport, bet type, profit)
      if (action1.action_details?.sport === action2.action_details?.sport &&
          action1.action_details?.bet_type === action2.action_details?.bet_type &&
          action1.action_details?.profit === action2.action_details?.profit &&
          action1.action_details?.bookie_1 === action2.action_details?.bookie_1 &&
          action1.action_details?.bookie_2 === action2.action_details?.bookie_2) {
        
        // Check if they were created within 5 seconds of each other
        const timeDiff = Math.abs(new Date(action1.timestamp).getTime() - new Date(action2.timestamp).getTime())
        if (timeDiff < 5000) { // 5 seconds
          duplicates.push([action1, action2])
        }
      }
    }
  }
  
  return duplicates
}

function getTimeDifference(timestamp1: string, timestamp2: string): number {
  const time1 = new Date(timestamp1).getTime()
  const time2 = new Date(timestamp2).getTime()
  return Math.abs(time1 - time2) / 1000
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDuplicateBetLogging()
}

export { testDuplicateBetLogging } 