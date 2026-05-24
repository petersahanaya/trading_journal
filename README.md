# Trading Journal

A modern trading journal built with Next.js to track, analyze, and improve your trading performance.

## Features

- **Dashboard** — View key stats (P&L, win rate, open positions) and your full trade history
- **Trade Management** — Add, edit, and delete trades with direction (long/short), entry/exit prices, lots, and P&L
- **Analytics** — Cumulative P&L line chart, win/loss pie chart, P&L by direction, trade frequency, daily P&L breakdown, and a calendar heatmap
- **Multiple Accounts** — Organize trades into separate portfolios (e.g., Main, Long-term, Crypto)
- **Tags & Notes** — Categorize trades with tags and add detailed notes
- **Stop Loss / Take Profit** — Track risk parameters per trade
- **Position Sizing Calculator** — Built-in tool to calculate position size based on account balance, risk percentage, and stop loss
- **Import / Export** — Backup or transfer your data as JSON
- **Persistent Storage** — All data is saved to localStorage automatically
- **Customization** — Choose display currency (USD, IDR, cent), light/dark/system theme, and toggle value visibility with the eye icon
- **PWA** — Installable as a standalone app on mobile and desktop
- **Responsive** — Optimized for both mobile and desktop with bottom nav on small screens

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **UI** — shadcn/ui + Tailwind CSS
- **Font** — Lexend (via next/font)
- **Tables** — TanStack Table v8 (sortable, filterable, hideable columns)
- **Forms** — React Hook Form + Valibot validation
- **Charts** — Recharts (line, bar, pie)
- **State** — Zustand with persist middleware
- **Theme** — next-themes
- **Icons** — Lucide React
- **Animation** — tw-animate-css

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
bun run build
```
