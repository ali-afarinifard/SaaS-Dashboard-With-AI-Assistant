import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar/topbar";
import { DashboardContent } from "./dashboard-content";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <DashboardShell>
      <Topbar title={t("title")} subtitle={t("subtitle")} />
      <div className="flex-1 overflow-y-auto p-6">
        <DashboardContent />
      </div>
    </DashboardShell>
  );
}
