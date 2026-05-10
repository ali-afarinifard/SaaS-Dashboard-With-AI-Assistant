import { memo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
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
}: MetricCardProps) {

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="skeleton h-3 w-24 mb-4" />
        <div className="skeleton h-7 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-card rounded-xl p-5 border border-border card-hover group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className="p-1.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>

      <p className="text-2xl font-bold tracking-tight mb-2">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </p>

      {change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive && "metric-up",
            isNegative && "metric-down",
            !isPositive && !isNegative && "text-muted-foreground",
          )}
        >
          {isPositive && <TrendingUp className="w-3 h-3" />}
          {isNegative && <TrendingDown className="w-3 h-3" />}
          {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
          <span>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          {description && (
            <span className="text-muted-foreground font-normal ml-1">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
