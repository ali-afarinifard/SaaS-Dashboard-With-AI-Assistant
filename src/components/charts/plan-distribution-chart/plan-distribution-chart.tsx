"use client";
import { memo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";
import { usePlanDistribution } from "@/hooks/use-queries";
import { CustomTooltip } from "./custom-tooltip";

export const PlanDistributionChart = memo(function PlanDistributionChart() {
  const t = useTranslations("charts");
  const { data, isLoading } = usePlanDistribution();

  const chartData = data ?? [];

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-36 mb-6" />
        <div className="skeleton h-48 w-48 rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border card-hover">
      <h3 className="text-sm font-semibold mb-5">{t("planDistribution")}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive
            animationDuration={600}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});
