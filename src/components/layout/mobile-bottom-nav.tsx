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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-inset-bottom">
      <div className="absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/50" />
      <div className="relative flex items-center justify-around pb-1 pt-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-2 text-[10px] transition-all active:scale-90",
                isActive
                  ? "text-primary font-medium"
                  : "text-on-surface-variant"
              )}
            >
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
              <Icon className={cn("size-5", isActive && "text-primary")} />
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
