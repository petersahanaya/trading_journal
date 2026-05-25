import { Trade, CashflowEntry } from "./types"

export const trades: Trade[] = [
  {
    id: "1",
    date: "2026-05-20",
    ticker: "NVDA",
    direction: "long",
    entryPrice: 125.50,
    exitPrice: 132.80,
    lots: 3,
    pnl: 730.00,
    status: "closed",
    notes: "Momentum play ahead of earnings. Sold into strength.",
    tags: ["swing", "earnings"],
    stopLoss: 122.00,
    takeProfit: 134.00,
    account: "Main",
  },
  {
    id: "2",
    date: "2026-05-19",
    ticker: "TSLA",
    direction: "short",
    entryPrice: 345.00,
    exitPrice: 332.50,
    lots: 2,
    pnl: 625.00,
    status: "closed",
    notes: "Resistance at $350, short on rejection.",
    tags: ["day", "resistance"],
    stopLoss: 352.00,
    takeProfit: 330.00,
    account: "Main",
  },
  {
    id: "3",
    date: "2026-05-18",
    ticker: "AAPL",
    direction: "long",
    entryPrice: 185.00,
    exitPrice: null,
    lots: 1.5,
    pnl: null,
    status: "open",
    notes: "Still holding, waiting for breakout above $190.",
    tags: ["swing", "breakout"],
    stopLoss: 180.00,
    takeProfit: 195.00,
    account: "Long-term",
  },
  {
    id: "4",
    date: "2026-05-17",
    ticker: "AMD",
    direction: "long",
    entryPrice: 160.00,
    exitPrice: 158.20,
    lots: 1,
    pnl: -108.00,
    status: "closed",
    notes: "Stop loss hit. Broke below support.",
    tags: ["day", "stop-loss"],
    stopLoss: 158.00,
    takeProfit: 168.00,
    account: "Main",
  },
  {
    id: "5",
    date: "2026-05-16",
    ticker: "SPY",
    direction: "long",
    entryPrice: 530.00,
    exitPrice: 534.50,
    lots: 5,
    pnl: 900.00,
    status: "closed",
    notes: "Trend following on index bounce.",
    tags: ["swing", "index"],
    stopLoss: 525.00,
    takeProfit: 540.00,
    account: "Main",
  },
]

export const tags = ["swing", "day", "scalp", "earnings", "breakout", "resistance", "support", "stop-loss", "index"]

export const accountOptions = ["Main", "Long-term", "Short-term", "Crypto", "Forex"]

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
