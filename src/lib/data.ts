import { Trade } from "./types"

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
  },
]

export const tags = ["swing", "day", "scalp", "earnings", "breakout", "resistance", "support", "stop-loss", "index"]

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
