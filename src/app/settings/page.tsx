import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar/topbar";
import { SettingsContent } from "./settings-content";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  return (
    <DashboardShell>
      <Topbar title={t("title")} subtitle={t("subtitle")} />
      <div className="flex-1 overflow-y-auto p-6">
        <SettingsContent />
      </div>
    </DashboardShell>
  );
}
