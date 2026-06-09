import { memo, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface IMetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  locale: string;
}

export const MetricCard = memo(function MetricCard({
  label,
  value,
  change,
  prefix = "",
  suffix = "",
  description,
  icon,
  loading = false,
  locale,
}: IMetricCardProps) {
  const isRTL = locale === "fa";

  const formattedValue = useMemo(
    () =>
      typeof value === "number"
        ? value.toLocaleString(isRTL ? "fa-IR" : "en-US")
        : value,
    [value, isRTL],
  );

  const trend = useMemo(() => {
    if (change === undefined) return "neutral" as const;
    if (change > 0) return "positive" as const;
    if (change < 0) return "negative" as const;
    return "neutral" as const;
  }, [change]);

  if (loading) {
    return (
      <div className={cn("bg-card rounded-xl p-5 border border-border", isRTL && "font-vazir")}>
        <div className="skeleton h-3 w-24 mb-4" />
        <div className="skeleton h-7 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "bg-card rounded-xl p-5 border border-border card-hover group transition-all",
        isRTL ? "font-vazir text-right" : "text-left",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className="p-1.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>

      <p className="text-2xl font-bold tracking-tight mb-2">
        {isRTL ? (
          <span className="flex items-center gap-1 justify-start">
            <span>{formattedValue}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {prefix || suffix}
            </span>
          </span>
        ) : (
          `${prefix}${formattedValue}${suffix}`
        )}
      </p>

      {change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold",
            trend === "positive" && "text-emerald-500",
            trend === "negative" && "text-rose-500",
            trend === "neutral" && "text-muted-foreground",
          )}
        >
          <div className={cn("flex items-center", isRTL && "scale-x-[-1]")}>
            {trend === "positive" && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === "negative" && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === "neutral" && <Minus className="w-3.5 h-3.5" />}
          </div>

          <span dir="ltr" className="inline-block">
            {formatPercent(change, isRTL ? "fa-IR" : "en-US")}
          </span>

          {description && (
            <span className={cn(
              "text-muted-foreground font-normal text-[11px]",
              isRTL ? "mr-1" : "ml-1",
            )}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
});