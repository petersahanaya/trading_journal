export type TradeDirection = "long" | "short"
export type TradeStatus = "open" | "closed"

export interface Trade {
  id: string
  date: string
  ticker: string
  direction: TradeDirection
  entryPrice: number
  exitPrice: number | null
  lots: number
  pnl: number | null
  status: TradeStatus
  notes: string
  tags: string[]
  stopLoss: number | null
  takeProfit: number | null
  account: string
}
