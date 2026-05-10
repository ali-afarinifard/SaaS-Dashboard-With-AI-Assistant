"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { User, Bell, CreditCard, Users, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileTab } from "@/components/settings/profile-tab";
import { NotificationsTab } from "@/components/settings/notifications-tab";
import { BillingTab } from "@/components/settings/billing-tab";
import { TeamTab } from "@/components/settings/team-tab";
import { ApiKeysTab } from "@/components/settings/api-keys-tab";

type Tab = "profile" | "notifications" | "billing" | "team" | "api";

const tabs: { key: Tab; icon: React.ElementType }[] = [
  { key: "profile", icon: User },
  { key: "notifications", icon: Bell },
  { key: "billing", icon: CreditCard },
  { key: "team", icon: Users },
  { key: "api", icon: Key },
];

export function SettingsContent() {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = useCallback((key: Tab) => setActiveTab(key), []);

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(key)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab panels */}
        <div className="flex-1 space-y-5">
          {activeTab === "profile" && <ProfileTab mounted={mounted} />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "api" && <ApiKeysTab />}
        </div>
      </div>
    </div>
  );
}
