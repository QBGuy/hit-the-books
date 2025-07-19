"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/hit-the-books-logo.png" alt="Hit the Books" className="h-14" />
        </div>
      </div>
    </div>
  )
}

export function UserSection() {
  const { user, signOut } = useAuth()

  return (
    <div className="p-6 border-t border-slate-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex items-center space-x-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-900">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-slate-500">Premium Member</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
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
  )
} 