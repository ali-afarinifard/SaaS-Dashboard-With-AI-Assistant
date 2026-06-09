"use client";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/hooks/use-queries";

interface IDateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  ranges: { value: DateRange; label: string }[];
}

const RangeButton = memo(function RangeButton({
  rangeValue,
  label,
  active,
  onClick,
}: {
  rangeValue: DateRange;
  label: string;
  active: boolean;
  onClick: (v: DateRange) => void;
}) {
  return (
    <button
      onClick={() => onClick(rangeValue)}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
});

export const DateRangeSelector = memo(function DateRangeSelector({
  value,
  onChange,
  ranges,
}: IDateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {ranges.map((r) => (
        <RangeButton
          key={r.value}
          rangeValue={r.value}
          label={r.label}
          active={value === r.value}
          onClick={onChange}
        />
      ))}
    </div>
  );
});