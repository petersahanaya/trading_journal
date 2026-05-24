"use client"

import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleGroupVariants = cva(
  "flex items-center gap-0 -space-x-px [&>button:first-child:not(:last-child)]:rounded-r-none [&>button:last-child:not(:first-child)]:rounded-l-none [&>button:not(:first-child):not(:last-child)]:rounded-none",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ToggleGroup({
  className,
  orientation = "horizontal",
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleGroupVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      orientation={orientation}
      className={cn(toggleGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

export { ToggleGroup }
