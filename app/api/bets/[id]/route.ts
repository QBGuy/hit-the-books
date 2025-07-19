import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/bets/[id] - Delete a bet log
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const betId = params.id

    // First, verify the bet exists and belongs to the user
    const { data: existingBet, error: fetchError } = await supabase
      .from('bet_log')
      .select('id, user_id')
      .eq('id', betId)
      .single()

    if (fetchError || !existingBet) {
      return NextResponse.json(
        { message: 'Bet not found' },
        { status: 404 }
      )
    }

    // Check if the bet belongs to the authenticated user
    if (existingBet.user_id !== user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to delete this bet' },
        { status: 403 }
      )
    }

    // Delete the bet log
    const { error: deleteError } = await supabase
      .from('bet_log')
      .delete()
      .eq('id', betId)
      .eq('user_id', user.id) // Double-check user ownership

    if (deleteError) {
      console.error('Error deleting bet log:', deleteError)
      return NextResponse.json(
        { message: 'Failed to delete bet', error: deleteError.message },
        { status: 500 }
      )
    }

    // Log user action
    try {
      await (supabase as any).rpc('log_user_action', {
        p_action_type: 'bet_deleted',
        p_action_details: {
          bet_id: betId
        }
      })
    } catch (actionError) {
      console.warn('Failed to log user action:', actionError)
      // Don't fail the main operation if action logging fails
    }

    return NextResponse.json({
      message: 'Bet deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error in DELETE /api/bets/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}