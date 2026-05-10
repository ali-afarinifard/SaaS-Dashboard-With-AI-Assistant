import { memo } from "react";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: payload[0].payload.color }}
        />
        <span className="text-xs">{payload[0].name}:</span>
        <span className="text-xs font-semibold">{payload[0].value}%</span>
      </div>
    </div>
  );
});

CustomTooltip.displayName = "CustomTooltip";
