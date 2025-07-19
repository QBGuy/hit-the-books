import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateDataAge, isDataFresh } from '@/lib/utils/timestamp-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const betType = searchParams.get('betType') || 'all'
    const bookie = searchParams.get('bookie') || 'all'
    
    const supabase = await createClient()
    
    // Build query based on filters - sort by profit descending for highest profit first
    let query = supabase
      .from('opportunities')
      .select('*')
      .order('profit', { ascending: false })
    
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

    // Check data freshness using the timestamp utilities
    
    const lastUpdateTime = opportunities?.[0]?.timestamp 
      ? new Date(opportunities[0].timestamp)
      : null
    
    const ageInSeconds = opportunities?.[0]?.timestamp 
      ? calculateDataAge(opportunities[0].timestamp)
      : null
    
    const isStale = ageInSeconds !== null && ageInSeconds > 60
    const isFresh = ageInSeconds !== null && ageInSeconds <= 60
    
    return NextResponse.json({
      opportunities: opportunities || [],
      count: opportunities?.length || 0,
      lastUpdated: lastUpdateTime?.toISOString() || null,
      ageInSeconds,
      isStale,
      isFresh,
      freshnessThreshold: 60,
      needsRefresh: isStale
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 