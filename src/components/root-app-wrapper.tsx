"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TrendingUpIcon } from "lucide-react";

function LoadingSkeleton() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : false;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 transition-colors"
      style={{
        backgroundColor: isDark ? "#131313" : "#fcf8fd",
        color: isDark ? "#e5e2e1" : "#1b1b1e",
      }}
    >
      <div
        className="flex size-16 items-center justify-center rounded-2xl transition-colors"
        style={{
          backgroundColor: isDark ? "#d4ff33" : "#1050d4",
          color: isDark ? "#293500" : "#ffffff",
        }}
      >
        <TrendingUpIcon className="size-8" />
      </div>
      <span
        className="text-3xl font-bold tracking-tight"
        style={{
          color: isDark ? "#e5e2e1" : "#1b1b1e",
        }}
      >
        PnL
      </span>
      <div className="flex gap-1.5">
        <span
          className="size-2 animate-bounce rounded-full"
          style={{
            backgroundColor: isDark ? "#d4ff33" : "#1050d4",
            animationDelay: "0ms",
          }}
        />
        <span
          className="size-2 animate-bounce rounded-full"
          style={{
            backgroundColor: isDark ? "#d4ff33" : "#1050d4",
            animationDelay: "150ms",
          }}
        />
        <span
          className="size-2 animate-bounce rounded-full"
          style={{
            backgroundColor: isDark ? "#d4ff33" : "#1050d4",
            animationDelay: "300ms",
          }}
        />
      </div>
    </div>
  );
}

const RootApp = dynamic(
  () => import("@/components/root-app").then((mod) => mod.RootApp),
  {
    ssr: false,
    loading: LoadingSkeleton,
  },
);

export function RootAppWrapper({ children }: { children: React.ReactNode }) {
  return <RootApp>{children}</RootApp>;
}
