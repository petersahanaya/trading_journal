import { type Currency } from "@/store/trade-store"

const currencyConfig = {
  usd: { symbol: "$", code: "USD", decimals: 2, centFactor: 1 },
  cent: { symbol: "¢", code: "cent", decimals: 0, centFactor: 100 },
  idr: { symbol: "Rp", code: "IDR", decimals: 0, centFactor: 16000 },
} as const

export function formatCurrency(amount: number, currency: Currency): string {
  const config = currencyConfig[currency]
  const converted = amount * config.centFactor
  const formatted = Math.abs(converted).toLocaleString("en-US", {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  })
  const sign = converted < 0 ? "-" : ""
  return `${sign}${config.symbol}${formatted}`
}

export function getCurrencyLabel(currency: Currency): string {
  return currencyConfig[currency].code.toUpperCase()
}
