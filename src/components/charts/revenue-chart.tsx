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
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-muted-foreground text-xs mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-xs capitalize">{p.name}:</span>
          <span className="text-xs font-semibold">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
});

export const RevenueChart = memo(function RevenueChart({
  range = "30d",
}: {
  range?: DateRange;
}) {
  const t = useTranslations("charts");
  const { data, isLoading } = useRevenueData(range);

  const chartData = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-40 mb-6" />
        <div className="skeleton h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border card-hover">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold">{t("revenueOverTime")}</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          {t("monthly")}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(220, 90%, 60%)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(220, 90%, 60%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(220, 90%, 60%)"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            isAnimationActive={true}
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
