"use client";
import { memo, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { useUserGrowthData, type DateRange } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import { CustomTooltip } from "./custom-tooltip";

export const UserGrowthChart = memo(function UserGrowthChart({
  range = "30d",
  locale,
}: {
  range?: DateRange;
  locale: string;
}) {
  const t = useTranslations("charts");
  const tMonths = useTranslations("months");
  const { data, isLoading } = useUserGrowthData(range);
  const isRTL = locale === "fa";

  const chartData = useMemo(
    () =>
      (data ?? []).map((item) => ({
        ...item,
        displayMonth: tMonths(item.month),
      })),
    [data, tMonths],
  );

  const valueFormatter = useCallback(
    (v: number) => (isRTL ? v.toLocaleString("fa-IR") : v.toLocaleString()),
    [isRTL],
  );

  const yAxisFormatter = useCallback(
    (v: number) => (isRTL ? v.toLocaleString("fa-IR") : v.toLocaleString()),
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
        "bg-card rounded-xl p-5 border border-border card-hover transition-all",
        isRTL && "font-vazir",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold">{t("userGrowth")}</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          {t("monthly")}
        </span>
      </div>
      <div className="h-[240px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
              tickFormatter={yAxisFormatter}
            />
            <Tooltip
              content={
                <CustomTooltip isRTL={isRTL} valueFormatter={valueFormatter} />
              }
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            />
            <Bar
              dataKey="new"
              name={isRTL ? "کاربران جدید" : "New Users"}
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="churned"
              name={isRTL ? "ریزش" : "Churned"}
              fill="hsl(var(--destructive))"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
