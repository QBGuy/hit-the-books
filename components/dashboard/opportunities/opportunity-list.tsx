"use client"

import { useState } from "react"
import { BetCard } from "../shared/bet-card"
import { BetLoggingModal } from "../shared/bet-logging-modal"
import { Opportunity } from "@/lib/betting/opportunities"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface OpportunityListProps {
  opportunities: Opportunity[]
  stake: number
  betType: string
  onBetLogged?: () => void
}

export function OpportunityList({ opportunities, stake, betType, onBetLogged }: OpportunityListProps) {
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null)
  const [loggingOpportunity, setLoggingOpportunity] = useState<Opportunity | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleCardClick = (opportunityId: string) => {
    setExpandedOpportunity(prev => prev === opportunityId ? null : opportunityId)
  }

  const handleLogBet = (opportunity: Opportunity) => {
    setLoggingOpportunity(opportunity)
  }

  const handleModalSuccess = () => {
    setLoggingOpportunity(null)
    onBetLogged?.()
  }

  // Calculate pagination
  const totalPages = Math.ceil(opportunities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOpportunities = opportunities.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
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
        <p className="text-slate-600">Use the refresh button in the controls panel to fetch the latest betting opportunities</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {currentOpportunities.map((opportunity) => (
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
            profit={opportunity.calculatedProfitAmount}
            profitPercentage={opportunity.profitPercentage}
            isExpanded={expandedOpportunity === opportunity.id}
            onClick={() => handleCardClick(opportunity.id)}
            onLogBet={() => handleLogBet(opportunity)}
            type="opportunity"
            showLogButton={true}
            // Pass calculated values to BetCard
            calculatedStake1={opportunity.calculatedStake1}
            calculatedStake2={opportunity.calculatedStake2}
            calculatedOutlay={opportunity.calculatedOutlay}
            calculatedTotalPayout={opportunity.calculatedTotalPayout}
            calculatedProfit={opportunity.calculatedProfit}
            betfairScalar={opportunity.betfairScalar}
            betType={opportunity.betType}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Bet Logging Modal */}
      {loggingOpportunity && (
        <BetLoggingModal
          isOpen={true}
          onClose={() => setLoggingOpportunity(null)}
          opportunity={loggingOpportunity}
          userStake={stake}
          calculatedStake1={loggingOpportunity.calculatedStake1}
          calculatedStake2={loggingOpportunity.calculatedStake2}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  )
} 