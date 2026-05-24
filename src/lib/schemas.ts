import * as v from "valibot"

export const TradeDirectionSchema = v.picklist(["long", "short"])
export const TradeStatusSchema = v.picklist(["open", "closed"])

export const TradeSchema = v.object({
  date: v.pipe(v.string(), v.nonEmpty("Date is required")),
  ticker: v.pipe(v.string(), v.nonEmpty("Ticker is required")),
  direction: TradeDirectionSchema,
  entryPrice: v.pipe(v.string(), v.nonEmpty("Entry price is required")),
  exitPrice: v.optional(v.string()),
  lots: v.pipe(v.string(), v.nonEmpty("Lots is required")),
  status: TradeStatusSchema,
  notes: v.optional(v.string()),
  tags: v.array(v.string()),
  stopLoss: v.optional(v.string()),
  takeProfit: v.optional(v.string()),
  account: v.optional(v.string()),
})

export type TradeFormValues = v.InferInput<typeof TradeSchema>
