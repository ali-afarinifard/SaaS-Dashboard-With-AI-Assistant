"use client";

import { memo } from "react";
import type { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

interface ICustomTooltipProps extends TooltipProps<number, string> {
  valueFormatter?: (value: number) => string;
  isRTL?: boolean;
}

export const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
  valueFormatter,
  isRTL = false,
}: ICustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div 
      className={cn(
        "bg-popover/95 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md transition-all",
        isRTL ? "text-right" : "text-left"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <p className="text-muted-foreground text-[11px] mb-2 font-medium">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-[11px] text-foreground/80">{entry.name}:</span>
            </div>
            <span className="text-xs font-bold tabular-nums">
              {valueFormatter ? valueFormatter(entry.value as number) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});