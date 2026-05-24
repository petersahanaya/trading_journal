"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trade } from "@/lib/types"
import { useTradeStore } from "@/store/trade-store"
import { formatCurrency } from "@/lib/currency"
import { TradeForm } from "@/components/trading-journal/trade-form"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

function ActionsCell({ trade }: { trade: Trade }) {
  const [editOpen, setEditOpen] = useState(false)
  const updateTrade = useTradeStore((s) => s.updateTrade)
  const deleteTrade = useTradeStore((s) => s.deleteTrade)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon className="size-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteTrade(trade.id)}>
            <Trash2Icon className="size-3.5 text-destructive" />
            <span className="text-destructive">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TradeForm
        onAddTrade={() => {}}
        onEditTrade={updateTrade}
        editTrade={trade}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}

function SortHeader({ column, label }: { column: any; label: string }) {
  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDownIcon className="ml-1 size-3" />
    </Button>
  )
}

export const columns: ColumnDef<Trade>[] = [
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell trade={row.original} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortHeader column={column} label="Date" />,
    cell: ({ row }) => <span className="font-medium whitespace-nowrap">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "ticker",
    header: ({ column }) => <SortHeader column={column} label="Ticker" />,
    cell: ({ row }) => <span className="font-semibold">{row.getValue("ticker")}</span>,
  },
  {
    accessorKey: "direction",
    header: "Dir",
    cell: ({ row }) => {
      const direction = row.getValue("direction") as string
      return (
        <div className="flex items-center gap-1">
          {direction === "long" ? (
            <ArrowUpIcon className="size-3 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowDownIcon className="size-3 text-red-600 dark:text-red-400" />
          )}
          <span className="capitalize text-xs">{direction}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "entryPrice",
    header: "Entry",
    cell: ({ row }) => `$${Number(row.getValue("entryPrice")).toFixed(2)}`,
  },
  {
    accessorKey: "exitPrice",
    header: "Exit",
    cell: ({ row }) => {
      const exit = row.getValue("exitPrice") as number | null
      return exit !== null ? `$${exit.toFixed(2)}` : "—"
    },
  },
  {
    accessorKey: "lots",
    header: "Lots",
    cell: ({ row }) => Number(row.getValue("lots")).toFixed(1),
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => <SortHeader column={column} label="P&L" />,
    cell: ({ row }) => {
      const pnl = row.getValue("pnl") as number | null
      if (pnl === null) return "—"
      const isPositive = pnl >= 0
      const { currency, showValues } = useTradeStore.getState()
      if (!showValues) return <span className="select-none text-muted-foreground">****</span>
      return (
        <span className={cn(isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
          {formatCurrency(pnl, currency)}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "open" ? "outline" : "default"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "stopLoss",
    header: "Stop",
    cell: ({ row }) => {
      const sl = row.getValue("stopLoss") as number | null
      return sl !== null ? `$${sl.toFixed(2)}` : "—"
    },
  },
  {
    accessorKey: "takeProfit",
    header: "Target",
    cell: ({ row }) => {
      const tp = row.getValue("takeProfit") as number | null
      return tp !== null ? `$${tp.toFixed(2)}` : "—"
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => {
      const account = row.getValue("account") as string
      return <span className="text-xs text-muted-foreground">{account}</span>
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          )) : <span className="text-muted-foreground text-xs">—</span>}
        </div>
      )
    },
  },
]
