"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Bot,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useChatStore, useSettingsStore } from "@/store";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "customers", href: "/customers", icon: Users },
  { key: "settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const t = useTranslations("nav");
   const { locale } = useSettingsStore();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { setIsOpen: setChatOpen } = useChatStore();

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

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {navItems.map(({ key, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && (
                <span className="whitespace-nowrap">
                  {t(key as keyof typeof t)}
                </span>
              )}
            </Link>
          );
        })}

        {/* AI Assistant button */}
        <button
          onClick={() => setChatOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <Bot className="w-4 h-4 shrink-0" />
          {sidebarOpen && (
            <span className="whitespace-nowrap">{t("aiAssistant")}</span>
          )}
        </button>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className={`absolute ${locale === "fa" ? "-left-3" : "-right-3"} top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors z-10`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>

      {/* User avatar bottom */}
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
                admin@nexus.io
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
