"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { formatCurrency, formatPercentage, calculateBetOutcomes } from "@/lib/betting/calculations"

interface BetCardProps {
  sport: string
  team1: string
  team2: string
  bookie1: string
  bookie2: string
  odds1: number
  odds2: number
  stake: number
  isExpanded?: boolean
  onClick?: () => void
  onLogBet?: () => void
  onDeleteBet?: () => void
  profit?: string
  profitPercentage?: number
  showLogButton?: boolean
  date?: string
  status?: string
  type?: "opportunity" | "log"
  // Additional calculation props for opportunities
  calculatedStake1?: number
  calculatedStake2?: number
  calculatedOutlay?: number
  calculatedTotalPayout?: number
  calculatedProfit?: number
  betfairScalar?: number
  betType?: "bonus" | "turnover"
}

export function BetCard({
  sport,
  team1,
  team2,
  bookie1,
  bookie2,
  odds1,
  odds2,
  stake,
  isExpanded = false,
  onClick,
  onLogBet,
  onDeleteBet,
  profit,
  profitPercentage,
  showLogButton = false,
  date,
  status,
  type = "opportunity",
  calculatedStake1,
  calculatedStake2,
  calculatedOutlay,
  calculatedTotalPayout,
  calculatedProfit,
  betfairScalar = 1,
  betType = "bonus"
}: BetCardProps) {
  
  // Use proper calculations if we have the required data, otherwise fallback to simple calculation
  const calculations = (calculatedStake1 !== undefined && calculatedStake2 !== undefined) 
    ? {
        stake1: calculatedStake1,
        stake2: calculatedStake2,
        outlay: calculatedOutlay || (calculatedStake1 * (betType === "bonus" ? 0 : 1) + calculatedStake2),
        totalPayout: calculatedTotalPayout || Math.min(stake * odds1, stake * odds2),
        profit: calculatedProfit || 0
      }
    : (() => {
        // Fallback calculation for log entries that don't have calculated fields
        const isBonus = betType === "bonus"
        const result = calculateBetOutcomes({
          stake,
          odds1,
          odds2,
          stake2Ratio: calculatedStake2 ? calculatedStake2 / stake : 1, // Use ratio if available
          betfairScalar,
          isBonus,
          bookie1,
          bookie2
        })
        return {
          stake1: result.stake1,
          stake2: result.stake2,
          outlay: result.outlay,
          totalPayout: result.totalPayout,
          profit: result.profit
        }
      })()

  const calculatedProfitDisplay = profit || formatCurrency(calculations.profit)
  // Remove decimal places from profit percentage
  const displayProfitPercentage = profitPercentage ? `${Math.round(profitPercentage)}%` : null

  return (
    <Card
      className={`border border-slate-200 hover:border-emerald-300 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${isExpanded ? "border-emerald-500" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Row with Sport and Teams */}
          <div className="grid grid-cols-5 gap-6 items-center">
            <div className="flex flex-col items-center space-y-1">
              <Badge variant="outline" className="text-sm">
                {sport}
              </Badge>
              {date && <p className="text-xs text-slate-500">{date}</p>}
            </div>

            <div className="text-center">
              <p className="font-semibold text-lg text-slate-900">{team1}</p>
              <p className="text-sm text-slate-500">{bookie1}</p>
              <p className="text-xl font-bold text-emerald-600">{odds1.toFixed(2)}</p>
              <p className="text-lg font-bold mt-1">
                {betType === "bonus" ? (
                  <span className="text-emerald-600">{formatCurrency(stake)} bonus</span>
                ) : (
                  <span className="text-slate-900">{formatCurrency(stake)}</span>
                )}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400 font-medium">VS</p>
            </div>

            <div className="text-center">
              <p className="font-semibold text-lg text-slate-900">{team2}</p>
              <p className="text-sm text-slate-500">{bookie2}</p>
              <p className="text-xl font-bold text-emerald-600">{odds2.toFixed(2)}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {formatCurrency(calculations.stake2)}
              </p>
            </div>

            <div className="text-center bg-emerald-50 rounded-lg p-3">
              <p className="text-xl font-bold text-emerald-600">{calculatedProfitDisplay}</p>
              <p className="text-xs text-slate-600">
                Profit {displayProfitPercentage && `(${displayProfitPercentage})`}
              </p>
              {status && <Badge variant={status === "Won" ? "default" : "secondary"} className="mt-1 text-xs">{status}</Badge>}
            </div>
          </div>

          {/* Expanded Summary Row */}
          {isExpanded && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-slate-50 rounded-lg p-1">
                  <p className="text-base font-bold text-slate-900">
                    {formatCurrency(calculations.outlay)}
                  </p>
                  <p className="text-xs text-slate-600">Outlay</p>
                </div>
                <div className="text-center bg-emerald-50 rounded-lg p-1">
                  <p className="text-base font-bold text-emerald-600">
                    {formatCurrency(calculations.totalPayout)}
                  </p>
                  <p className="text-xs text-slate-600">Guaranteed Payout</p>
                </div>
                {type === "log" ? (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteBet?.()
                    }}
                    className="text-center bg-red-600 hover:bg-red-700 rounded-lg p-1 cursor-pointer flex items-center justify-center"
                  >
                    <span className="text-base font-bold text-white flex items-center">
                      <Trash2 className="h-3 w-3 mr-1.5" />
                      Delete Bet
                    </span>
                  </div>
                ) : (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation()
                      onLogBet?.()
                    }}
                    className="text-center bg-emerald-600 hover:bg-emerald-700 rounded-lg p-1 cursor-pointer flex items-center justify-center"
                  >
                    <span className="text-base font-bold text-white">Log Bet</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 