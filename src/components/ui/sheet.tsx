"use client"

import * as React from "react"
import { Drawer } from "@base-ui/react/drawer"

import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: Drawer.Root.Props) {
  return <Drawer.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: Drawer.Trigger.Props) {
  return <Drawer.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetPortal({ ...props }: Drawer.Portal.Props) {
  return <Drawer.Portal data-slot="sheet-portal" {...props} />
}

function SheetClose({ ...props }: Drawer.Close.Props) {
  return <Drawer.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({ className, ...props }: Drawer.Backdrop.Props) {
  return (
    <Drawer.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 backdrop-blur-xs duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: Drawer.Popup.Props & { side?: "left" | "right" | "top" | "bottom" }) {
  const sideStyles = {
    right:
      "top-0 right-0 h-full w-full max-w-sm border-l data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right",
    left:
      "top-0 left-0 h-full w-full max-w-sm border-r data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left",
    top:
      "top-0 left-0 w-full border-b data-open:animate-in data-open:slide-in-from-top data-closed:animate-out data-closed:slide-out-to-top",
    bottom:
      "bottom-0 left-0 w-full border-t data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom",
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <Drawer.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 gap-4 bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 outline-none",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        <Drawer.Close
          data-slot="sheet-close"
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </Drawer.Close>
      </Drawer.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: Drawer.Title.Props) {
  return (
    <Drawer.Title
      data-slot="sheet-title"
      className={cn("text-base font-medium", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: Drawer.Description.Props) {
  return (
    <Drawer.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
