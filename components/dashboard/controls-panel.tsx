"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, DollarSign, Target } from "lucide-react"

interface ControlsPanelProps {
  stake: string
  setStake: (stake: string) => void
  betType: string
  setBetType: (betType: string) => void
  selectedBookie: string
  setSelectedBookie: (bookie: string) => void
  onRefresh: () => void
  isRefreshing?: boolean
}

// Bookie mapping from display names to API values
const BOOKIE_MAPPING = {
  "Betright": "betright",
  "Betr": "betr_au", 
  "Ladbrokes": "ladbrokes_au",
  "Neds": "neds",
  "Pointsbetau": "pointsbetau",
  "Sportsbet": "sportsbet",
  "Tab": "tab",
  "Tabtouch": "tabtouch",
  "Playup": "playup",
  "Unibet": "unibet"
}

const BOOKIE_DISPLAY_NAMES = Object.keys(BOOKIE_MAPPING)

export function ControlsPanel({
  stake,
  setStake,
  betType,
  setBetType,
  selectedBookie,
  setSelectedBookie,
  onRefresh,
  isRefreshing = false
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

        {/* Bookie Selection */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-slate-700">Bookies</Label>
          <div className="space-y-2">
            {/* All Bookies Button */}
            <Button
              variant={selectedBookie === "all" ? "default" : "outline"}
              className={`w-full ${
                selectedBookie === "all"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              onClick={() => setSelectedBookie("all")}
            >
              All Bookies
            </Button>
            
            {/* Individual Bookie Buttons - 2 per row */}
            <div className="grid grid-cols-2 gap-2">
              {BOOKIE_DISPLAY_NAMES.map((displayName) => {
                const apiValue = BOOKIE_MAPPING[displayName as keyof typeof BOOKIE_MAPPING]
                const isSelected = selectedBookie === apiValue
                
                return (
                  <Button
                    key={apiValue}
                    variant={isSelected ? "default" : "outline"}
                    className={`${
                      isSelected
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                    onClick={() => setSelectedBookie(apiValue)}
                  >
                    {displayName}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <Button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`w-full h-12 ${
            isRefreshing 
              ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  )
} 