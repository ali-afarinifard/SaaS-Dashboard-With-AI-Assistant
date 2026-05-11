"use client";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isRTL?: boolean;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  isRTL,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold mb-2 text-foreground">{label}</p>

        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-between"
            >
              <span className="text-[11px] font-mono font-medium text-foreground">
                {isRTL
                  ? `${entry.value.toLocaleString("fa-IR")} دلار`
                  : `$${entry.value.toLocaleString()}`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {entry.name === "revenue"
                    ? isRTL
                      ? "درآمد"
                      : "Revenue"
                    : entry.name}
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.stroke }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

CustomTooltip.displayName = "CustomTooltip";
