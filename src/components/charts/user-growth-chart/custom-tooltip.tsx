"use client";

import { memo } from "react";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";

interface ICustomTooltipProps extends TooltipProps<ValueType, NameType> {
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
        "bg-popover/95 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md min-w-[120px]",
        isRTL ? "text-right font-vazir" : "text-left"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <p className="text-foreground text-[11px] mb-2 font-medium">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: p.color }}
              />
              <span className="text-[11px] text-foreground/80 capitalize">
                {p.name}:
              </span>
            </div>
            <span className="text-xs font-bold tabular-nums">
              {valueFormatter ? valueFormatter(p.value as number) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

CustomTooltip.displayName = "CustomTooltip";