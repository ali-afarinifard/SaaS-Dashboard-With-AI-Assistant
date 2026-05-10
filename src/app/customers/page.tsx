import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { CustomersContent } from "./customers-content";
import { getTranslations } from "next-intl/server";

export default async function CustomersPage() {
  const t = await getTranslations("customers");

  return (
    <DashboardShell>
      <Topbar title={t("title")} subtitle={t("subtitle")} />
      <div className="flex-1 overflow-y-auto p-6">
        <CustomersContent />
      </div>
    </DashboardShell>
  );
}
