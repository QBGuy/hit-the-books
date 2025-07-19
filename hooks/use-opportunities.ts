import { useState, useEffect } from "react"

interface Opportunity {
  id: number
  sport: string
  type: string
  team1: string
  team2: string
  bookie1: string
  bookie2: string
  odds1: string
  odds2: string
  profit: string
  profitAmount: string
}

interface UseOpportunitiesProps {
  betType: string
  bookie: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useOpportunities({
  betType,
  bookie,
  autoRefresh = false,
  refreshInterval = 60000
}: UseOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data
  const mockOpportunities: Opportunity[] = [
    {
      id: 1,
      sport: "NFL",
      type: "Turnover",
      team1: "Broncos",
      team2: "Cowboys",
      bookie1: "Sportsbet",
      bookie2: "Betfair",
      odds1: "2.1",
      odds2: "2.05",
      profit: "4.8%",
      profitAmount: "$4.76",
    },
    {
      id: 2,
      sport: "AFL",
      type: "Bonus Bet",
      team1: "Richmond",
      team2: "Collingwood",
      bookie1: "TAB",
      bookie2: "Ladbrokes",
      odds1: "1.85",
      odds2: "2.2",
      profit: "6.8%",
      profitAmount: "$6.80",
    },
    {
      id: 3,
      sport: "NBA",
      type: "Turnover",
      team1: "Lakers",
      team2: "Warriors",
      bookie1: "PointsBet",
      bookie2: "Betfair",
      odds1: "1.95",
      odds2: "2.1",
      profit: "3.6%",
      profitAmount: "$3.60",
    },
  ]

  const ageInSeconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)
  const isStale = ageInSeconds > 300 // 5 minutes
  const isFresh = ageInSeconds < 60 // 1 minute
  const needsRefresh = ageInSeconds > 120 // 2 minutes

  const refresh = async () => {
    setIsRefreshing(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter opportunities based on betType and bookie
      let filteredOpportunities = mockOpportunities.filter(opp => {
        if (betType !== "all" && opp.type.toLowerCase() !== betType) return false
        if (bookie !== "all" && !opp.bookie1.toLowerCase().includes(bookie) && !opp.bookie2.toLowerCase().includes(bookie)) return false
        return true
      })
      
      setOpportunities(filteredOpportunities)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch opportunities")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    refresh().finally(() => setIsLoading(false))
  }, [betType, bookie])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (ageInSeconds > 60) { // Auto-refresh if data is older than 1 minute
        refresh()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, ageInSeconds])

  return {
    opportunities,
    lastUpdated,
    ageInSeconds,
    isStale,
    isFresh,
    needsRefresh,
    isLoading,
    isRefreshing,
    error,
    refresh
  }
} 