"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

export function ChartContainer({ className, children, ...props }: ChartContainerProps) {
  return (
    <div
      data-slot="chart-container"
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; fill?: string; color?: string }>
  label?: string
  formatter?: (value: number) => string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      {label && <p className="mb-1 font-medium text-muted-foreground">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.fill ?? entry.color }}
          />
          <span className="font-medium">
            {formatter ? formatter(entry.value ?? 0) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
