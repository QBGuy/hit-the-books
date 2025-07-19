"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/betting/calculations"
import { BetLog } from "@/hooks/use-bet-logs"

interface BetDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  betLog: BetLog
  onSuccess: () => void
  onDelete: (betId: string) => Promise<void>
}

export function BetDeleteModal({
  isOpen,
  onClose,
  betLog,
  onSuccess,
  onDelete
}: BetDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteBet = async () => {
    setIsDeleting(true)
    setError(null)
    
    try {
      await onDelete(betLog.id)
      
      setIsSuccess(true)
      
      // Close modal after showing success
      setTimeout(() => {
        onSuccess()
        onClose()
        setIsSuccess(false)
      }, 1500)
      
    } catch (error) {
      console.error("Failed to delete bet:", error)
      setError(error instanceof Error ? error.message : "Failed to delete bet")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Bet Deleted Successfully!</h3>
            <p className="text-slate-600">Your bet has been removed from your betting log.</p>
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
            <Trash2 className="h-5 w-5 text-red-600" />
            <Badge variant="outline">{betLog.sport}</Badge>
            <span>Delete Bet</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Warning:</strong> This action cannot be undone. Are you sure you want to delete this bet?
            </p>
          </div>

          {/* Bet Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="text-center">
                  <Badge variant="outline" className="text-xs mb-2">{betLog.bet_type}</Badge>
                  <p className="text-xs text-slate-500">{new Date(betLog.timestamp).toLocaleDateString()}</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg text-slate-900">{betLog.team_1}</p>
                  <p className="text-sm text-slate-500">{betLog.bookie_1}</p>
                  <p className="text-xl font-bold text-emerald-600">{betLog.odds_1}</p>
                  <p className="text-lg font-bold mt-1">
                    {betLog.bet_type === "bonus" ? (
                      <span className="text-emerald-600">{formatCurrency(betLog.stake_1)} bonus</span>
                    ) : (
                      <span className="text-slate-900">{formatCurrency(betLog.stake_1)}</span>
                    )}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-400 font-medium">VS</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg text-slate-900">{betLog.team_2}</p>
                  <p className="text-sm text-slate-500">{betLog.bookie_2}</p>
                  <p className="text-xl font-bold text-emerald-600">{betLog.odds_2}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(betLog.stake_2)}</p>
                </div>

                <div className="text-center bg-emerald-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-emerald-600">
                    {betLog.profit_actual !== null ? formatCurrency(betLog.profit_actual) : formatCurrency(betLog.profit)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {betLog.profit_actual !== null ? "Actual Profit" : "Expected Profit"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteBet}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Bet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}