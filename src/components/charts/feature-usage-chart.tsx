"use client";
import { memo, useCallback } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFeatureUsage } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";

const SKELETON_ITEMS = Array.from({ length: 5 }, (_, i) => i);

export const FeatureUsageChart = memo(function FeatureUsageChart({
  locale,
}: {
  locale: string;
}) {
  const tCharts = useTranslations("charts");
  const { data, isLoading } = useFeatureUsage();
  const isRTL = locale === "fa";

  const items = data ?? [];

  const formatPercent = useCallback(
    (value: number) => {
      const num = Math.abs(value);
      return isRTL ? `${num.toLocaleString("fa-IR")}%` : `${num}%`;
    },
    [isRTL],
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-6" />
        {SKELETON_ITEMS.map(
          (
            i,
          ) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between mb-2">
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                <div className="h-3 w-12 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-1.5 w-full bg-muted animate-pulse rounded-full" />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border border-border card-hover transition-all",
        isRTL && "font-vazir",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.feature} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground/90">
                {tCharts(item.feature)}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors",
                    item.trend > 0
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500",
                  )}
                >
                  {item.trend > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="tabular-nums">
                    {formatPercent(item.trend)}
                  </span>
                </span>
                <span className="text-xs font-medium text-muted-foreground min-w-[35px] text-end tabular-nums">
                  {formatPercent(item.usage)}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-primary rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(var(--primary),0.4)]",
                  isRTL ? "origin-right" : "origin-left",
                )}
                style={{ width: `${item.usage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
