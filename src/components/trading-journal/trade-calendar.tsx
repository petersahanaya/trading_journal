"use client"

import { useMemo, useState } from "react"
import { Trade } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"
import { useTradeStore } from "@/store/trade-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAY_NAMES_SHORT = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface TradeCalendarProps {
  trades: Trade[]
}

export function TradeCalendar({ trades }: TradeCalendarProps) {
  const currency = useTradeStore((s) => s.currency)
  const showValues = useTradeStore((s) => s.showValues)
  const [viewDate, setViewDate] = useState(new Date())
  const isMobile = useMediaQuery("(max-width: 767px)")

  const { weeks, monthLabel } = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startPad = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: { date: string; day: number; pnl: number; tradeCount: number }[] = []

    for (let i = 0; i < startPad; i++) {
      days.push({ date: "", day: 0, pnl: 0, tradeCount: 0 })
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      const dayTrades = trades.filter((t) => t.date === dateStr)
      const pnl = dayTrades.reduce((s, t) => s + (t.pnl ?? 0), 0)
      days.push({ date: dateStr, day: d, pnl, tradeCount: dayTrades.length })
    }

    const weeks: typeof days[] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return {
      weeks,
      monthLabel: `${MONTH_NAMES[month]} ${year}`,
    }
  }, [trades, viewDate])

  function goBack() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function goForward() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  function goToday() {
    setViewDate(new Date())
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={goBack} aria-label="Previous month" className="rounded-full">
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="xs" onClick={goToday} className="text-xs rounded-lg">
            Today
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={goForward} aria-label="Next month" className="rounded-full">
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px sm:gap-1">
        {(isMobile ? DAY_NAMES_SHORT : DAY_NAMES).map((name, i) => (
          <div key={DAY_NAMES[i]} className="text-center text-[10px] sm:text-xs font-medium text-on-surface-variant py-1">
            {name}
          </div>
        ))}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const hasTrades = day.tradeCount > 0
            const isToday = day.date === todayStr
            const pnlColor = hasTrades
              ? day.pnl > 0 ? "bg-green-500" : day.pnl < 0 ? "bg-red-500" : "bg-outline-variant"
              : null

            return (
              <div
                key={`${wi}-${di}`}
                className={cn(
                  "min-h-[2.5rem] sm:min-h-[3.5rem] rounded-xl flex flex-col items-center justify-center text-[11px] sm:text-xs relative group cursor-default px-px sm:px-0.5 transition-colors",
                  day.day === 0 ? "invisible" : hasTrades ? "bg-surface-container-low" : "bg-transparent",
                  isToday && "ring-1 ring-primary/30"
                )}
              >
                <span
                  className={cn(
                    "font-medium leading-tight",
                    hasTrades ? "text-foreground" : "text-on-surface-variant",
                    isToday && "text-primary"
                  )}
                >
                  {day.day}
                </span>
                {hasTrades && pnlColor && (
                  <div className="flex gap-0.5 mt-0.5">
                    <span className={cn("size-1.5 rounded-full", pnlColor)} />
                  </div>
                )}
                {hasTrades && !isMobile && (
                  <span className="text-[9px] leading-tight mt-0.5 text-on-surface-variant truncate max-w-full px-0.5">
                    {showValues ? formatCurrency(day.pnl, currency) : "****"}
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-green-500" /> Profitable
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-red-500" /> Losing
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-outline-variant" /> Breakeven
        </span>
      </div>
    </div>
  )
}
