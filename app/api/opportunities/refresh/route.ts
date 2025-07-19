import { NextResponse } from 'next/server'
import { processOdds } from '@/lib/betting/bet_recoveries'

export async function POST(request: Request) {
  try {
    console.log('Starting opportunities refresh...')
    
    // Process odds data and update the opportunities table
    const results = await processOdds(['oddsapi'])
    
    const message = results.length > 0 
      ? `Successfully refreshed ${results.length} opportunities`
      : 'Refresh completed but no new opportunities found'
    
    console.log(message)
    
    return NextResponse.json({
      success: true,
      message,
      count: results.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error refreshing opportunities:', error)
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to refresh opportunities',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Also support GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to refresh opportunities',
    endpoint: '/api/opportunities/refresh',
    method: 'POST'
  }, { status: 405 })
} 