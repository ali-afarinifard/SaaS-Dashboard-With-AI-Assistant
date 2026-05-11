"use client";

import { memo, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { useRevenueData, type DateRange } from "@/hooks/use-queries";
import { useSettingsStore } from "@/store";
import { cn } from "@/lib/utils";
import { CustomTooltip } from "./custom-tooltip";

export const RevenueChart = memo(function RevenueChart({
  range = "30d",
}: {
  range?: DateRange;
}) {
  const t = useTranslations("charts");
  const tMonths = useTranslations("months");

  const { data, isLoading } = useRevenueData(range);
  const { locale } = useSettingsStore();
  const isRTL = locale === "fa";

  const chartData = useMemo(() => {
    return (data ?? []).map((item) => ({
      ...item,
      displayMonth: tMonths(item.month),
    }));
  }, [data, tMonths]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-40 mb-6" />
        <div className="skeleton h-64 w-full rounded-lg" />
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
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold">{t("revenueOverTime")}</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          {t("monthly")}
        </span>
      </div>

      <div className="h-[240px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/50"
            />

            <XAxis
              dataKey="displayMonth"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              reversed={isRTL}
              dy={10}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              orientation={isRTL ? "right" : "left"}
              tickFormatter={(v) =>
                isRTL
                  ? `${v.toLocaleString("fa-IR")}`
                  : `$${(v / 1000).toFixed(0)}k`
              }
            />

            <Tooltip
              content={<CustomTooltip isRTL={isRTL} />}
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#colorRevenue)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

RevenueChart.displayName = "RevenueChart";
