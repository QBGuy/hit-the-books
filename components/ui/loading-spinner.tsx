"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-emerald-600 ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-sm text-slate-600">{text}</p>}
    </div>
  )
}

export function FullPageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

export function CardLoadingSkeleton() {
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-5 gap-6 items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="h-6 w-12 bg-slate-200 rounded"></div>
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="h-6 w-20 bg-slate-200 rounded mx-auto"></div>
              <div className="h-4 w-16 bg-slate-200 rounded mx-auto"></div>
              <div className="h-8 w-12 bg-slate-200 rounded mx-auto"></div>
              <div className="h-6 w-16 bg-slate-200 rounded mx-auto"></div>
            </div>
            
            <div className="text-center">
              <div className="h-4 w-8 bg-slate-200 rounded mx-auto"></div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="h-6 w-20 bg-slate-200 rounded mx-auto"></div>
              <div className="h-4 w-16 bg-slate-200 rounded mx-auto"></div>
              <div className="h-8 w-12 bg-slate-200 rounded mx-auto"></div>
              <div className="h-6 w-16 bg-slate-200 rounded mx-auto"></div>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-20 bg-emerald-100 rounded-lg mx-auto"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 