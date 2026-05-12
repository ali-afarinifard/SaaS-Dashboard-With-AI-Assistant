"use client";
import { memo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ICommandItemProps } from "./types";

export const CommandItem = memo(({
  cmd,
  isSelected,
  isRTL,
  itemRef,
  onMouseEnter,
}: ICommandItemProps) => {
  const Icon = cmd.icon;

  return (
    <button
      ref={itemRef}
      onClick={cmd.action}
      onMouseEnter={onMouseEnter}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all group",
        isSelected
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.01]"
          : "hover:bg-secondary/80 text-foreground",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg shrink-0",
          isSelected
            ? "bg-white/20"
            : "bg-secondary group-hover:bg-background",
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none">{cmd.label}</p>
        <p
          className={cn(
            "text-xs mt-1 truncate",
            isSelected
              ? "text-primary-foreground/80"
              : "text-muted-foreground",
          )}
        >
          {cmd.description}
        </p>
      </div>

      {isSelected && (
        isRTL
          ? <ArrowLeft className="w-4 h-4 animate-in slide-in-from-right-2" />
          : <ArrowRight className="w-4 h-4 animate-in slide-in-from-left-2" />
      )}
    </button>
  );
});

CommandItem.displayName = "CommandItem";