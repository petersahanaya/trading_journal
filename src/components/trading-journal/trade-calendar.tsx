"use client"

import { useMemo, useState } from "react"
import { Trade } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"
import { useTradeStore } from "@/store/trade-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

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

  const selectedTrades = selectedDate
    ? trades.filter((t) => t.date === selectedDate)
    : []

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

  const [selYear, selMonth, selDay] = selectedDate ? selectedDate.split("-").map(Number) : [0, 0, 0]
  const formattedDate = selectedDate ? `${MONTH_NAMES[selMonth - 1]} ${selDay}, ${selYear}` : ""

  return (
    <>
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
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  onClick={() => day.date && setSelectedDate(day.date)}
                  className={cn(
                    "min-h-[2.5rem] sm:min-h-[3.5rem] rounded-xl flex flex-col items-center justify-center text-[11px] sm:text-xs relative px-px sm:px-0.5 transition-all",
                    day.day === 0 ? "invisible" : hasTrades ? "bg-surface-container-low hover:bg-surface-container" : "bg-transparent hover:bg-surface-container-low",
                    isToday && "ring-1 ring-primary/30",
                    hasTrades && "cursor-pointer active:scale-95"
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
                </button>
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

      <Dialog open={!!selectedDate} onOpenChange={(open) => { if (!open) setSelectedDate(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formattedDate}</DialogTitle>
            <DialogDescription>
              {selectedTrades.length} trade{selectedTrades.length !== 1 ? "s" : ""} on this day
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {selectedTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {trade.direction === "long"
                    ? <TrendingUpIcon className="size-3.5 shrink-0 text-green-500" />
                    : <TrendingDownIcon className="size-3.5 shrink-0 text-red-500" />
                  }
                  <div className="min-w-0">
                    <div className="font-medium truncate">{trade.ticker}</div>
                    <div className="text-xs text-on-surface-variant">
                      {trade.direction} &middot; {trade.account}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  {trade.status === "closed" && trade.pnl !== null ? (
                    <span className={cn(
                      "font-semibold tabular-nums",
                      trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {showValues ? formatCurrency(trade.pnl, currency) : "****"}
                    </span>
                  ) : (
                    <span className="text-xs text-on-surface-variant">Open</span>
                  )}
                  <div className="text-[10px] text-on-surface-variant">
                    {trade.lots} {trade.lots === 1 ? "lot" : "lots"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
