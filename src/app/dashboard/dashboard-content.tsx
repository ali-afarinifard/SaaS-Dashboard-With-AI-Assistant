"use client";
import { useState, useMemo } from "react";
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
import { RevenueChart } from "@/components/charts/revenue-chart";
import { UserGrowthChart } from "@/components/charts/user-growth-chart";
import { useDashboardMetrics } from "@/hooks/use-queries";
import type { DateRange } from "@/hooks/use-queries";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { PlanDistributionChart } from "@/components/charts/plan-distribution-chart";
import { FeatureUsageChart } from "@/components/charts/feature-usage-chart";

export function DashboardContent() {
  const t = useTranslations("metrics");
  const tDashboard = useTranslations("dashboard");
  const tReports = useTranslations("reports");
  const [range, setRange] = useState<DateRange>("30d");
  const { data: metrics, isLoading } = useDashboardMetrics(range);

   const DATE_RANGES = useMemo(
    () => [
      { value: "7d" as DateRange, label: tReports("last7days") },
      { value: "30d" as DateRange, label: tReports("last30days") },
      { value: "90d" as DateRange, label: tReports("last90days") },
    ],
    [tReports],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date range selector */}
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
        />
        <MetricCard
          label={t("activeUsers")}
          value={metrics?.activeUsers.value ?? 0}
          change={metrics?.activeUsers.change}
          description={t("vsLastMonth")}
          icon={<Users className="w-3.5 h-3.5" />}
          loading={isLoading}
        />
        <MetricCard
          label={t("newSignups")}
          value={metrics?.newSignups.value ?? 0}
          change={metrics?.newSignups.change}
          description={t("vsLastMonth")}
          icon={<UserPlus className="w-3.5 h-3.5" />}
          loading={isLoading}
        />
        <MetricCard
          label={t("churnRate")}
          value={metrics?.churnRate.value ?? 0}
          change={metrics?.churnRate.change}
          suffix="%"
          description={t("vsLastMonth")}
          icon={<TrendingDown className="w-3.5 h-3.5" />}
          loading={isLoading}
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
        />
        <MetricCard
          label={t("arr")}
          value={metrics?.arr.value ?? 0}
          change={metrics?.arr.change}
          prefix="$"
          description={t("vsLastMonth")}
          icon={<BarChart2 className="w-3.5 h-3.5" />}
          loading={isLoading}
        />
        <MetricCard
          label={t("conversionRate")}
          value={metrics?.conversionRate.value ?? 0}
          change={metrics?.conversionRate.change}
          suffix="%"
          description={t("vsLastMonth")}
          icon={<Percent className="w-3.5 h-3.5" />}
          loading={isLoading}
        />
        <MetricCard
          label={t("avgSessionTime")}
          value={metrics?.avgSessionTime.value ?? "—"}
          change={metrics?.avgSessionTime.change}
          description={t("vsLastMonth")}
          icon={<Clock className="w-3.5 h-3.5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart range={range} />
        <UserGrowthChart range={range} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlanDistributionChart />
        <FeatureUsageChart />
      </div>
    </div>
  );
}
