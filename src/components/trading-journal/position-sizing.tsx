"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculatePositionSize } from "@/lib/data"
import { CalculatorIcon } from "lucide-react"

export function PositionSizingCalculator() {
  const [balance, setBalance] = useState("10000")
  const [riskPercent, setRiskPercent] = useState("1")
  const [entry, setEntry] = useState("100")
  const [stop, setStop] = useState("95")

  const b = Number(balance)
  const r = Number(riskPercent)
  const e = Number(entry)
  const s = Number(stop)

  const result = b > 0 && r > 0 && e > 0 && s > 0 && e !== s ? calculatePositionSize(b, r, e, s) : null

  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-container">
          <CalculatorIcon className="size-4 text-on-surface-variant" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Position Sizing Calculator</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Determine the number of shares based on account balance, risk percentage, and stop loss.
          </p>
        </div>
      </div>
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="balance" className="text-xs text-on-surface-variant">Account Balance ($)</Label>
            <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="riskPercent" className="text-xs text-on-surface-variant">Risk per Trade (%)</Label>
            <Input id="riskPercent" type="number" step="0.1" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entryCalc" className="text-xs text-on-surface-variant">Entry Price ($)</Label>
            <Input id="entryCalc" type="number" step="0.01" value={entry} onChange={(e) => setEntry(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stopCalc" className="text-xs text-on-surface-variant">Stop Loss ($)</Label>
            <Input id="stopCalc" type="number" step="0.01" value={stop} onChange={(e) => setStop(e.target.value)} className="rounded-lg border-outline-variant/50" />
          </div>
        </div>
        {result && (
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-on-surface-variant">Risk / Share</p>
              <p className="text-lg font-bold text-foreground">${result.riskPerShare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Shares</p>
              <p className="text-lg font-bold text-foreground">{result.shares}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Position Size</p>
              <p className="text-lg font-bold text-foreground">${result.positionSize.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Total Risk</p>
              <p className="text-lg font-bold text-foreground">${result.totalRisk.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
