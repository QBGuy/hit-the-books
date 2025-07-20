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
import { useBetLogs } from "@/hooks/use-bet-logs"
import { ErrorBoundary, ErrorFallback } from "@/components/ui/error-boundary"
import { LoadingSpinner, CardLoadingSkeleton } from "@/components/ui/loading-spinner"
import { useUserActions } from "@/hooks/use-user-actions"

export function DashboardLayout() {
  const [stake, setStake] = useState("100")
  const [betType, setBetType] = useState("bonus")
  const [selectedBookie, setSelectedBookie] = useState("all")
  const [activeTab, setActiveTab] = useState("opportunities")
  
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
    autoRefresh: false, // Disable auto-refresh, only refresh on manual button click
    refreshInterval: 60000
  })

  // Use the bet logs hook
  const {
    betLogs,
    isLoading: betLogsLoading,
    error: betLogsError,
    total: betLogsTotal,
    refresh: refreshBetLogs,
    removeBetLog
  } = useBetLogs({
    betType: betType === 'all' ? undefined : betType,
    bookie: selectedBookie === 'all' ? undefined : selectedBookie,
    limit: 50
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

  useEffect(() => {
    if (betLogsError) {
      logError(betLogsError, { 
        context: 'dashboard_bet_logs',
        filters: { betType, selectedBookie }
      })
    }
  }, [betLogsError, logError, betType, selectedBookie])

  const handleRefresh = () => {
    if (activeTab === "log") {
      // Refresh bet logs when on Bet Log tab
      refreshBetLogs()
    } else {
      // Refresh opportunities when on Opportunities tab
      logOpportunitiesRefresh({ betType, selectedBookie, stake })
      refresh()
    }
  }

  const handleBetLogged = () => {
    // Refresh bet logs when a new bet is logged
    refreshBetLogs()
  }

  const handleBetDeleted = async () => {
    // Refresh bet logs when a bet is deleted
    await refreshBetLogs()
  }

  const handleDeleteBet = async (betId: string) => {
    try {
      await removeBetLog(betId)
      // The removeBetLog function already handles optimistic updates
    } catch (error) {
      console.error('Error deleting bet:', error)
      // Refresh to ensure UI is in sync
      await refreshBetLogs()
    }
  }

  // Generate dynamic title based on bet type and active tab
  const getDashboardTitle = () => {
    if (activeTab === "log") {
      return "Bet Log"
    }
    
    if (betType === "bonus") {
      return "Bonus Opportunities"
    } else if (betType === "turnover") {
      return "Turnover Opportunities"
    }
    
    return "Hit the Books Dashboard"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <div className="flex">
        {/* Controls Panel */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <ControlsPanel
            stake={stake}
            setStake={setStake}
            betType={betType}
            setBetType={setBetType}
            selectedBookie={selectedBookie}
            setSelectedBookie={setSelectedBookie}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
          <UserSection />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                <span>{getDashboardTitle()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="opportunities" 
                className="space-y-4"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2">
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
                    Bet Log ({betLogsTotal})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="opportunities">
                  <div className="space-y-4">
                    <DataFreshnessIndicator
                      lastUpdated={lastUpdated}
                      ageInSeconds={ageInSeconds}
                      isStale={isStale}
                      isFresh={isFresh}
                      needsRefresh={needsRefresh}
                      isRefreshing={isRefreshing}
                    />
                    
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
                          onBetLogged={handleBetLogged}
                          onSwitchToLogs={() => setActiveTab("log")}
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
                    <BetLogList 
                      betLogs={betLogs} 
                      isLoading={betLogsLoading}
                      error={betLogsError}
                      onDeleteBet={handleDeleteBet}
                      onBetDeleted={handleBetDeleted}
                    />
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