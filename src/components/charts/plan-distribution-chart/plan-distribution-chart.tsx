"use client";

import { memo, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";
import { usePlanDistribution } from "@/hooks/use-queries";
import { useSettingsStore } from "@/store";
import { cn } from "@/lib/utils";
import { CustomTooltip } from "./custom-tooltip";

export const PlanDistributionChart = memo(function PlanDistributionChart() {
  const t = useTranslations("charts");
  const tPlans = useTranslations("plans");
  const { data, isLoading } = usePlanDistribution();
  const { locale } = useSettingsStore();
  const isRTL = locale === "fa";

  const chartData = useMemo(() => {
    return (data ?? []).map(item => ({
      ...item,
      displayName: tPlans.has(item.name) ? tPlans(item.name) : item.name
    }));
  }, [data, tPlans]);

  const formatPercentage = useCallback((value: number) => {
    const formattedValue = isRTL ? value.toLocaleString("fa-IR") : value.toString();
    return `${formattedValue}%`;
  }, [isRTL]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-4 w-36 mb-6" />
        <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border-[12px] border-muted animate-pulse" />
           <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-5 border border-border card-hover transition-all",
        isRTL && "font-vazir"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h3 className="text-sm font-semibold mb-5">{t("planDistribution")}</h3>
      <div className="h-[220px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              nameKey="displayName"
              isAnimationActive
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  strokeWidth={0} 
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              content={
                <CustomTooltip 
                  isRTL={isRTL} 
                  valueFormatter={formatPercentage} 
                />
              } 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});