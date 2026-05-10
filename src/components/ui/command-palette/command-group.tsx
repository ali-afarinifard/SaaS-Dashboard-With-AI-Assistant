// src/components/ui/command-palette/command-group.tsx
"use client";
import { memo } from "react";
import { CommandItem } from "./command-item";
import type { CommandGroupProps } from "./types";

export const CommandGroup = memo(({
  group,
  items,
  startIndex,
  selected,
  isRTL,
  itemsRef,
  onSelect,
}: CommandGroupProps) => (
  <div className="mb-2">
    <div className="px-4 py-2">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
        {group}
      </p>
    </div>
    <div className="space-y-1 px-2">
      {items.map((cmd, i) => {
        const currentIndex = startIndex + i;
        return (
          <CommandItem
            key={cmd.id}
            cmd={cmd}
            isSelected={selected === currentIndex}
            currentIndex={currentIndex}
            isRTL={isRTL}
            itemRef={(el) => { itemsRef.current[currentIndex] = el; }}
            onMouseEnter={() => onSelect(currentIndex)}
          />
        );
      })}
    </div>
  </div>
));

CommandGroup.displayName = "CommandGroup";