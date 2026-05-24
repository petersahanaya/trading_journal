import type { Metadata, Viewport } from "next"
import { Lexend, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/providers/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import "./globals.css"

const lexend = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "Track and analyze your trades",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trading Journal",
  },
  icons: {
    apple: [
      { url: "/icons/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col px-4 py-6 pb-24 md:pb-12 sm:px-6 lg:px-8">
            {children}
          </div>
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
