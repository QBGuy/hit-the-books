"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"
import { DashboardHeader, UserSection } from "./shared/dashboard-header"
import { ControlsPanel } from "./controls-panel"
import { OpportunityList } from "./opportunities/opportunity-list"
import { BetLogList } from "./logs/bet-log-list"
import { DataFreshnessIndicator } from "./shared/data-freshness-indicator"
import { useOpportunities } from "@/hooks/use-opportunities"
import { ErrorBoundary, ErrorFallback } from "@/components/ui/error-boundary"
import { LoadingSpinner, CardLoadingSkeleton } from "@/components/ui/loading-spinner"
import { useUserActions } from "@/hooks/use-user-actions"

// Mock bet logs data - replace with real data later
const mockBetLogs = [
  {
    id: 1,
    date: "2024-01-15",
    sport: "NFL",
    teams: "Broncos vs Cowboys",
    stake: "$200",
    profit: "$9.52",
    status: "Won",
  },
  {
    id: 2,
    date: "2024-01-14",
    sport: "AFL",
    teams: "Richmond vs Collingwood",
    stake: "$150",
    profit: "$10.20",
    status: "Won",
  },
  {
    id: 3,
    date: "2024-01-13",
    sport: "NBA",
    teams: "Lakers vs Warriors",
    stake: "$100",
    profit: "$3.60",
    status: "Won",
  },
]

export function DashboardLayout() {
  const [stake, setStake] = useState("100")
  const [betType, setBetType] = useState("turnover")
  const [selectedBookie, setSelectedBookie] = useState("all")
  
  // User action tracking
  const { 
    logDashboardViewed, 
    logFilterChanged, 
    logOpportunitiesRefresh,
    logError
  } = useUserActions()
  
  // Use the real-time opportunities hook
  const {
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
  } = useOpportunities({
    betType,
    bookie: selectedBookie,
    stake: parseFloat(stake) || 100, // Convert to number
    autoRefresh: true,
    refreshInterval: 60000
  })

  // Log dashboard view on mount
  useEffect(() => {
    logDashboardViewed()
  }, [logDashboardViewed])

  // Log filter changes
  useEffect(() => {
    logFilterChanged('bet_type', betType)
  }, [betType, logFilterChanged])

  useEffect(() => {
    logFilterChanged('bookie', selectedBookie)
  }, [selectedBookie, logFilterChanged])

  // Log errors
  useEffect(() => {
    if (error) {
      logError(error, { 
        context: 'dashboard_opportunities',
        filters: { betType, selectedBookie, stake }
      })
    }
  }, [error, logError, betType, selectedBookie, stake])

  const handleRefresh = () => {
    logOpportunitiesRefresh({ betType, selectedBookie, stake })
    refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header Bar */}
      <DashboardHeader />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 shadow-lg flex flex-col">
          {/* Betting Controls */}
          <ControlsPanel
            stake={stake}
            setStake={setStake}
            betType={betType}
            setBetType={setBetType}
            selectedBookie={selectedBookie}
            setSelectedBookie={setSelectedBookie}
            onRefresh={handleRefresh}
          />

          {/* User Section */}
          <UserSection />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Opportunities with Tabs */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  <span>{betType === "bonus" ? "Bonus Conversion Opportunities" : "Turnover Opportunities"}</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="opportunities" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                  <TabsTrigger
                    value="opportunities"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Opportunities
                  </TabsTrigger>
                  <TabsTrigger
                    value="log"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Log
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="opportunities">
                  <div className="space-y-4">
                    <ErrorBoundary
                      fallback={
                        <ErrorFallback 
                          title="Data Freshness Error"
                          message="Unable to load data freshness information"
                        />
                      }
                    >
                      <DataFreshnessIndicator
                        lastUpdated={lastUpdated}
                        ageInSeconds={ageInSeconds}
                        isStale={isStale}
                        isFresh={isFresh}
                        needsRefresh={needsRefresh}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                      />
                    </ErrorBoundary>
                    
                    {error && (
                      <ErrorFallback 
                        title="Failed to load opportunities"
                        message={error}
                        resetError={handleRefresh}
                      />
                    )}
                    
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="text-center py-8">
                          <LoadingSpinner size="lg" text="Loading opportunities..." />
                        </div>
                        <CardLoadingSkeleton />
                        <CardLoadingSkeleton />
                        <CardLoadingSkeleton />
                      </div>
                    ) : (
                      <ErrorBoundary
                        fallback={
                          <ErrorFallback 
                            title="Opportunities Display Error"
                            message="Unable to display betting opportunities"
                            resetError={handleRefresh}
                          />
                        }
                      >
                        <OpportunityList
                          opportunities={opportunities}
                          stake={parseFloat(stake) || 100}
                          betType={betType}
                          onRefresh={handleRefresh}
                        />
                      </ErrorBoundary>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="log">
                  <ErrorBoundary
                    fallback={
                      <ErrorFallback 
                        title="Bet Logs Error"
                        message="Unable to load your betting logs"
                      />
                    }
                  >
                    <BetLogList betLogs={mockBetLogs} />
                  </ErrorBoundary>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 