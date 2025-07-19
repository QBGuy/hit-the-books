"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import moment from "moment-timezone"

interface DataFreshnessIndicatorProps {
  lastUpdated: Date | null
  ageInSeconds: number
  isStale: boolean
  isFresh: boolean
  needsRefresh: boolean
  isRefreshing: boolean
}

export function DataFreshnessIndicator({
  lastUpdated,
  ageInSeconds,
  isStale,
  isFresh,
  needsRefresh,
  isRefreshing
}: DataFreshnessIndicatorProps) {
  const formatAge = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const getFreshnessColor = () => {
    if (isRefreshing) return "secondary"
    if (isFresh) return "default"
    if (isStale) return "destructive"
    return "secondary"
  }

  const getFreshnessIcon = () => {
    if (isRefreshing) return <Clock className="h-3 w-3 animate-pulse" />
    if (isFresh) return <CheckCircle className="h-3 w-3" />
    if (isStale) return <AlertCircle className="h-3 w-3" />
    return <Clock className="h-3 w-3" />
  }

  const getFreshnessText = () => {
    if (isRefreshing) return "Refreshing..."
    if (!lastUpdated) return "No data"
    return formatAge(ageInSeconds)
  }

  // Convert UTC timestamp to Sydney time for display
  const formatSydneyTime = (date: Date): string => {
    return moment(date).tz("Australia/Sydney").format("h:mm:ss A")
  }

  return (
    <div className="flex items-center gap-3">
      <Badge variant={getFreshnessColor()} className="text-xs">
        {getFreshnessIcon()}
        <span className="ml-1">{getFreshnessText()}</span>
      </Badge>
      
      {lastUpdated && (
        <span className="text-xs text-slate-500">
          Last updated: {formatSydneyTime(lastUpdated)} (Sydney)
        </span>
      )}
    </div>
  )
} 