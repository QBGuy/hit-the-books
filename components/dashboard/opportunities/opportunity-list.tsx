"use client"

import { useState } from "react"
import { BetCard } from "../shared/bet-card"
import { BetLoggingModal } from "../shared/bet-logging-modal"

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
  stake2?: number
  betfairScalar?: number
  bookie?: string
}

interface OpportunityListProps {
  opportunities: Opportunity[]
  stake: string
  betType: string
  onRefresh?: () => void
}

export function OpportunityList({ opportunities, stake, betType, onRefresh }: OpportunityListProps) {
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null)
  const [loggingOpportunity, setLoggingOpportunity] = useState<Opportunity | null>(null)

  const handleCardClick = (opportunityId: number) => {
    setExpandedOpportunity(prev => prev === opportunityId ? null : opportunityId)
  }

  const handleLogBet = (opportunity: Opportunity) => {
    setLoggingOpportunity(opportunity)
  }

  const handleModalSuccess = () => {
    setLoggingOpportunity(null)
    onRefresh?.() // Refresh data after successful bet logging
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Opportunities Available</h3>
        <p className="text-slate-600">Click refresh to fetch the latest betting opportunities</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <BetCard
            key={opportunity.id}
            sport={opportunity.sport}
            team1={opportunity.team1}
            team2={opportunity.team2}
            bookie1={opportunity.bookie1}
            bookie2={opportunity.bookie2}
            odds1={opportunity.odds1}
            odds2={opportunity.odds2}
            stake={stake}
            isExpanded={expandedOpportunity === opportunity.id}
            onClick={() => handleCardClick(opportunity.id)}
            onLogBet={() => handleLogBet(opportunity)}
            type="opportunity"
            showLogButton={true}
          />
        ))}
      </div>

      {loggingOpportunity && (
        <BetLoggingModal
          isOpen={!!loggingOpportunity}
          onClose={() => setLoggingOpportunity(null)}
          opportunity={{
            sport: loggingOpportunity.sport,
            team1: loggingOpportunity.team1,
            team2: loggingOpportunity.team2,
            bookie1: loggingOpportunity.bookie1,
            bookie2: loggingOpportunity.bookie2,
            odds1: parseFloat(loggingOpportunity.odds1),
            odds2: parseFloat(loggingOpportunity.odds2),
            stake2: loggingOpportunity.stake2 || parseFloat(stake),
            profit: parseFloat(loggingOpportunity.profit || "0"),
            betfairScalar: loggingOpportunity.betfairScalar || 1,
            betType: (betType === "bonus" ? "bonus" : "turnover") as "bonus" | "turnover",
            bookie: loggingOpportunity.bookie || loggingOpportunity.bookie1
          }}
          userStake={parseFloat(stake)}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  )
} 