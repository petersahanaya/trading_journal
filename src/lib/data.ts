import { Trade, CashflowEntry } from "./types"

export function calculateWinRate(trades: Trade[]): number {
  const closed = trades.filter((t) => t.status === "closed")
  if (closed.length === 0) return 0
  const wins = closed.filter((t) => t.pnl !== null && t.pnl > 0)
  return Math.round((wins.length / closed.length) * 100)
}

export function calculateTotalPnl(trades: Trade[]): number {
  return trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
}

export function calculateTotalTrades(trades: Trade[]): number {
  return trades.length
}

export function calculateOpenTrades(trades: Trade[]): number {
  return trades.filter((t) => t.status === "open").length
}

export function calculateDailyPnl(trades: Trade[]): { date: string; pnl: number }[] {
  const map: Record<string, number> = {}
  for (const t of trades) {
    if (t.pnl !== null) {
      map[t.date] = (map[t.date] ?? 0) + t.pnl
    }
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => ({ date, pnl }))
}

export interface PositionSizeResult {
  riskPerShare: number
  positionSize: number
  totalRisk: number
  shares: number
}

export function calculateTotalDeposits(cashflow: CashflowEntry[]): number {
  return cashflow
    .filter((e) => e.type === "deposit")
    .reduce((sum, e) => sum + e.amount, 0)
}

export function calculateTotalWithdrawals(cashflow: CashflowEntry[]): number {
  return cashflow
    .filter((e) => e.type === "withdrawal")
    .reduce((sum, e) => sum + e.amount, 0)
}

export function calculatePnlPercent(pnl: number, deposits: number): number | null {
  if (deposits <= 0) return null
  return Math.round((pnl / deposits) * 10000) / 100
}

export function calculatePositionSize(
  accountBalance: number,
  riskPercent: number,
  entryPrice: number,
  stopPrice: number,
): PositionSizeResult {
  const riskAmount = accountBalance * (riskPercent / 100)
  const riskPerShare = Math.abs(entryPrice - stopPrice)
  const shares = Math.floor(riskAmount / riskPerShare)
  const positionSize = shares * entryPrice
  const totalRisk = shares * riskPerShare
  return { riskPerShare, positionSize, totalRisk, shares }
}
