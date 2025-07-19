import { useCallback } from "react"

export function useUserActions() {
  const logDashboardViewed = useCallback(() => {
    console.log("Dashboard viewed")
    // TODO: Implement actual logging to Supabase
  }, [])

  const logFilterChanged = useCallback((filterType: string, value: string) => {
    console.log(`Filter changed: ${filterType} = ${value}`)
    // TODO: Implement actual logging to Supabase
  }, [])

  const logOpportunitiesRefresh = useCallback((filters: any) => {
    console.log("Opportunities refreshed with filters:", filters)
    // TODO: Implement actual logging to Supabase
  }, [])

  const logError = useCallback((error: string, context?: any) => {
    console.error("Error logged:", error, context)
    // TODO: Implement actual logging to Supabase
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