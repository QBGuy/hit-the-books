import { useState, useEffect, useCallback } from "react"

// Types for bet logs
export interface BetLog {
  id: string
  user_id: string
  username: string
  sport: string
  bookie_1: string
  odds_1: number
  team_1: string
  stake_1: number
  bookie_2: string
  odds_2: number
  team_2: string
  stake_2: number
  profit: number
  profit_actual: number | null
  betfair_scalar: number
  bookie: string
  bet_type: "bonus" | "turnover"
  timestamp: string
}

export interface BetLogResponse {
  betLogs: BetLog[]
  total: number
}

export interface BetLogFilters {
  betType?: string
  bookie?: string
  limit?: number
  offset?: number
}

// Fetch bet logs from API
export async function fetchBetLogs(filters: BetLogFilters = {}): Promise<BetLogResponse> {
  const params = new URLSearchParams()
  
  if (filters.betType && filters.betType !== 'all') {
    params.append('betType', filters.betType)
  }
  
  if (filters.bookie && filters.bookie !== 'all') {
    params.append('bookie', filters.bookie)
  }
  
  if (filters.limit) {
    params.append('limit', filters.limit.toString())
  }
  
  if (filters.offset) {
    params.append('offset', filters.offset.toString())
  }

  const response = await fetch(`/api/bets?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch bet logs: ${response.statusText}`)
  }
  
  return response.json()
}

// Log a new bet
export async function logBet(betData: {
  sport: string
  bookie_1: string
  odds_1: number
  team_1: string
  stake_1: number
  bookie_2: string
  odds_2: number
  team_2: string
  stake_2: number
  profit: number
  profit_actual?: number
  betfair_scalar?: number
  bookie: string
  bet_type: "bonus" | "turnover"
}): Promise<{ message: string; bet: BetLog }> {
  const response = await fetch('/api/bets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(betData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to log bet')
  }

  return response.json()
}

// Hook for managing bet logs
export function useBetLogs(initialFilters: BetLogFilters = {}) {
  const [betLogs, setBetLogs] = useState<BetLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<BetLogFilters>(initialFilters)

  const loadBetLogs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchBetLogs(filters)
      setBetLogs(response.betLogs)
      setTotal(response.total)
    } catch (err) {
      console.error('Error loading bet logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch bet logs')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const addBetLog = useCallback(async (betData: Parameters<typeof logBet>[0]) => {
    try {
      const result = await logBet(betData)
      
      // Optimistically add the new bet to the list
      setBetLogs(prev => [result.bet, ...prev])
      setTotal(prev => prev + 1)
      
      return result
    } catch (err) {
      console.error('Error logging bet:', err)
      throw err
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<BetLogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Load bet logs when filters change
  useEffect(() => {
    loadBetLogs()
  }, [loadBetLogs])

  return {
    betLogs,
    isLoading,
    error,
    total,
    filters,
    loadBetLogs,
    addBetLog,
    updateFilters,
    refresh: loadBetLogs
  }
} 