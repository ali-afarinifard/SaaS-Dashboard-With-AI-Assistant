"use client";

import { memo, useMemo, useCallback } from "react";
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

  const chartData = useMemo(
    () =>
      (data ?? []).map((item) => ({
        ...item,
        displayMonth: tMonths(item.month),
      })),
    [data, tMonths],
  );

  const formatValue = useCallback(
    (value: number) => {
      return isRTL
        ? `${value.toLocaleString("fa-IR")} دلار`
        : `$${value.toLocaleString()}`;
    },
    [isRTL],
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-36 mb-6" />
        <div className="skeleton h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border border-border",
        isRTL && "font-vazir",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h3 className="text-sm font-semibold mb-5">{t("revenueOverTime")}</h3>

      <div className="h-[240px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
              reversed={isRTL}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              orientation={isRTL ? "right" : "left"}
              tickFormatter={(v) =>
                isRTL ? v.toLocaleString("fa-IR") : `$${v / 1000}k`
              }
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={
                <CustomTooltip isRTL={isRTL} valueFormatter={formatValue} />
              }
            />

            <Area
              type="monotone"
              dataKey="revenue"
              name={isRTL ? "درآمد" : "Revenue"}
              stroke="hsl(var(--primary))"
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
