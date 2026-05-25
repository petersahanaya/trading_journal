import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Trade, CashflowEntry } from "@/lib/types"
import { trades as initialTrades } from "@/lib/data"

export type Currency = "usd" | "idr" | "cent"

interface TradeStore {
  trades: Trade[]
  cashflow: CashflowEntry[]
  currency: Currency
  showValues: boolean
  accounts: string[]
  addTrade: (trade: Trade) => void
  updateTrade: (id: string, trade: Trade) => void
  deleteTrade: (id: string) => void
  deleteAllTrades: () => void
  addCashflow: (entry: CashflowEntry) => void
  removeCashflow: (id: string) => void
  deleteAllCashflow: () => void
  setCurrency: (currency: Currency) => void
  toggleShowValues: () => void
  addAccount: (name: string) => void
  removeAccount: (name: string) => void
  importTrades: (trades: Trade[]) => void
  getExportData: () => Trade[]
}

export const useTradeStore = create<TradeStore>()(
  persist(
    (set, get) => ({
      trades: initialTrades,
      cashflow: [],
      currency: "usd",
      showValues: true,
      accounts: ["Main", "Long-term", "Short-term", "Crypto", "Forex"],
      addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
      updateTrade: (id, updated) =>
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? updated : t)),
        })),
      deleteTrade: (id) =>
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
        })),
      deleteAllTrades: () => set({ trades: [] }),
      addCashflow: (entry) =>
        set((state) => ({ cashflow: [...state.cashflow, entry] })),
      removeCashflow: (id) =>
        set((state) => ({
          cashflow: state.cashflow.filter((e) => e.id !== id),
        })),
      deleteAllCashflow: () => set({ cashflow: [] }),
      setCurrency: (currency) => set({ currency }),
      toggleShowValues: () => set((state) => ({ showValues: !state.showValues })),
      addAccount: (name) =>
        set((state) => ({
          accounts: state.accounts.includes(name) ? state.accounts : [...state.accounts, name],
        })),
      removeAccount: (name) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a !== name),
        })),
      importTrades: (trades) => set({ trades }),
      getExportData: () => get().trades,
    }),
    {
      name: "trading-journal-storage",
    },
  ),
)
