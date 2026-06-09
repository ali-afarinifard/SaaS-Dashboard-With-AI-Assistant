"use client";
import { useState } from "react";

const FeatureUsageChart = dynamic<{ locale: string }>(
  () =>
    import("@/components/charts/feature-usage-chart").then(
      (m) => m.FeatureUsageChart,
    ),
  { ssr: false },
);
const RevenueChart = dynamic<{ range: DateRange; locale: string }>(
  () =>
    import("@/components/charts/revenue-chart/revenue-chart").then(
      (m) => m.RevenueChart,
    ),
  { ssr: false },
);
const UserGrowthChart = dynamic<{ range: DateRange; locale: string }>(
  () =>
    import("@/components/charts/user-growth-chart/user-growth-chart").then(
      (m) => m.UserGrowthChart,
    ),
  { ssr: false },
);
const PlanDistributionChart = dynamic<{ locale: string }>(
  () =>
    import("@/components/charts/plan-distribution-chart/plan-distribution-chart").then(
      (m) => m.PlanDistributionChart,
    ),
  { ssr: false },
);

import { useTranslations } from "next-intl";
import {
  DollarSign,
  Users,
  UserPlus,
  TrendingDown,
  Activity,
  BarChart2,
  Percent,
  Clock,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { useDashboardMetrics } from "@/hooks/use-queries";
import type { DateRange } from "@/hooks/use-queries";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { useSettingsStore } from "@/store";
import dynamic from "next/dynamic";

const DATE_RANGE_VALUES = ["7d", "30d", "90d"] as const;

export function DashboardContent() {
  const t = useTranslations("metrics");
  const tDashboard = useTranslations("dashboard");
  const tReports = useTranslations("reports");

  const locale = useSettingsStore((s) => s.locale);

  const [range, setRange] = useState<DateRange>("30d");
  const { data: metrics, isLoading } = useDashboardMetrics(range);

  const DATE_RANGES = DATE_RANGE_VALUES.map((value) => ({
    value,
    label: tReports(
      `last${value === "7d" ? "7" : value === "30d" ? "30" : "90"}days` as const,
    ),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {tDashboard("overview")}
        </h2>
        <DateRangeSelector
          value={range}
          onChange={setRange}
          ranges={DATE_RANGES}
        />
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("totalRevenue")}
          value={metrics?.totalRevenue.value ?? 0}
          change={metrics?.totalRevenue.change}
          prefix="$"
          description={t("vsLastMonth")}
          icon={<DollarSign className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
        <MetricCard
          label={t("activeUsers")}
          value={metrics?.activeUsers.value ?? 0}
          change={metrics?.activeUsers.change}
          description={t("vsLastMonth")}
          icon={<Users className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
        <MetricCard
          label={t("newSignups")}
          value={metrics?.newSignups.value ?? 0}
          change={metrics?.newSignups.change}
          description={t("vsLastMonth")}
          icon={<UserPlus className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
        <MetricCard
          label={t("churnRate")}
          value={metrics?.churnRate.value ?? 0}
          change={metrics?.churnRate.change}
          suffix="%"
          description={t("vsLastMonth")}
          icon={<TrendingDown className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("mrr")}
          value={metrics?.mrr.value ?? 0}
          change={metrics?.mrr.change}
          prefix="$"
          description={t("vsLastMonth")}
          icon={<Activity className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
        <MetricCard
          label={t("arr")}
          value={metrics?.arr.value ?? 0}
          change={metrics?.arr.change}
          prefix="$"
          description={t("vsLastMonth")}
          icon={<BarChart2 className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
        <MetricCard
          label={t("conversionRate")}
          value={metrics?.conversionRate.value ?? 0}
          change={metrics?.conversionRate.change}
          suffix="%"
          description={t("vsLastMonth")}
          icon={<Percent className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
        <MetricCard
          label={t("avgSessionTime")}
          value={metrics?.avgSessionTime.value ?? "—"}
          change={metrics?.avgSessionTime.change}
          description={t("vsLastMonth")}
          icon={<Clock className="w-3.5 h-3.5" />}
          loading={isLoading}
          locale={locale}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart range={range} locale={locale} />
        <UserGrowthChart range={range} locale={locale} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlanDistributionChart locale={locale} />
        <FeatureUsageChart locale={locale} />
      </div>
    </div>
  );
}
