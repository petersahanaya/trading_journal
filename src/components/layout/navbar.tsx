"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUpIcon, BarChart3Icon, SettingsIcon, SearchIcon, BellIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Dashboard", icon: TrendingUpIcon },
  { href: "/analytics", label: "Analytics", icon: BarChart3Icon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 hidden w-full md:block supports-backdrop-filter:bg-background/60">
      <div className="absolute inset-0 bg-surface-container-lowest/70 backdrop-blur-xl border-b border-outline-variant/50" />
      <div className="relative mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
              <TrendingUpIcon className="size-4 text-primary-foreground" />
            </div>
            <span className="text-[15px] tracking-tight">Trading Journal</span>
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
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all",
                    isActive
                      ? "bg-primary-container/20 font-medium text-primary"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden lg:flex items-center">
            <SearchIcon className="absolute left-2.5 size-3.5 text-on-surface-variant pointer-events-none" />
            <input
              type="search"
              placeholder="Search trades..."
              className="h-8 w-44 rounded-lg bg-surface-container-low pl-8 pr-3 text-xs text-foreground placeholder:text-on-surface-variant border border-outline-variant/50 outline-none focus:border-primary/50 focus:w-56 transition-all"
            />
          </div>
          <Button variant="ghost" size="icon-sm" className="relative rounded-full" aria-label="Notifications">
            <BellIcon className="size-4 text-on-surface-variant" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          </Button>
          <div className="flex size-7 items-center justify-center rounded-full bg-primary-container/30 text-xs font-semibold text-primary">
            PJ
          </div>
        </div>
      </div>
    </header>
  )
}
