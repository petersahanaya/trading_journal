"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUpIcon, BarChart3Icon, SettingsIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useTradeStore } from "@/store/trade-store"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Dashboard", icon: TrendingUpIcon },
  { href: "/analytics", label: "Analytics", icon: BarChart3Icon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
]

export function Navbar() {
  const pathname = usePathname()
  const showValues = useTradeStore((s) => s.showValues)
  const toggleShowValues = useTradeStore((s) => s.toggleShowValues)

  return (
    <header className="sticky top-0 z-40 hidden w-full border-b bg-background/80 backdrop-blur-md md:block supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <TrendingUpIcon className="size-5 text-foreground" />
            <span>Trading Journal</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={toggleShowValues} aria-label="Toggle values">
            {showValues ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
