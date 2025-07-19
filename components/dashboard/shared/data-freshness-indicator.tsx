"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface DataFreshnessIndicatorProps {
  lastUpdated: Date
  ageInSeconds: number
  isStale: boolean
  isFresh: boolean
  needsRefresh: boolean
  onRefresh: () => void
  isRefreshing: boolean
}

export function DataFreshnessIndicator({
  lastUpdated,
  ageInSeconds,
  isStale,
  isFresh,
  needsRefresh,
  onRefresh,
  isRefreshing
}: DataFreshnessIndicatorProps) {
  const formatAge = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const getStatusBadge = () => {
    if (isRefreshing) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Refreshing...
        </Badge>
      )
    }
    
    if (isFresh) {
      return (
        <Badge variant="default" className="bg-emerald-100 text-emerald-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Fresh
        </Badge>
      )
    }
    
    if (needsRefresh) {
      return (
        <Badge variant="destructive" className="bg-orange-100 text-orange-700">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Needs Refresh
        </Badge>
      )
    }
    
    if (isStale) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Stale
        </Badge>
      )
    }
    
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Good
      </Badge>
    )
  }

  return (
    <Card className="border-slate-200 bg-slate-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusBadge()}
            <span className="text-sm text-slate-600">
              Last updated: {formatAge(ageInSeconds)}
            </span>
          </div>
          
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="h-8"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 