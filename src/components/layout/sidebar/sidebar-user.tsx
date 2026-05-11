"use client";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

export function SidebarUser() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="p-3 border-t border-border">
      <div
        className={cn(
          "flex items-center gap-3",
          !sidebarOpen && "justify-center",
        )}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent shrink-0 flex items-center justify-center text-xs font-bold text-white">
          A
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">
              admin@me.io
            </p>
          </div>
        )}
      </div>
    </div>
  );
}