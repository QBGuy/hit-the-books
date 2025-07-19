"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-600">
            There was an issue with the authentication process. This could happen if:
          </p>
          <ul className="text-sm text-slate-500 text-left space-y-1">
            <li>• The authentication code expired</li>
            <li>• There was a network issue</li>
            <li>• The authentication was cancelled</li>
          </ul>
          <div className="pt-4">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">Try Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 