"use client";
import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFeatureUsage } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";

export const FeatureUsageChart = memo(function FeatureUsageChart() {
  const t = useTranslations("charts");
  const { data, isLoading } = useFeatureUsage();

  const items = data ?? [];

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-32 mb-6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="skeleton h-3 w-full mb-1" />
            <div className="skeleton h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border card-hover">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.feature}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium">{item.feature}</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    item.trend > 0 ? "metric-up" : "metric-down",
                  )}
                >
                  {item.trend > 0
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(item.trend)}%
                </span>
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {item.usage}%
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.usage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});