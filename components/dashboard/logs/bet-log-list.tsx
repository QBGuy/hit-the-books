"use client"

import { useState } from "react"
import { BetCard } from "../shared/bet-card"
import { BetDeleteModal } from "../shared/bet-delete-modal"
import { BetLog } from "@/hooks/use-bet-logs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/betting/calculations"

interface BetLogListProps {
  betLogs: BetLog[]
  isLoading?: boolean
  error?: string | null
  onDeleteBet?: (betId: string) => Promise<void>
  onBetDeleted?: () => void
}

export function BetLogList({ betLogs, isLoading, error, onDeleteBet, onBetDeleted }: BetLogListProps) {
  const [expandedBet, setExpandedBet] = useState<string | null>(null)
  const [deletingBet, setDeletingBet] = useState<BetLog | null>(null)

  const handleCardClick = (betId: string) => {
    setExpandedBet(prev => prev === betId ? null : betId)
  }

  const handleDeleteBet = (bet: BetLog) => {
    setDeletingBet(bet)
  }

  const handleDeleteSuccess = () => {
    setDeletingBet(null)
    onBetDeleted?.()
  }
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load bet logs: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (betLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No bets logged yet</h3>
        <p className="text-slate-600">Your logged bets will appear here once you start logging them</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {betLogs.map((log) => (
          <BetCard
            key={log.id}
            sport={log.sport}
            team1={log.team_1}
            team2={log.team_2}
            bookie1={log.bookie_1}
            bookie2={log.bookie_2}
            odds1={log.odds_1}
            odds2={log.odds_2}
            stake={log.stake_1}
            date={new Date(log.timestamp).toLocaleDateString()}
            status={undefined} // Remove status tags
            profit={log.profit_actual !== null ? formatCurrency(log.profit_actual) : formatCurrency(log.profit)}
            type="log"
            betType={log.bet_type}
            betfairScalar={log.betfair_scalar}
            calculatedStake1={log.stake_1}
            calculatedStake2={log.stake_2}
            calculatedProfit={log.profit}
            isExpanded={expandedBet === log.id}
            onClick={() => handleCardClick(log.id)}
            onDeleteBet={() => handleDeleteBet(log)}
          />
        ))}
      </div>

      {/* Bet Delete Modal */}
      {deletingBet && onDeleteBet && (
        <BetDeleteModal
          isOpen={true}
          onClose={() => setDeletingBet(null)}
          betLog={deletingBet}
          onSuccess={handleDeleteSuccess}
          onDelete={onDeleteBet}
        />
      )}
    </>
  )
} 