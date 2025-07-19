"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, DollarSign, Target } from "lucide-react"

interface ControlsPanelProps {
  stake: string
  setStake: (stake: string) => void
  betType: string
  setBetType: (betType: string) => void
  selectedBookie: string
  setSelectedBookie: (bookie: string) => void
  onRefresh: () => void
}

export function ControlsPanel({
  stake,
  setStake,
  betType,
  setBetType,
  selectedBookie,
  setSelectedBookie,
  onRefresh
}: ControlsPanelProps) {
  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-emerald-600 mr-2" />
          Controls
        </h3>

        {/* Bet Type */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-slate-700">Bet Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={betType === "bonus" ? "default" : "outline"}
              className={`${
                betType === "bonus"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              onClick={() => setBetType("bonus")}
            >
              Bonus
            </Button>
            <Button
              variant={betType === "turnover" ? "default" : "outline"}
              className={`${
                betType === "turnover"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              onClick={() => setBetType("turnover")}
            >
              Turnover
            </Button>
          </div>
        </div>

        {/* Stake */}
        <div className="space-y-3 mb-6">
          <Label htmlFor="stake" className="text-sm font-medium text-slate-700">
            Stake
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="stake"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 h-12 text-lg font-semibold"
              placeholder="100"
            />
          </div>
        </div>

        {/* Bookie */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-slate-700">Bookie</Label>
          <Select value={selectedBookie} onValueChange={setSelectedBookie}>
            <SelectTrigger className="bg-slate-50 border-slate-200 h-12">
              <SelectValue placeholder="Select bookie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookies</SelectItem>
              <SelectItem value="sportsbet">Sportsbet</SelectItem>
              <SelectItem value="betfair">Betfair</SelectItem>
              <SelectItem value="tab">TAB</SelectItem>
              <SelectItem value="ladbrokes">Ladbrokes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Button */}
        <Button 
          onClick={onRefresh}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  )
} 