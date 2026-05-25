"use client"

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/trading-journal/data-table-pagination"
import { Settings2Icon, SearchIcon } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

const MOBILE_HIDE_COLUMNS = ["stopLoss", "takeProfit", "tags", "account", "exitPrice", "lots"]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 767px)")

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isMobile) {
      setColumnVisibility((prev) => {
        const next = { ...prev }
        for (const colId of MOBILE_HIDE_COLUMNS) {
          if (!(colId in next)) {
            next[colId] = false
          }
        }
        return next
      })
    }
  }, [isMobile])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-4 py-4">
        {isMobile ? (
          <>
            {searchOpen ? (
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder="Search trades..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button variant="ghost" size="icon-sm" onClick={() => { setSearchOpen(false); setGlobalFilter("") }}>
                  <span className="text-sm">Cancel</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
                  <SearchIcon className="size-3.5" />
                  Search
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="sm">
                        <Settings2Icon className="size-3.5" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((col) => col.getCanHide())
                      .map((col) => {
                        const header = typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
                        const isVisible = col.getIsVisible()
                        return (
                          <DropdownMenuItem key={col.id} onClick={() => col.toggleVisibility()}>
                            <span className="mr-2 w-4 text-center text-xs text-muted-foreground">
                              {isVisible ? "✓" : ""}
                            </span>
                            {header}
                          </DropdownMenuItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </>
        ) : (
          <>
            <Input
              placeholder={filterKey ? `Search by ${filterKey}...` : "Search trades..."}
              value={filterKey ? ((table.getColumn(filterKey)?.getFilterValue() as string) ?? "") : globalFilter}
              onChange={(e) => {
                if (filterKey) {
                  table.getColumn(filterKey)?.setFilterValue(e.target.value)
                } else {
                  setGlobalFilter(e.target.value)
                }
              }}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm">
                    <Settings2Icon className="mr-2 size-3.5" />
                    Columns
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => {
                    const header = typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
                    const isVisible = col.getIsVisible()
                    return (
                      <DropdownMenuItem key={col.id} onClick={() => col.toggleVisibility()}>
                        <span className="mr-2 w-4 text-center text-xs text-muted-foreground">
                          {isVisible ? "✓" : ""}
                        </span>
                        {header}
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <div className="min-w-[500px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                      <p className="text-sm text-muted-foreground">No trades found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
