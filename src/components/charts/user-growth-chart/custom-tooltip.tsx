"use client";
import { memo } from "react";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { formatCurrency } from "@/lib/utils";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  valueFormatter?: (value: number) => string;
}

export const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
  valueFormatter = formatCurrency,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <p className="text-muted-foreground text-xs mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-xs capitalize">{p.name}:</span>
          <span className="text-xs font-semibold">
            {valueFormatter(p.value as number)}
          </span>
        </div>
      ))}
    </div>
  );
});

CustomTooltip.displayName = "CustomTooltip";