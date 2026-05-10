"use client";

import { cn } from "@/lib/utils";
import type { DateRange } from "@/hooks/use-queries";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  ranges: { value: DateRange; label: string }[];
}

export function DateRangeSelector({
  value,
  onChange,
  ranges,
}: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === r.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}