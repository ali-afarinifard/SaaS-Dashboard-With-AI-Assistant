import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { ReportsContent } from "./reports-content";
import { getTranslations } from "next-intl/server";

export default async function ReportsPage() {
  const t = await getTranslations("reports");
  return (
    <DashboardShell>
      <Topbar title={t("title")} subtitle={t("subtitle")} />
      <div className="flex-1 overflow-y-auto p-6">
        <ReportsContent />
      </div>
    </DashboardShell>
  );
}
