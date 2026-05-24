"use client"

import { useTradeStore, type Currency } from "@/store/trade-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getCurrencyLabel } from "@/lib/currency"

const currencyOptions: Currency[] = ["usd", "cent", "idr"]

export default function SettingsPage() {
  const currency = useTradeStore((s) => s.currency)
  const setCurrency = useTradeStore((s) => s.setCurrency)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Customize your trading journal experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Currency</CardTitle>
          <CardDescription>
            Choose the currency format for displaying P&L values. This is purely cosmetic
            — it only changes how numbers are shown, not the actual values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid max-w-xs gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => {
                if (v === "usd" || v === "idr" || v === "cent") setCurrency(v)
              }}
            >
              <SelectTrigger className="w-full" id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {getCurrencyLabel(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Trading Journal — track and analyze your trades.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Built with Next.js, shadcn/ui, TanStack Table, Recharts, Zustand, Valibot, and React Hook Form.</p>
        </CardContent>
      </Card>
    </div>
  )
}
