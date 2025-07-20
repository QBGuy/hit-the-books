"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/hit-the-books-logo.png" alt="Hit the Books" className="h-14" />
        </div>
        
        {/* User Section moved to top right */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm text-slate-600 border-b border-slate-200 mb-1">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </div>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// Remove the UserSection component since it's now integrated into DashboardHeader 