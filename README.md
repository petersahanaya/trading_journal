# Trading Journal

A modern trading journal built with Next.js to track, analyze, and improve your trading performance.

<img width="1906" height="1337" alt="PnL_Dashboard" src="https://github.com/user-attachments/assets/7dea1f0f-9692-44d5-a934-df9906a11315" />

<img width="1906" height="1570" alt="PnL_Analytics" src="https://github.com/user-attachments/assets/95f071ab-9cff-4a2e-8494-301e97ad853f" />

<img width="1906" height="1360" alt="PnL_Settings" src="https://github.com/user-attachments/assets/3c95abc1-9dd0-46fd-b967-efc86d320d7b" />

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
