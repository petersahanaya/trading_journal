"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUpIcon, BarChart3Icon, SettingsIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Dashboard", icon: TrendingUpIcon },
  { href: "/analytics", label: "Analytics", icon: BarChart3Icon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 backdrop-blur-lg md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around py-1">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] transition-colors",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-5", isActive && "text-foreground")} />
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
