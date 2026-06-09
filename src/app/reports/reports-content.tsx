"use client";
import { useState, useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  TrendingUp,
  Users,
  AlertTriangle,
  Zap,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useReports } from "@/hooks/use-queries";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { formatDateLocale } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { useSettingsStore } from "@/store";
import type { DateRange } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import { downloadCSV } from "@/lib/download";
import { RevenueChart } from "@/components/charts/revenue-chart/revenue-chart";
import { UserGrowthChart } from "@/components/charts/user-growth-chart/user-growth-chart";
import type { IReport } from "@/types";

const DATE_RANGE_VALUES: DateRange[] = ["7d", "30d", "90d"];

const TYPE_ICON = {
  revenue: TrendingUp,
  users: Users,
  churn: AlertTriangle,
  performance: Zap,
} as const;

const TYPE_COLOR = {
  revenue: "text-success bg-success/10",
  users: "text-primary bg-primary/10",
  churn: "text-warning bg-warning/10",
  performance: "text-accent bg-accent/10",
} as const;

const STATUS_KEY = {
  ready: "statusReady",
  generating: "statusGenerating",
  failed: "statusFailed",
} as const;

const SKELETON_ROWS = Array.from({ length: 4 }, (_, i) => i);

type ReportType = keyof typeof TYPE_ICON;
type ReportStatus = keyof typeof STATUS_KEY;

const ReportRow = memo(function ReportRow({
  report,
  locale,
  onDownload,
  t,
}: {
  report: IReport;
  locale: string;
  onDownload: (title: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const Icon = TYPE_ICON[report.type as ReportType];

  return (
    <div className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors cursor-pointer">
      <div
        className={cn(
          "p-2 rounded-lg shrink-0",
          TYPE_COLOR[report.type as ReportType],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{report.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {report.description}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {formatDateLocale(report.createdAt, locale)}
        </span>
        <Badge
          variant={
            report.status === "ready"
              ? "success"
              : report.status === "generating"
                ? "warning"
                : "destructive"
          }
        >
          {t(STATUS_KEY[report.status as ReportStatus])}
        </Badge>
        {report.status === "ready" && (
          <button
            onClick={() => onDownload(report.title)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={t("download")}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
        {report.status === "generating" && (
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin ml-2" />
        )}
      </div>
    </div>
  );
});

// Main Component
export function ReportsContent() {
  const t = useTranslations("reports");

  const locale = useSettingsStore((s) => s.locale);

  const [range, setRange] = useState<DateRange>("30d");
  const [generating, setGenerating] = useState(false);
  const { data: reports, isLoading } = useReports();

  const DATE_RANGES = DATE_RANGE_VALUES.map((value) => ({
    value,
    label: t(
      value === "7d"
        ? "last7days"
        : value === "30d"
          ? "last30days"
          : "last90days",
    ),
  }));

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    toast.info("Generating report...", "This may take a few seconds");
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    toast.success("Report generated!", "Your report is ready to download");
  }, []);

  const handleDownload = useCallback((title: string) => {
    const csv = `Report: ${title}\nGenerated: ${new Date().toLocaleString()}\n\nMonth,Revenue,Users\nJan,42000,1240\nFeb,47500,1388\nMar,51200,1551`;
    downloadCSV(title, csv);
  }, []);

  const handleExportAll = useCallback(() => {
    toast.info("Export started", "All reports are being exported");
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <DateRangeSelector
          value={range}
          onChange={setRange}
          ranges={DATE_RANGES}
        />
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {generating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          {t("generate")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart range={range} locale={locale} />
        <UserGrowthChart range={range} locale={locale} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t("generatedReports")}</h3>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t("exportAll")}
          </button>
        </div>

        <div className="divide-y divide-border">
          {isLoading &&
            SKELETON_ROWS.map((i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="flex-1">
                  <div className="skeleton h-3 w-48 mb-2" />
                  <div className="skeleton h-2.5 w-64" />
                </div>
                <div className="skeleton h-5 w-16 rounded-md" />
              </div>
            ))}

          {!isLoading &&
            reports?.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                locale={locale}
                onDownload={handleDownload}
                t={t}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
