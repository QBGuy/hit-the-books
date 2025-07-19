"use client"

import { BetCard } from "../shared/bet-card"

interface BetLog {
  id: number
  date: string
  sport: string
  teams: string
  stake: string
  profit: string
  status: string
}

interface BetLogListProps {
  betLogs: BetLog[]
}

export function BetLogList({ betLogs }: BetLogListProps) {
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
    <div className="space-y-4">
      {betLogs.map((log) => (
        <BetCard
          key={log.id}
          sport={log.sport}
          team1={log.teams.split(" vs ")[0]}
          team2={log.teams.split(" vs ")[1]}
          bookie1="Sportsbet" // These would come from actual log data
          bookie2="Betfair"
          odds1={parseFloat("2.1")} // These would come from actual log data
          odds2={parseFloat("2.05")}
          stake={parseFloat(log.stake.replace('$', ''))}
          date={log.date}
          status={log.status}
          profit={log.profit}
          type="log"
        />
      ))}
    </div>
  )
} 