import { createClient } from '@/lib/supabase/server'

async function debugBetLogs() {
  console.log('🔍 Debugging Bet Logs API')
  console.log('==========================')

  try {
    const supabase = await createClient()
    
    // Test 1: Check authentication
    console.log('\n📋 Test 1: Authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('❌ Authentication error:', authError)
      return
    }
    
    if (!user) {
      console.log('ℹ️  No authenticated user found')
      return
    }
    
    console.log(`✅ Authenticated user: ${user.email}`)
    
    // Test 2: Check bet_log table structure
    console.log('\n📋 Test 2: Bet log table structure...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('bet_log')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Table access error:', tableError)
      return
    }
    
    console.log('✅ Bet log table is accessible')
    
    // Test 3: Check for existing bet logs
    console.log('\n📋 Test 3: Existing bet logs...')
    const { data: betLogs, error: fetchError } = await supabase
      .from('bet_log')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(5)
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError)
      return
    }
    
    console.log(`✅ Found ${betLogs?.length || 0} bet logs for user`)
    
    if (betLogs && betLogs.length > 0) {
      console.log('📊 Sample bet log:')
      const sample = betLogs[0]
      console.log(`   ID: ${sample.id}`)
      console.log(`   Sport: ${sample.sport}`)
      console.log(`   Teams: ${sample.team_1} vs ${sample.team_2}`)
      console.log(`   Bet Type: ${sample.bet_type}`)
      console.log(`   Stake 1: $${sample.stake_1}`)
      console.log(`   Stake 2: $${sample.stake_2}`)
      console.log(`   Profit: $${sample.profit}`)
      console.log(`   Timestamp: ${sample.timestamp}`)
    }
    
    // Test 4: Test API endpoint directly
    console.log('\n📋 Test 4: Testing API endpoint...')
    try {
      const response = await fetch('/api/bets?limit=5')
      console.log(`   API Response Status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`   API Response: ${data.betLogs?.length || 0} bet logs`)
      } else {
        const errorText = await response.text()
        console.error(`   API Error: ${errorText}`)
      }
    } catch (apiError) {
      console.error('   API Call Error:', apiError)
    }
    
    console.log('\n🎯 Debug Summary:')
    console.log('==================')
    console.log('✅ Database connection working')
    console.log('✅ Bet log table accessible')
    console.log('✅ User authentication working')
    
    if (betLogs && betLogs.length > 0) {
      console.log('✅ Bet logs exist in database')
    } else {
      console.log('ℹ️  No bet logs found for user')
    }

  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

debugBetLogs() 