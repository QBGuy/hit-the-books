import { useState, useEffect, useCallback } from "react"
import { 
  Opportunity, 
  OpportunitiesResponse, 
  fetchOpportunities, 
  refreshOpportunities, 
  transformOpportunityData 
} from "@/lib/betting/opportunities"

interface UseOpportunitiesProps {
  betType: string
  bookie: string
  stake: number
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useOpportunities({
  betType,
  bookie,
  stake,
  autoRefresh = false,
  refreshInterval = 60000
}: UseOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [ageInSeconds, setAgeInSeconds] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const [isStale, setIsStale] = useState(false)
  const [isFresh, setIsFresh] = useState(false)

  const loadOpportunities = useCallback(async () => {
    setError(null)
    
    try {
      const response: OpportunitiesResponse = await fetchOpportunities(betType, bookie)
      
      // Transform the raw database rows to UI-friendly format
      const transformedOpportunities = response.opportunities.map(row => 
        transformOpportunityData(row, stake)
      )
      
      setOpportunities(transformedOpportunities)
      setLastUpdated(response.lastUpdated ? new Date(response.lastUpdated) : null)
      setAgeInSeconds(response.ageInSeconds)
      setIsStale(response.isStale)
      setIsFresh(response.isFresh)
      setNeedsRefresh(response.needsRefresh)
    } catch (err) {
      console.error('Error loading opportunities:', err)
      setError(err instanceof Error ? err.message : "Failed to fetch opportunities")
    }
  }, [betType, bookie, stake])

  const refresh = async () => {
    setIsRefreshing(true)
    setError(null)
    
    try {
      // First trigger a refresh of the data
      await refreshOpportunities()
      
      // Then load the fresh data
      await loadOpportunities()
    } catch (err) {
      console.error('Error refreshing opportunities:', err)
      setError(err instanceof Error ? err.message : "Failed to refresh opportunities")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Load opportunities when filters or stake change
  useEffect(() => {
    setIsLoading(true)
    loadOpportunities().finally(() => setIsLoading(false))
  }, [loadOpportunities])

  // Update calculated fields when stake changes
  useEffect(() => {
    if (opportunities.length > 0) {
      const updatedOpportunities = opportunities.map(opp => {
        // Re-transform with new stake
        const dbRow = {
          sport: opp.sport,
          bookie_1: opp.bookie1,
          odds_1: opp.odds1,
          team_1: opp.team1,
          bookie_2: opp.bookie2,
          odds_2: opp.odds2,
          team_2: opp.team2,
          stake_2: opp.stake2,
          profit: opp.profit,
          betfair_scalar: opp.betfairScalar,
          bookie: opp.bookie,
          bet_type: opp.betType,
          timestamp: opp.timestamp
        }
        return transformOpportunityData(dbRow, stake)
      })
      setOpportunities(updatedOpportunities)
    }
  }, [stake])

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (ageInSeconds && ageInSeconds > 60) { // Auto-refresh if data is older than 1 minute
        refresh()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, ageInSeconds])

  // Update age in real-time
  useEffect(() => {
    if (!lastUpdated) return

    const interval = setInterval(() => {
      const now = new Date()
      const ageInSec = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)
      setAgeInSeconds(ageInSec)
      setIsStale(ageInSec > 300) // 5 minutes
      setIsFresh(ageInSec < 60) // 1 minute
      setNeedsRefresh(ageInSec > 120) // 2 minutes
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return {
    opportunities,
    lastUpdated,
    ageInSeconds: ageInSeconds ?? 0,
    isStale,
    isFresh,
    needsRefresh,
    isLoading,
    isRefreshing,
    error,
    refresh
  }
} 