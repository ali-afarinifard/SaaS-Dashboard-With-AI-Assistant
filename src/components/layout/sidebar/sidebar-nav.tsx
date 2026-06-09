"use client";
import { memo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, BarChart3, Users, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useChatStore } from "@/store";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "customers", href: "/customers", icon: Users },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

type NavKey = (typeof navItems)[number]["key"];

const NavItem = memo(function NavItem({
  href,
  icon: Icon,
  label,
  active,
  sidebarOpen,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  sidebarOpen: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
});

export const SidebarNav = memo(function SidebarNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setChatOpen = useChatStore((s) => s.setIsOpen);

  const handleChatOpen = useCallback(() => setChatOpen(true), [setChatOpen]);

  return (
    <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
      {navItems.map(({ key, href, icon }) => (
        <NavItem
          key={key}
          href={href}
          icon={icon}
          label={t(key as NavKey)}
          active={pathname.startsWith(href)}
          sidebarOpen={sidebarOpen}
        />
      ))}

      <button
        onClick={handleChatOpen}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Bot className="w-4 h-4 shrink-0" />
        {sidebarOpen && (
          <span className="whitespace-nowrap">{t("aiAssistant")}</span>
        )}
      </button>
    </nav>
  );
});
