"use client";

import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { useUserGrowthData, type DateRange } from "@/hooks/use-queries";

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
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
});

export const UserGrowthChart = memo(function UserGrowthChart({
  range = "30d",
}: {
  range?: DateRange;
}) {
  const t = useTranslations("charts");
  const { data, isLoading } = useUserGrowthData(range);
  const chartData = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-36 mb-6" />
        <div className="skeleton h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border card-hover">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold">{t("userGrowth")}</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          {t("monthly")}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="new"
            fill="hsl(220, 90%, 60%)"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={600}
          />
          <Bar
            dataKey="churned"
            fill="hsl(0, 72%, 58%)"
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
