import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/bets - Fetch user's bet logs
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const betType = searchParams.get('betType') || 'all'
    const bookie = searchParams.get('bookie') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for user's bet logs
    let query = supabase
      .from('bet_log')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (betType !== 'all') {
      query = query.eq('bet_type', betType)
    }

    if (bookie !== 'all') {
      query = query.eq('bookie', bookie)
    }

    const { data: betLogs, error } = await query

    if (error) {
      console.error('Error fetching bet logs:', error)
      return NextResponse.json(
        { message: 'Failed to fetch bet logs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      betLogs: betLogs || [],
      total: betLogs?.length || 0
    })

  } catch (error) {
    console.error('Unexpected error in GET /api/bets:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bets - Log a new bet
export async function POST(request: Request) {
  console.log('📥 POST /api/bets - Received bet logging request')
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const betData = await request.json()

    // Validate required fields
    const requiredFields = [
      'sport', 'bookie_1', 'odds_1', 'team_1', 'stake_1',
      'bookie_2', 'odds_2', 'team_2', 'stake_2', 'profit', 'bet_type', 'bookie'
    ]

    for (const field of requiredFields) {
      if (betData[field] === undefined || betData[field] === null) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate bet_type
    if (!['bonus', 'turnover'].includes(betData.bet_type)) {
      return NextResponse.json(
        { message: 'Invalid bet_type. Must be "bonus" or "turnover"' },
        { status: 400 }
      )
    }

    // Get user profile info for username
    const username = user.user_metadata?.name || user.email || 'Unknown User'

    // Prepare data for insertion
    const insertData = {
      user_id: user.id,
      username: username,
      sport: betData.sport,
      bookie_1: betData.bookie_1,
      odds_1: parseFloat(betData.odds_1),
      team_1: betData.team_1,
      stake_1: parseFloat(betData.stake_1),
      bookie_2: betData.bookie_2,
      odds_2: parseFloat(betData.odds_2),
      team_2: betData.team_2,
      stake_2: parseFloat(betData.stake_2),
      profit: parseFloat(betData.profit),
      profit_actual: betData.profit_actual ? parseFloat(betData.profit_actual) : null,
      betfair_scalar: betData.betfair_scalar ? parseFloat(betData.betfair_scalar) : 1,
      bookie: betData.bookie,
      bet_type: betData.bet_type
    }

    // Insert the bet log
    console.log('💾 Inserting bet log into database:', insertData)
    const { data, error } = await supabase
      .from('bet_log')
      .insert([insertData])
      .select()

    if (error) {
      console.error('❌ Error inserting bet log:', error)
      return NextResponse.json(
        { message: 'Failed to log bet', error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Bet log inserted successfully:', data[0])

    // Log user action
    try {
      await (supabase as any).rpc('log_user_action', {
        p_action_type: 'bet_logged',
        p_action_details: {
          sport: betData.sport,
          bet_type: betData.bet_type,
          profit: betData.profit,
          bookie_1: betData.bookie_1,
          bookie_2: betData.bookie_2
        }
      })
    } catch (actionError) {
      console.warn('Failed to log user action:', actionError)
      // Don't fail the main operation if action logging fails
    }

    return NextResponse.json({
      message: 'Bet logged successfully',
      bet: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error in POST /api/bets:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 