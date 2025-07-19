"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { FullPageLoading } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullPageLoading text="Loading dashboard..." />
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <DashboardLayout />
    </ErrorBoundary>
  )
} 