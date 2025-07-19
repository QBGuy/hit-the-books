import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const betType = searchParams.get('betType') || 'all'
    const bookie = searchParams.get('bookie') || 'all'
    
    const supabase = await createClient()
    
    // Build query based on filters
    let query = supabase
      .from('opportunities')
      .select('*')
      .order('timestamp', { ascending: false })
    
    // Apply bet type filter
    if (betType !== 'all') {
      query = query.eq('bet_type', betType)
    }
    
    // Apply bookie filter
    if (bookie !== 'all') {
      query = query.eq('bookie', bookie)
    }
    
    const { data: opportunities, error } = await query
    
    if (error) {
      console.error('Error fetching opportunities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch opportunities' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      opportunities: opportunities || [],
      count: opportunities?.length || 0,
      lastUpdated: opportunities?.[0]?.timestamp || null
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 