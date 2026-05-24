"use client"

import { useTheme } from "next-themes"
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
import { ToggleGroup } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrencyLabel } from "@/lib/currency"

const currencyOptions: Currency[] = ["usd", "cent", "idr"]

export default function SettingsPage() {
  const currency = useTradeStore((s) => s.currency)
  const setCurrency = useTradeStore((s) => s.setCurrency)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

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

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose between light, dark, or system theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            value={mounted && theme ? [theme] : undefined}
            onValueChange={(v) => v[0] && setTheme(v[0])}
          >
            <Toggle value="light" aria-label="Light mode">
              <SunIcon className="mr-2 size-4" />
              Light
            </Toggle>
            <Toggle value="dark" aria-label="Dark mode">
              <MoonIcon className="mr-2 size-4" />
              Dark
            </Toggle>
            <Toggle value="system" aria-label="System preference">
              <MonitorIcon className="mr-2 size-4" />
              System
            </Toggle>
          </ToggleGroup>
        </CardContent>
      </Card>
    </div>
  )
}
