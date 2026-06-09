"use client";
import { useState, memo, useCallback } from "react";
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

const TabButton = memo(function TabButton({
  tabKey,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  tabKey: Tab;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: (key: Tab) => void;
}) {
  const handleClick = useCallback(() => onClick(tabKey), [onClick, tabKey]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </button>
  );
});

export function SettingsContent() {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ key, icon }) => (
              <TabButton
                key={key}
                tabKey={key}
                icon={icon}
                label={t(key)}
                active={activeTab === key}
                onClick={setActiveTab} 
              />
            ))}
          </nav>
        </aside>

        {/* Tab panels */}
        <div className="flex-1 space-y-5">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "api" && <ApiKeysTab />}
        </div>
      </div>
    </div>
  );
}
