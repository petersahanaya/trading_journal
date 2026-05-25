"use client"

import { Navbar } from "@/components/layout/navbar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { ThemeProvider } from "@/components/theme-provider"

export function RootApp({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="mx-auto min-h-dvh w-full max-w-5xl px-5 pb-28 pt-5 md:pb-12 md:pt-20 sm:px-6 lg:px-8">
        {children}
      </main>
      <MobileBottomNav />
    </ThemeProvider>
  )
}
