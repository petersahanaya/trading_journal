export type TradeDirection = "long" | "short"
export type TradeStatus = "open" | "closed"
export type CashflowType = "deposit" | "withdrawal"

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

export interface CashflowEntry {
  id: string
  type: CashflowType
  amount: number
  date: string
  account: string
  notes: string
}
