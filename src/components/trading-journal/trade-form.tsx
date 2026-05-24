"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { Trade } from "@/lib/types"
import { TradeSchema, type TradeFormValues } from "@/lib/schemas"
import { PlusIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTradeStore } from "@/store/trade-store"

interface TradeFormProps {
  onAddTrade: (trade: Trade) => void
  onEditTrade?: (id: string, trade: Trade) => void
  editTrade?: Trade | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TradeForm({ onAddTrade, onEditTrade, editTrade, open: controlledOpen, onOpenChange }: TradeFormProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const isMobile = useMediaQuery("(max-width: 767px)")
  const accounts = useTradeStore((s) => s.accounts)

  const isEditing = !!editTrade
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: valibotResolver(TradeSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      ticker: "",
      direction: "long",
      entryPrice: "",
      exitPrice: "",
      lots: "",
      status: "closed",
      notes: "",
      tags: [],
      stopLoss: "",
      takeProfit: "",
      account: "Main",
    },
  })

  useEffect(() => {
    if (editTrade) {
      reset({
        date: editTrade.date,
        ticker: editTrade.ticker,
        direction: editTrade.direction,
        entryPrice: String(editTrade.entryPrice),
        exitPrice: editTrade.exitPrice ? String(editTrade.exitPrice) : "",
        lots: String(editTrade.lots),
        status: editTrade.status,
        notes: editTrade.notes,
        tags: editTrade.tags,
        stopLoss: editTrade.stopLoss ? String(editTrade.stopLoss) : "",
        takeProfit: editTrade.takeProfit ? String(editTrade.takeProfit) : "",
        account: editTrade.account,
      })
      setTags(editTrade.tags)
    }
  }, [editTrade, reset])

  function handleAddTag() {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function onSubmit(data: TradeFormValues) {
    const entry = Number(data.entryPrice)
    const lots = Number(data.lots)
    const exit = data.exitPrice ? Number(data.exitPrice) : null

    let pnl: number | null = null
    if (data.status === "closed" && exit !== null) {
      pnl = data.direction === "long" ? (exit - entry) * lots : (entry - exit) * lots
    }

    const trade: Trade = {
      id: editTrade?.id ?? crypto.randomUUID(),
      date: data.date,
      ticker: data.ticker.toUpperCase(),
      direction: data.direction,
      entryPrice: entry,
      exitPrice: exit,
      lots,
      pnl,
      status: data.status,
      notes: data.notes ?? "",
      tags,
      stopLoss: data.stopLoss ? Number(data.stopLoss) : null,
      takeProfit: data.takeProfit ? Number(data.takeProfit) : null,
      account: data.account ?? "Main",
    }

    if (isEditing && onEditTrade) {
      onEditTrade(trade.id, trade)
    } else {
      onAddTrade(trade)
    }

    reset()
    setTags([])
    setOpen(false)
  }

  function handleCancel() {
    reset()
    setTags([])
    setOpen(false)
  }

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register("date")} aria-invalid={!!errors.date} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ticker">Ticker</Label>
          <Input id="ticker" placeholder="AAPL" {...register("ticker")} aria-invalid={!!errors.ticker} />
          {errors.ticker && <p className="text-xs text-destructive">{errors.ticker.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Direction</Label>
          <Controller
            control={control}
            name="direction"
            render={({ field }) => (
              <ToggleGroup
                value={[field.value]}
                onValueChange={(v) => { if (v.length > 0) field.onChange(v[0]) }}
              >
                <Toggle value="long" variant={field.value === "long" ? "default" : "outline"} size="sm">
                  <ArrowUpIcon className="size-3.5 text-green-600" />
                  Long
                </Toggle>
                <Toggle value="short" variant={field.value === "short" ? "default" : "outline"} size="sm">
                  <ArrowDownIcon className="size-3.5 text-red-600" />
                  Short
                </Toggle>
              </ToggleGroup>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <ToggleGroup
                value={[field.value]}
                onValueChange={(v) => { if (v.length > 0 && (v[0] === "open" || v[0] === "closed")) field.onChange(v[0]) }}
              >
                <Toggle value="closed" variant={field.value === "closed" ? "default" : "outline"} size="sm">
                  Closed
                </Toggle>
                <Toggle value="open" variant={field.value === "open" ? "default" : "outline"} size="sm">
                  Open
                </Toggle>
              </ToggleGroup>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="entryPrice">Entry Price</Label>
          <Input id="entryPrice" type="number" step="0.01" placeholder="100.00" {...register("entryPrice")} aria-invalid={!!errors.entryPrice} />
          {errors.entryPrice && <p className="text-xs text-destructive">{errors.entryPrice.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lots">Lots</Label>
          <Input id="lots" type="number" step="0.1" placeholder="1.0" {...register("lots")} aria-invalid={!!errors.lots} />
          {errors.lots && <p className="text-xs text-destructive">{errors.lots.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="exitPrice">Exit Price</Label>
        <Input id="exitPrice" type="number" step="0.01" placeholder="Leave empty if open" {...register("exitPrice")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input id="stopLoss" type="number" step="0.01" placeholder="Optional" {...register("stopLoss")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="takeProfit">Take Profit</Label>
          <Input id="takeProfit" type="number" step="0.01" placeholder="Optional" {...register("takeProfit")} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="account">Account</Label>
        <Controller
          control={control}
          name="account"
          render={({ field }) => (
            <Select value={field.value ?? "Main"} onValueChange={field.onChange}>
              <SelectTrigger id="account">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="e.g. swing"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag() } }}
          />
          <Button type="button" variant="outline" onClick={handleAddTag}>Add</Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">&times;</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Trade rationale, observations..." {...register("notes")} rows={3} />
      </div>

      <div className={isMobile ? "flex flex-col gap-2 pt-2" : "flex justify-end gap-2 pt-2"}>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update Trade" : "Save Trade"}</Button>
      </div>
    </form>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {controlledOpen === undefined && (
          <SheetTrigger
            render={
              <Button variant={isEditing ? "ghost" : "default"} size={isEditing ? "icon-sm" : "default"}>
                {isEditing ? <PencilIcon className="size-3.5" /> : <><PlusIcon /> Add Trade</>}
              </Button>
            }
          />
        )}
        <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-xl pb-8">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Edit Trade" : "Add New Trade"}</SheetTitle>
            <SheetDescription>
              {isEditing ? "Update the details of your trade." : "Enter the details of your trade."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            {formContent}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger
          render={
            <Button variant={isEditing ? "ghost" : "default"} size={isEditing ? "icon-sm" : "default"}>
              {isEditing ? <PencilIcon className="size-3.5" /> : <><PlusIcon /> Add Trade</>}
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Trade" : "Add New Trade"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of your trade." : "Enter the details of your trade."}
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
