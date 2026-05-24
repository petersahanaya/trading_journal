"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculatePositionSize } from "@/lib/data"

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
    <Card>
      <CardHeader>
        <CardTitle>Position Sizing Calculator</CardTitle>
        <CardDescription>
          Determine the number of shares based on account balance, risk percentage, and stop loss.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="balance">Account Balance ($)</Label>
            <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="riskPercent">Risk per Trade (%)</Label>
            <Input id="riskPercent" type="number" step="0.1" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entryCalc">Entry Price ($)</Label>
            <Input id="entryCalc" type="number" step="0.01" value={entry} onChange={(e) => setEntry(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stopCalc">Stop Loss ($)</Label>
            <Input id="stopCalc" type="number" step="0.01" value={stop} onChange={(e) => setStop(e.target.value)} />
          </div>
        </div>
        {result && (
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-muted p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Risk / Share</p>
              <p className="text-lg font-bold">${result.riskPerShare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Shares</p>
              <p className="text-lg font-bold">{result.shares}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Position Size</p>
              <p className="text-lg font-bold">${result.positionSize.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Risk</p>
              <p className="text-lg font-bold">${result.totalRisk.toFixed(2)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
