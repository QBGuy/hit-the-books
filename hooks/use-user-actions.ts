import { useCallback } from "react"

export function useUserActions() {
  const logDashboardViewed = useCallback(() => {
    // TODO: Implement actual logging to Supabase
    // For now, just log to console to prevent API errors
    if (process.env.NODE_ENV === 'development') {
      console.log("Dashboard viewed")
    }
  }, [])

  const logFilterChanged = useCallback((filterType: string, value: string) => {
    // TODO: Implement actual logging to Supabase
    // For now, just log to console to prevent API errors
    if (process.env.NODE_ENV === 'development') {
      console.log(`Filter changed: ${filterType} = ${value}`)
    }
  }, [])

  const logOpportunitiesRefresh = useCallback((filters: any) => {
    // TODO: Implement actual logging to Supabase
    // For now, just log to console to prevent API errors
    if (process.env.NODE_ENV === 'development') {
      console.log("Opportunities refreshed with filters:", filters)
    }
  }, [])

  const logError = useCallback((error: string, context?: any) => {
    // TODO: Implement actual logging to Supabase
    // For now, just log to console to prevent API errors
    if (process.env.NODE_ENV === 'development') {
      console.error("Error logged:", error, context)
    }
  }, [])

  return {
    logDashboardViewed,
    logFilterChanged,
    logOpportunitiesRefresh,
    logError
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