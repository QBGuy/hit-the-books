"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BetCardProps {
  sport: string
  team1: string
  team2: string
  bookie1: string
  bookie2: string
  odds1: string
  odds2: string
  stake: string
  isExpanded?: boolean
  onClick?: () => void
  onLogBet?: () => void
  profit?: string
  showLogButton?: boolean
  date?: string
  status?: string
  type?: "opportunity" | "log"
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
  profit,
  showLogButton = false,
  date,
  status,
  type = "opportunity"
}: BetCardProps) {
  const calculateProfit = () => {
    const stakeAmount = Number.parseFloat(stake)
    const odds1Num = Number.parseFloat(odds1)
    const odds2Num = Number.parseFloat(odds2)
    return (stakeAmount * odds1Num + stakeAmount * odds2Num - stakeAmount * 2).toFixed(2)
  }

  const calculatedProfit = profit || calculateProfit()

  return (
    <Card
      className={`border border-slate-200 hover:border-emerald-300 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${isExpanded ? "border-emerald-500" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header Row with Sport and Teams */}
          <div className="grid grid-cols-5 gap-6 items-center">
            <div className="flex flex-col items-center space-y-1">
              <Badge variant="outline" className="text-xs">
                {sport}
              </Badge>
              {date && <p className="text-xs text-slate-500">{date}</p>}
            </div>

            <div className="text-center">
              <p className="font-semibold text-lg text-slate-900">{team1}</p>
              <p className="text-sm text-slate-500">{bookie1}</p>
              <p className="text-xl font-bold text-emerald-600">{odds1}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">${stake}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400 font-medium">VS</p>
            </div>

            <div className="text-center">
              <p className="font-semibold text-lg text-slate-900">{team2}</p>
              <p className="text-sm text-slate-500">{bookie2}</p>
              <p className="text-xl font-bold text-emerald-600">{odds2}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">${stake}</p>
            </div>

            <div className="text-center bg-emerald-50 rounded-lg p-3">
              <p className="text-xl font-bold text-emerald-600">${calculatedProfit}</p>
              <p className="text-xs text-slate-600">Profit</p>
              {status && <Badge variant={status === "Won" ? "default" : "secondary"} className="mt-1 text-xs">{status}</Badge>}
            </div>
          </div>

          {/* Expanded Summary Row */}
          {isExpanded && type === "opportunity" && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-slate-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-slate-900">
                    ${(Number.parseFloat(stake) * 2).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-600">Outlay</p>
                </div>
                <div className="text-center bg-emerald-50 rounded-lg p-3">
                  <p className="text-lg font-bold text-emerald-600">
                    $
                    {(
                      Number.parseFloat(stake) * Number.parseFloat(odds1) +
                      Number.parseFloat(stake) * Number.parseFloat(odds2)
                    ).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-600">Payout</p>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3 flex items-center justify-center">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onLogBet?.()
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Log Bet
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 