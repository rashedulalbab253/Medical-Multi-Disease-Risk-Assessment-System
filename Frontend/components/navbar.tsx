"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  showBackButton?: boolean
}

export function Navbar({ showBackButton = false }: NavbarProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    // If we're on a protected page, redirect to home
    if (pathname !== "/") {
      window.location.href = "/"
    }
  }

  return (
    <div className="container flex items-center justify-between py-4">
      <div>
        {showBackButton ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        ) : (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">HealthPredict</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {!showBackButton && !isAuthPage && (
          <>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Register</Link>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
