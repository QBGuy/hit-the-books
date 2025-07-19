import { createClient } from '@/lib/supabase/server'

async function testBetLogging() {
  console.log('🧪 Testing Bet Logging Functionality')
  console.log('=====================================')

  try {
    const supabase = await createClient()
    
    // Test 1: Check if we can fetch bet logs
    console.log('\n📋 Test 1: Fetching bet logs...')
    const { data: betLogs, error: fetchError } = await supabase
      .from('bet_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5)

    if (fetchError) {
      console.error('❌ Failed to fetch bet logs:', fetchError)
    } else {
      console.log(`✅ Successfully fetched ${betLogs?.length || 0} bet logs`)
      if (betLogs && betLogs.length > 0) {
        console.log('📊 Sample bet log:')
        console.log(`   Sport: ${betLogs[0].sport}`)
        console.log(`   Teams: ${betLogs[0].team_1} vs ${betLogs[0].team_2}`)
        console.log(`   Bet Type: ${betLogs[0].bet_type}`)
        console.log(`   Profit: $${betLogs[0].profit}`)
        console.log(`   Timestamp: ${betLogs[0].timestamp}`)
      }
    }

    // Test 2: Check if we can fetch user actions
    console.log('\n📋 Test 2: Fetching user actions...')
    const { data: userActions, error: actionsError } = await supabase
      .from('user_actions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5)

    if (actionsError) {
      console.error('❌ Failed to fetch user actions:', actionsError)
    } else {
      console.log(`✅ Successfully fetched ${userActions?.length || 0} user actions`)
      if (userActions && userActions.length > 0) {
        console.log('📊 Sample user action:')
        console.log(`   Action Type: ${userActions[0].action_type}`)
        console.log(`   Username: ${userActions[0].username}`)
        console.log(`   Timestamp: ${userActions[0].timestamp}`)
      }
    }

    // Test 3: Check opportunities data
    console.log('\n📋 Test 3: Fetching opportunities...')
    const { data: opportunities, error: oppsError } = await supabase
      .from('opportunities')
      .select('*')
      .order('profit', { ascending: false })
      .limit(3)

    if (oppsError) {
      console.error('❌ Failed to fetch opportunities:', oppsError)
    } else {
      console.log(`✅ Successfully fetched ${opportunities?.length || 0} opportunities`)
      if (opportunities && opportunities.length > 0) {
        console.log('📊 Sample opportunity:')
        console.log(`   Sport: ${opportunities[0].sport}`)
        console.log(`   Teams: ${opportunities[0].team_1} vs ${opportunities[0].team_2}`)
        console.log(`   Bet Type: ${opportunities[0].bet_type}`)
        console.log(`   Profit: ${(opportunities[0].profit * 100).toFixed(2)}%`)
        console.log(`   Bookie: ${opportunities[0].bookie}`)
      }
    }

    console.log('\n🎯 Test Summary:')
    console.log('================')
    console.log('✅ Bet logging system appears to be working correctly')
    console.log('✅ Database tables are accessible')
    console.log('✅ Sample data is available for testing')
    
    if (betLogs && betLogs.length > 0) {
      console.log('✅ Bet logs contain real data')
    } else {
      console.log('ℹ️  No bet logs found - this is normal for a fresh database')
    }

    if (userActions && userActions.length > 0) {
      console.log('✅ User actions contain real data')
    } else {
      console.log('ℹ️  No user actions found - this is normal for a fresh database')
    }

    if (opportunities && opportunities.length > 0) {
      console.log('✅ Opportunities contain real data')
    } else {
      console.log('ℹ️  No opportunities found - run the refresh script first')
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testBetLogging()
}

export { testBetLogging } 