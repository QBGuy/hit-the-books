import { useCallback } from "react"

// Log user action to Supabase
async function logUserAction(actionType: string, actionDetails?: any): Promise<void> {
  try {
    const response = await fetch('/api/user-actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action_type: actionType,
        action_details: actionDetails
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.warn('Failed to log user action:', errorData.message)
    }
  } catch (error) {
    console.warn('Error logging user action:', error)
  }
}

export function useUserActions() {
  const logDashboardViewed = useCallback(() => {
    logUserAction('dashboard_viewed', {
      timestamp: new Date().toISOString()
    })
  }, [])

  const logFilterChanged = useCallback((filterType: string, value: string) => {
    logUserAction('filter_changed', {
      filter_type: filterType,
      value,
      timestamp: new Date().toISOString()
    })
  }, [])

  const logOpportunitiesRefresh = useCallback((filters: any) => {
    logUserAction('opportunities_refresh', {
      filters,
      timestamp: new Date().toISOString()
    })
  }, [])

  const logBetLogged = useCallback((betData: any) => {
    logUserAction('bet_logged', {
      sport: betData.sport,
      bet_type: betData.bet_type,
      profit: betData.profit,
      bookie_1: betData.bookie_1,
      bookie_2: betData.bookie_2,
      timestamp: new Date().toISOString()
    })
  }, [])

  const logError = useCallback((error: string, context?: any) => {
    logUserAction('error_occurred', {
      error,
      context,
      timestamp: new Date().toISOString()
    })
  }, [])

  const logPageView = useCallback((page: string) => {
    logUserAction('page_viewed', {
      page,
      timestamp: new Date().toISOString()
    })
  }, [])

  const logLogin = useCallback(() => {
    logUserAction('user_login', {
      timestamp: new Date().toISOString()
    })
  }, [])

  const logLogout = useCallback(() => {
    logUserAction('user_logout', {
      timestamp: new Date().toISOString()
    })
  }, [])

  return {
    logDashboardViewed,
    logFilterChanged,
    logOpportunitiesRefresh,
    logBetLogged,
    logError,
    logPageView,
    logLogin,
    logLogout
  }
}

// Hook for fetching user action history
export function useUserActionHistory() {
  const fetchActions = useCallback(async (options: {
    actionType?: string
    limit?: number
    offset?: number
  } = {}) => {
    try {
      const params = new URLSearchParams()
      if (options.actionType) params.append('actionType', options.actionType)
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.offset) params.append('offset', options.offset.toString())

      const response = await fetch(`/api/user-actions?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user actions')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user actions:', error)
      throw error
    }
  }, [])

  return { fetchActions }
} 