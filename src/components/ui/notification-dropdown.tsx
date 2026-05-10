// src/components/ui/notification-dropdown.tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useSettingsStore } from "@/store";
import { useTranslations } from "next-intl";
import { Portal } from "./portal";

interface Notification {
  id: string;
  type: "revenue" | "user" | "alert" | "feature";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "revenue",
    title: "MRR milestone reached",
    description: "Your MRR crossed $98K this month 🎉",
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "n2",
    type: "user",
    title: "New enterprise signup",
    description: "Fatima Al-Rashid joined on Enterprise plan",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "n3",
    type: "alert",
    title: "Churn rate increased",
    description: "4 customers churned in the last 48 hours",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: "n4",
    type: "feature",
    title: "AI Assistant usage up 34%",
    description: "Most engaging feature this month",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "n5",
    type: "user",
    title: "340 new signups this month",
    description: "Up 4.6% compared to last month",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
];

const typeIcon = {
  revenue: TrendingUp,
  user: UserPlus,
  alert: AlertTriangle,
  feature: Zap,
};

const typeColor = {
  revenue: "text-success bg-success/10",
  user: "text-primary bg-primary/10",
  alert: "text-warning bg-warning/10",
  feature: "text-accent bg-accent/10",
};

const PORTAL_ID = "notification-portal";

export function NotificationDropdown() {
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useSettingsStore();
  const t = useTranslations("notifications");
  const isRTL = locale === "fa";

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const portalContent = document.getElementById(PORTAL_ID);
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !portalContent?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className="relative p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center",
              isRTL ? "-left-0.5" : "-right-0.5",
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <Portal>
          <div
            id={PORTAL_ID}
            className={cn(
              "fixed top-16 z-[9999] w-80 bg-card border border-border rounded-xl shadow-2xl animate-slide-up overflow-hidden",
              isRTL ? "left-32" : "right-32",
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{t("title")}</h3>
                {unreadCount > 0 && (
                  <div className="px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    <span
                      className={cn("relative", "top-[2px]")}
                    >
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <CheckCheck className="w-3 h-3" />
                  {t("markAllRead")}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
              {notifications.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-start",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-lg shrink-0 mt-0.5",
                        typeColor[n.type],
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-xs font-medium",
                            !n.read && "text-foreground",
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {n.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-1">
                        {formatRelativeTime(n.time)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border">
              <button className="w-full text-xs text-primary hover:underline text-center">
                {t("viewAll")}
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
