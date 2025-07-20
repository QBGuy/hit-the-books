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

// Fetch all bet logs from API (no filters)
export async function fetchBetLogs(): Promise<BetLogResponse> {
  const url = `/api/bets`
  console.log('🔍 Fetching all bet logs from:', url)
  
  const response = await fetch(url)
  
  console.log('📡 API Response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ API Error response:', errorText)
    throw new Error(`Failed to fetch bet logs: ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log('✅ API Response data:', data)
  
  return data
}

// Update a bet log (e.g., profit_actual)
export async function updateBetLog(
  betId: string,
  updateData: Partial<BetLog>
): Promise<{ message: string; bet: BetLog }> {
  const response = await fetch(`/api/bets/${betId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update bet')
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

// Delete a bet log
export async function deleteBetLog(betId: string): Promise<{ message: string }> {
  const response = await fetch(`/api/bets/${betId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete bet')
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
      console.log('🔍 Loading bet logs with filters:', filters)
      const response = await fetchBetLogs(filters)
      console.log('✅ Bet logs response:', response)
      setBetLogs(response.betLogs)
      setTotal(response.total)
    } catch (err) {
      console.error('❌ Error loading bet logs:', err)
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

  const removeBetLog = useCallback(async (betId: string) => {
    try {
      await deleteBetLog(betId)
      
      // Optimistically remove the bet from the list
      setBetLogs(prev => prev.filter(bet => bet.id !== betId))
      setTotal(prev => prev - 1)
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting bet:', err)
      throw err
    }
  }, [])

  const updateBetLogInList = useCallback(async (betId: string, updateData: Partial<BetLog>) => {
    try {
      const result = await updateBetLog(betId, updateData)
      
      // Optimistically update the bet in the list
      setBetLogs(prev => prev.map(bet => 
        bet.id === betId ? { ...bet, ...result.bet } : bet
      ))
      
      return result
    } catch (err) {
      console.error('Error updating bet:', err)
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
    addBetLog,
    removeBetLog,
    updateBetLogInList,
    updateFilters,
    refresh: loadBetLogs
  }
} 