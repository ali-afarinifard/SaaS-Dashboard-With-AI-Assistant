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
  valueFormatter,
  isRTL = false,
}: ICustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0];

  return (
    <div 
      className={cn(
        "bg-popover/95 border border-border p-2.5 rounded-lg shadow-xl backdrop-blur-md",
        isRTL ? "text-right font-vazir" : "text-left"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: data.payload.color || data.color }}
        />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            {data.name}:
          </span>
          <span className="text-xs font-bold tabular-nums text-foreground">
            {valueFormatter ? valueFormatter(data.value as number) : data.value}
          </span>
        </div>
      </div>
    </div>
  );
});

CustomTooltip.displayName = "CustomTooltip";