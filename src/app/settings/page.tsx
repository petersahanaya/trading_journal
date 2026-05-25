"use client"

import { useRef, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useTradeStore, type Currency } from "@/store/trade-store"
import type { CashflowEntry } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DownloadIcon, UploadIcon, AlertTriangleIcon, PlusIcon, Trash2Icon, ArrowDownToLine, ArrowUpFromLine, CurrencyIcon, WalletIcon, DatabaseIcon, SlidersIcon, MoonIcon, SunIcon } from "lucide-react"
import { getCurrencyLabel, formatCurrency, currencyConfig } from "@/lib/currency"
import { PositionSizingCalculator } from "@/components/trading-journal/position-sizing"
import { cn } from "@/lib/utils"

const currencyOptions: Currency[] = ["usd", "cent", "idr"]

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-container">
          <Icon className="size-4 text-on-surface-variant" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && (
            <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="pl-0">
        {children}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const currency = useTradeStore((s) => s.currency)
  const setCurrency = useTradeStore((s) => s.setCurrency)
  const accounts = useTradeStore((s) => s.accounts)
  const addAccount = useTradeStore((s) => s.addAccount)
  const removeAccount = useTradeStore((s) => s.removeAccount)
  const cashflow = useTradeStore((s) => s.cashflow)
  const addCashflow = useTradeStore((s) => s.addCashflow)
  const removeCashflow = useTradeStore((s) => s.removeCashflow)
  const importTrades = useTradeStore((s) => s.importTrades)
  const deleteAllTrades = useTradeStore((s) => s.deleteAllTrades)
  const getExportData = useTradeStore((s) => s.getExportData)
  const [newAccount, setNewAccount] = useState("")
  const [cfType, setCfType] = useState<"deposit" | "withdrawal">("deposit")
  const [cfAmount, setCfAmount] = useState("")
  const [cfDate, setCfDate] = useState(new Date().toISOString().split("T")[0])
  const [cfAccount, setCfAccount] = useState("")
  const [cfNotes, setCfNotes] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  function handleAddCashflow() {
    const amount = Number.parseFloat(cfAmount)
    if (!amount || amount <= 0) return
    const baseAmount = amount / currencyConfig[currency].centFactor
    const entry: CashflowEntry = {
      id: crypto.randomUUID(),
      type: cfType,
      amount: baseAmount,
      date: cfDate,
      account: cfAccount,
      notes: cfNotes,
    }
    addCashflow(entry)
    setCfAmount("")
    setCfNotes("")
  }

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = theme === "dark"

  const depositTotal = cashflow.filter((e) => e.type === "deposit").reduce((s, e) => s + e.amount, 0)
  const withdrawalTotal = cashflow.filter((e) => e.type === "withdrawal").reduce((s, e) => s + e.amount, 0)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight leading-[36px]">Settings</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Customize your trading journal experience.
        </p>
      </div>

      <SettingsCard icon={CurrencyIcon} title="Display Currency" description="Choose the currency format for displaying P&L values.">
        <div className="grid max-w-xs gap-2">
          <Label htmlFor="currency" className="text-xs text-on-surface-variant">Currency</Label>
          <Select
            value={currency}
            onValueChange={(v) => {
              if (v === "usd" || v === "idr" || v === "cent") setCurrency(v)
            }}
          >
            <SelectTrigger className="w-full rounded-lg border-outline-variant/50" id="currency">
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
      </SettingsCard>

      <SettingsCard icon={isDark ? MoonIcon : SunIcon} title="Theme" description="Switch between light and dark mode.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SunIcon className="size-4 text-on-surface-variant" />
            <Switch
              checked={mounted ? isDark : false}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
            <MoonIcon className="size-4 text-on-surface-variant" />
          </div>
          <span className="text-sm text-on-surface-variant">
            {mounted ? (isDark ? "Dark" : "Light") : "..."}
          </span>
        </div>
      </SettingsCard>

      <SettingsCard icon={WalletIcon} title="Cashflow" description="Track deposits and withdrawals to measure your P&L as a percentage return.">
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <ArrowDownToLine className="size-4 text-green-600" />
            <span className="text-on-surface-variant">Deposits: <strong className="text-foreground">{formatCurrency(depositTotal, currency)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowUpFromLine className="size-4 text-red-600" />
            <span className="text-on-surface-variant">Withdrawals: <strong className="text-foreground">{formatCurrency(withdrawalTotal, currency)}</strong></span>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-1">
            <Label htmlFor="cf-type" className="text-xs text-on-surface-variant">Type</Label>
            <Select value={cfType} onValueChange={(v) => v && setCfType(v as "deposit" | "withdrawal")}>
              <SelectTrigger id="cf-type" className="rounded-lg border-outline-variant/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-1">
            <Label htmlFor="cf-amount" className="text-xs text-on-surface-variant">Amount</Label>
            <Input id="cf-amount" type="number" step="0.01" min="0" placeholder="0.00" value={cfAmount} onChange={(e) => setCfAmount(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
          <div className="sm:col-span-1">
            <Label htmlFor="cf-date" className="text-xs text-on-surface-variant">Date</Label>
            <Input id="cf-date" type="date" value={cfDate} onChange={(e) => setCfDate(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
          <div className="sm:col-span-1">
            <Label htmlFor="cf-account" className="text-xs text-on-surface-variant">Account</Label>
            <Select value={cfAccount} onValueChange={(v) => v && setCfAccount(v)}>
              <SelectTrigger id="cf-account" className="rounded-lg border-outline-variant/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-1">
            <Label htmlFor="cf-notes" className="text-xs text-on-surface-variant">Notes</Label>
            <Input id="cf-notes" placeholder="Optional" value={cfNotes} onChange={(e) => setCfNotes(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
          <div className="flex items-end sm:col-span-1">
            <Button size="sm" className="w-full rounded-xl" onClick={handleAddCashflow}>
              <PlusIcon className="size-3.5" />
              Add
            </Button>
          </div>
        </div>

        {cashflow.length > 0 && (
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {[...cashflow].reverse().map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2 text-sm">
                <div className="flex items-center gap-3">
                  {e.type === "deposit" ? (
                    <ArrowDownToLine className="size-3.5 text-green-600" />
                  ) : (
                    <ArrowUpFromLine className="size-3.5 text-red-600" />
                  )}
                  <span className="text-xs text-on-surface-variant">{e.date}</span>
                  <span className="text-xs text-on-surface-variant">{e.account}</span>
                  {e.notes && <span className="text-xs text-on-surface-variant truncate max-w-24">{e.notes}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={e.type === "deposit" ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(e.amount, currency)}
                  </span>
                  <button onClick={() => removeCashflow(e.id)} className="text-on-surface-variant hover:text-destructive transition-colors">
                    <Trash2Icon className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingsCard>

      <SettingsCard icon={SlidersIcon} title="Accounts" description="Manage your trading accounts and portfolios.">
        <div className="flex flex-wrap gap-2">
          {accounts.map((a) => (
            <div key={a} className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border border-outline-variant/30">
              {a}
              <button
                onClick={() => removeAccount(a)}
                className="text-on-surface-variant hover:text-destructive transition-colors"
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
            className="max-w-xs rounded-lg border-outline-variant/50"
          />
          <Button type="button" variant="outline" onClick={handleAddAccount} className="rounded-xl">
            Add
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard icon={DatabaseIcon} title="Import / Export" description="Backup your trades or transfer them between devices.">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport} className="rounded-xl">
            <DownloadIcon className="mr-2 size-4" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl">
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
          <Button variant="destructive" size="sm" onClick={() => { if (confirm("Delete all trades?")) deleteAllTrades() }} className="rounded-xl">
            <AlertTriangleIcon className="mr-2 size-4" />
            Delete All
          </Button>
        </div>
      </SettingsCard>

      <PositionSizingCalculator />
    </div>
  )
}
