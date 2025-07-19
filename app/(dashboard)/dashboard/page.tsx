"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Target, Zap, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/hit-the-books-logo.png" alt="Hit the Books" className="h-8" />
            <span className="text-xl font-bold text-slate-900">Hit the Books</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Welcome, {user.user_metadata?.name || user.email}</span>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Controls - Simplified for now */}
        <div className="w-80 bg-white border-r border-slate-200 shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-emerald-600 mr-2" />
              Controls
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Bet Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="bg-emerald-600 text-white">Bonus</Button>
                  <Button variant="outline">Turnover</Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Stake</label>
                <input 
                  type="number" 
                  defaultValue="100" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter stake amount"
                />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                <span>Betting Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="opportunities" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                  <TabsTrigger
                    value="opportunities"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Opportunities
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Logs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="opportunities">
                  <div className="space-y-4">
                    <Card className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="text-center py-8">
                          <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Opportunities Available</h3>
                          <p className="text-slate-600 mb-4">Click refresh to fetch the latest betting opportunities</p>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Opportunities
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="logs">
                  <div className="space-y-4">
                    <Card className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="text-center py-8">
                          <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Bet Logs</h3>
                          <p className="text-slate-600">Your logged bets will appear here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 