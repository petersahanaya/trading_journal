"use client"

import { useTheme } from "next-themes"
import { useRef, useState } from "react"
import { useTradeStore, type Currency } from "@/store/trade-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { SunIcon, MoonIcon, MonitorIcon, DownloadIcon, UploadIcon, AlertTriangleIcon } from "lucide-react"
import { useEffect } from "react"
import { getCurrencyLabel } from "@/lib/currency"
import { PositionSizingCalculator } from "@/components/trading-journal/position-sizing"

const currencyOptions: Currency[] = ["usd", "cent", "idr"]

export default function SettingsPage() {
  const currency = useTradeStore((s) => s.currency)
  const setCurrency = useTradeStore((s) => s.setCurrency)
  const accounts = useTradeStore((s) => s.accounts)
  const addAccount = useTradeStore((s) => s.addAccount)
  const removeAccount = useTradeStore((s) => s.removeAccount)
  const importTrades = useTradeStore((s) => s.importTrades)
  const deleteAllTrades = useTradeStore((s) => s.deleteAllTrades)
  const getExportData = useTradeStore((s) => s.getExportData)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [newAccount, setNewAccount] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setMounted(true), [])

  function handleExport() {
    const data = getExportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trading-journal-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        importTrades(data)
      } catch {
        alert("Invalid JSON file.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  function handleAddAccount() {
    const name = newAccount.trim()
    if (name) {
      addAccount(name)
      setNewAccount("")
    }
  }

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
            Choose the currency format for displaying P&L values.
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

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Manage your trading accounts and portfolios.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {accounts.map((a) => (
              <div key={a} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm">
                {a}
                <button
                  onClick={() => removeAccount(a)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="New account name"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddAccount() } }}
              className="max-w-xs"
            />
            <Button type="button" variant="outline" onClick={handleAddAccount}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import / Export</CardTitle>
          <CardDescription>
            Backup your trades or transfer them between devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport}>
            <DownloadIcon className="mr-2 size-4" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <UploadIcon className="mr-2 size-4" />
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button variant="destructive" size="sm" onClick={() => { if (confirm("Delete all trades?")) deleteAllTrades() }}>
            <AlertTriangleIcon className="mr-2 size-4" />
            Delete All
          </Button>
        </CardContent>
      </Card>

      <PositionSizingCalculator />
    </div>
  )
}
