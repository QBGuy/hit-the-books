"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/betting/calculations"

interface BetLoggingModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: {
    sport: string
    team1: string
    team2: string
    bookie1: string
    bookie2: string
    odds1: number
    odds2: number
    stake2: number
    profit: number
    betfairScalar: number
    betType: "bonus" | "turnover"
    bookie: string
  }
  userStake: number
  calculatedStake1?: number
  calculatedStake2?: number
  onSuccess: () => void
}

export function BetLoggingModal({
  isOpen,
  onClose,
  opportunity,
  userStake,
  calculatedStake1,
  calculatedStake2,
  onSuccess
}: BetLoggingModalProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Use calculated stakes if available, otherwise fallback to userStake
  const stake1Display = calculatedStake1 !== undefined ? calculatedStake1 : userStake
  const stake2Display = calculatedStake2 !== undefined ? calculatedStake2 : userStake

  const handleLogBet = async () => {
    setIsLogging(true)
    
    try {
      // Simulate API call to log the bet
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Logging bet:", {
        sport: opportunity.sport,
        team1: opportunity.team1,
        team2: opportunity.team2,
        bookie1: opportunity.bookie1,
        bookie2: opportunity.bookie2,
        odds1: opportunity.odds1,
        odds2: opportunity.odds2,
        stake1: stake1Display,
        stake2: stake2Display,
        profit: opportunity.profit,
        betType: opportunity.betType
      })
      
      setIsSuccess(true)
      
      // Close modal after showing success
      setTimeout(() => {
        onSuccess()
        onClose()
        setIsSuccess(false)
      }, 1500)
      
    } catch (error) {
      console.error("Failed to log bet:", error)
    } finally {
      setIsLogging(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Bet Logged Successfully!</h3>
            <p className="text-slate-600">Your bet has been saved to your betting log.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Badge variant="outline">{opportunity.sport}</Badge>
            <span>Log Bet</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bet Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="text-center">
                  <Badge variant="outline" className="text-xs mb-2">{opportunity.betType}</Badge>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg text-slate-900">{opportunity.team1}</p>
                  <p className="text-sm text-slate-500">{opportunity.bookie1}</p>
                  <p className="text-xl font-bold text-emerald-600">{opportunity.odds1}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(stake1Display)}</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-400 font-medium">VS</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg text-slate-900">{opportunity.team2}</p>
                  <p className="text-sm text-slate-500">{opportunity.bookie2}</p>
                  <p className="text-xl font-bold text-emerald-600">{opportunity.odds2}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(stake2Display)}</p>
                </div>

                <div className="text-center bg-emerald-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(opportunity.profit)}</p>
                  <p className="text-xs text-slate-600">Expected Profit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLogging}>
              Cancel
            </Button>
            <Button 
              onClick={handleLogBet}
              disabled={isLogging}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLogging ? "Logging..." : "Log This Bet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 