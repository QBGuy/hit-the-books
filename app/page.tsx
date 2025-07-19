"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, TrendingUp, Shield, Clock, BarChart3 } from "lucide-react"
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

  const features = [
    {
      icon: <Target className="h-8 w-8 text-emerald-600" />,
      title: "Arbitrage Opportunities",
      description: "Find guaranteed profit opportunities across multiple bookmakers with real-time odds comparison.",
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-600" />,
      title: "Instant Alerts",
      description: "Get notified immediately when profitable betting opportunities arise, so you never miss a chance.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "Profit Tracking",
      description: "Track your betting history, profits, and performance with detailed analytics and reporting.",
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Risk Management",
      description: "Built-in calculators and risk assessment tools to help you bet responsibly and profitably.",
    },
    {
      icon: <Clock className="h-8 w-8 text-emerald-600" />,
      title: "Real-Time Data",
      description: "Access live odds from major bookmakers updated every few seconds for maximum accuracy.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
      title: "Smart Analytics",
      description: "Advanced algorithms identify the most profitable opportunities and optimal stake distributions.",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/hit-the-books-logo.png" alt="Hit the Books" className="h-8" />
            <span className="text-xl font-bold text-slate-900">Hit the Books</span>
          </div>
          <Button onClick={signInWithGoogle} className="bg-emerald-600 hover:bg-emerald-700">
            Sign in with Google
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="outline" className="mb-6 text-emerald-600 border-emerald-600">
          Sports Betting Arbitrage Tool
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Find Profitable
          <span className="text-emerald-600"> Betting Opportunities</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover guaranteed profit opportunities in sports betting with our advanced arbitrage detection system. 
          Track your bets, analyze your performance, and maximize your returns.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button 
            onClick={signInWithGoogle}
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and insights you need to profit from sports betting arbitrage.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to start earning?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful bettors who use Hit the Books to find profitable opportunities every day.
          </p>
          <Button 
            onClick={signInWithGoogle}
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6 bg-white text-emerald-600 hover:bg-slate-100"
          >
            Sign in with Google
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/hit-the-books-logo.png" alt="Hit the Books" className="h-6" />
            <span className="text-lg font-semibold">Hit the Books</span>
          </div>
          <p className="text-slate-400">
            © {new Date().getFullYear()} Hit the Books. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
