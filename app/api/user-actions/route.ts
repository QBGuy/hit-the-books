import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/user-actions - Retrieve user's action history
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
    const actionType = searchParams.get('actionType') || 'all'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for user's actions
    let query = supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply action type filter
    if (actionType !== 'all') {
      query = query.eq('action_type', actionType)
    }

    const { data: actions, error } = await query

    if (error) {
      console.error('Error fetching user actions:', error)
      return NextResponse.json(
        { message: 'Failed to fetch user actions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      actions: actions || [],
      total: actions?.length || 0
    })

  } catch (error) {
    console.error('Unexpected error in GET /api/user-actions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user-actions - Log a new user action
export async function POST(request: Request) {
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
    const actionData = await request.json()

    // Validate required fields
    if (!actionData.action_type) {
      return NextResponse.json(
        { message: 'action_type is required' },
        { status: 400 }
      )
    }

    // Get user profile info
    const username = user.user_metadata?.name || user.email || 'Unknown User'
    const email = user.email || 'unknown@example.com'

    // Prepare data for insertion
    const insertData = {
      user_id: user.id,
      username: username,
      email: email,
      action_type: actionData.action_type,
      action_details: actionData.action_details || null
    }

    // Insert the user action
    const { data, error } = await supabase
      .from('user_actions')
      .insert([insertData])
      .select()

    if (error) {
      console.error('Error inserting user action:', error)
      return NextResponse.json(
        { message: 'Failed to log user action', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User action logged successfully',
      action: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error in POST /api/user-actions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/user-actions - Clear user's action history (optional)
export async function DELETE(request: Request) {
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
    const actionType = searchParams.get('actionType')
    const olderThan = searchParams.get('olderThan') // ISO date string

    // Build delete query
    let query = supabase
      .from('user_actions')
      .delete()
      .eq('user_id', user.id)

    // Apply filters
    if (actionType) {
      query = query.eq('action_type', actionType)
    }

    if (olderThan) {
      query = query.lt('timestamp', olderThan)
    }

    const { error } = await query

    if (error) {
      console.error('Error deleting user actions:', error)
      return NextResponse.json(
        { message: 'Failed to delete user actions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User actions deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error in DELETE /api/user-actions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 