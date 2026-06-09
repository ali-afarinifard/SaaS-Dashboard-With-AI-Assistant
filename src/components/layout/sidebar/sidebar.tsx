"use client";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useSettingsStore } from "@/store";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isRTL = useSettingsStore((s) => s.locale === "fa");

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-60" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-sm whitespace-nowrap gradient-text">
              Analytics
            </span>
          )}
        </div>
      </div>

      <SidebarNav />

      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors z-10",
          isRTL ? "-left-3" : "-right-3",
        )}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>

      <SidebarUser />
    </aside>
  );
}
