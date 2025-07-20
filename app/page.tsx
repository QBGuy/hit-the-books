"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calculator, CheckCircle, DollarSign } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth/auth-provider"

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header - Integrated from dashboard-header.tsx */}
      <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/hit-the-books-logo.png" alt="Hit the Books" className="h-14" />
          </div>
          
          {/* Google Sign In Button */}
          <div className="flex items-center">
            <Button onClick={signInWithGoogle} className="bg-emerald-600 hover:bg-emerald-700">
              Sign in with Google
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
        
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Want <span className="text-emerald-600">free money</span>
                <br />
                from bookies?
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Buckle up — it's time to <strong className="text-emerald-600">Hit the Books</strong>.
              </p>

              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-emerald-500">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Bookies lure the average punter with shiny deposit promos.
                  <br />
                  But the clever punter flips the script.
                  <br />
                  <br />
                  Using <strong>mathematics</strong> to convert those promos into <strong>guaranteed profit</strong>.
                  <br />
                </p>
                <p className="text-emerald-700 font-semibold mt-3">No guessing. No gambling. Just pure edge.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={signInWithGoogle}
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                Start Extracting Profit
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 bg-transparent"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur-2xl opacity-20 transform rotate-6"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border">
              <img
                src="/app-screenshot.png"
                alt="Dashboard Preview"
                className="w-full h-96 object-cover"
                style={{ objectPosition: "top" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Four simple steps to guaranteed profit</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Find Bookies That Offer Deposit Bonuses</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{'"Deposit $100, get $100 in bonus bets."'}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <Calculator className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Convert the Bonus Bet</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Use your bonus bet on one outcome, and hedge on the opposite outcome at another bookie. You lock in a
                profit, no matter the result.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Turn Over Your Deposit</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Place and hedge bets using your original deposit. {"You'll"} lose a small amount - but {"it's"} required
                to unlock withdrawals.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Withdraw and Celebrate</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cash out your profit. Move on to the next bookie. Hooray.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Extracting Free Money?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Join thousands of clever punters who{"'ve"} already discovered the mathematical edge.
          </p>
          <Button 
            onClick={signInWithGoogle}
            size="lg" 
            variant="secondary" 
            className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-3"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 font-light">
            © {new Date().getFullYear()} Hit the Books. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
