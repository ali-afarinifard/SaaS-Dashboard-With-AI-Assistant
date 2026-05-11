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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useChatStore } from "@/store";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "customers", href: "/customers", icon: Users },
  { key: "settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();
  const { setIsOpen: setChatOpen } = useChatStore();

  return (
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
              <span className="whitespace-nowrap">{t(key as any)}</span>
            )}
          </Link>
        );
      })}

      <button
        onClick={() => setChatOpen(true)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Bot className="w-4 h-4 shrink-0" />
        {sidebarOpen && (
          <span className="whitespace-nowrap">{t("aiAssistant")}</span>
        )}
      </button>
    </nav>
  );
}