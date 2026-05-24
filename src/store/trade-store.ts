import { create } from "zustand"
import { Trade } from "@/lib/types"
import { trades as initialTrades } from "@/lib/data"

export type Currency = "usd" | "idr" | "cent"

interface TradeStore {
  trades: Trade[]
  currency: Currency
  showValues: boolean
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, trade: Trade) => void
  deleteTrade: (id: string) => void
  setCurrency: (currency: Currency) => void
  toggleShowValues: () => void
}

export const useTradeStore = create<TradeStore>((set) => ({
  trades: initialTrades,
  currency: "usd",
  showValues: true,
  addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
  updateTrade: (id, updated) =>
    set((state) => ({
      trades: state.trades.map((t) => (t.id === id ? updated : t)),
    })),
  deleteTrade: (id) =>
    set((state) => ({
      trades: state.trades.filter((t) => t.id !== id),
    })),
  setCurrency: (currency) => set({ currency }),
  toggleShowValues: () => set((state) => ({ showValues: !state.showValues })),
}))
