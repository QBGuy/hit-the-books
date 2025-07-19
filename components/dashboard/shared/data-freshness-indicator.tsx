"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface DataFreshnessIndicatorProps {
  lastUpdated: Date | null
  ageInSeconds: number
  isStale: boolean
  isFresh: boolean
  needsRefresh: boolean
  isRefreshing: boolean
  onRefresh: () => void
}

export function DataFreshnessIndicator({
  lastUpdated,
  ageInSeconds,
  isStale,
  isFresh,
  needsRefresh,
  isRefreshing,
  onRefresh
}: DataFreshnessIndicatorProps) {
  const formatAge = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const getFreshnessColor = () => {
    if (isRefreshing) return "secondary"
    if (isFresh) return "default"
    if (needsRefresh) return "destructive"
    if (isStale) return "destructive"
    return "secondary"
  }

  const getFreshnessIcon = () => {
    if (isRefreshing) return <Loader2 className="h-3 w-3 animate-spin" />
    if (isFresh) return <CheckCircle className="h-3 w-3" />
    if (needsRefresh || isStale) return <AlertCircle className="h-3 w-3" />
    return <Clock className="h-3 w-3" />
  }

  const getFreshnessText = () => {
    if (isRefreshing) return "Refreshing..."
    if (!lastUpdated) return "No data"
    if (isFresh) return `Fresh (${formatAge(ageInSeconds)})`
    if (needsRefresh) return `Needs refresh (${formatAge(ageInSeconds)})`
    if (isStale) return `Stale (${formatAge(ageInSeconds)})`
    return formatAge(ageInSeconds)
  }

  return (
    <div className="flex items-center gap-3">
      <Badge variant={getFreshnessColor()} className="text-xs">
        {getFreshnessIcon()}
        <span className="ml-1">{getFreshnessText()}</span>
      </Badge>
      
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        {isRefreshing ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <RefreshCw className="h-3 w-3 mr-1" />
        )}
        Refresh
      </Button>
      
      {lastUpdated && (
        <span className="text-xs text-slate-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
} 