"use client";
import { useState, useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import { Save, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { mockApi } from "@/lib/mock-api";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

const NOTIFICATION_KEYS = ["email", "push", "weekly", "monthly"] as const;
type NotificationKey = (typeof NOTIFICATION_KEYS)[number];

const NotificationRow = memo(function NotificationRow({
  notifKey,
  checked,
  label,
  description,
  onToggle,
}: {
  notifKey: NotificationKey;
  checked: boolean;
  label: string;
  description: string;
  onToggle: (key: NotificationKey, val: boolean) => void;
}) {
  const handleChange = useCallback(
    (val: boolean) => onToggle(notifKey, val),
    [onToggle, notifKey],
  );
  return (
    <div className="border-b border-border/50 last:border-0 pb-5 last:pb-0">
      <ToggleSwitch
        checked={checked}
        onChange={handleChange}
        label={label}
        description={description}
      />
    </div>
  );
});

export function NotificationsTab() {
  const t = useTranslations("settings");
  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    email: true,
    push: false,
    weekly: true,
    monthly: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  const handleToggle = useCallback((key: NotificationKey, val: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleSave = useCallback(async () => {
    setSavingNotifs(true);
    try {
      await mockApi.notifications.update(notifications);
      toast.success("Preferences saved", "Notification settings updated");
    } catch {
      toast.error("Save failed", "Something went wrong. Please try again.");
    } finally {
      setSavingNotifs(false);
    }
  }, [notifications]);

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-5">
          {t("notificationPreferences")}
        </h3>
        <div className="space-y-5">
          {NOTIFICATION_KEYS.map((key) => (
            <NotificationRow
              key={key}
              notifKey={key}
              checked={notifications[key]}
              label={t(`${key}Notif`)}
              description={t(`${key}NotifDesc`)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={savingNotifs}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {savingNotifs ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {savingNotifs ? t("saving") : t("save")}
        </button>
      </div>
    </>
  );
}
