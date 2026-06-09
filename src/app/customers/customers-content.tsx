"use client";
import { useState, useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import { Search, Download } from "lucide-react";
import { useCustomers } from "@/hooks/use-queries";
import { useSettingsStore } from "@/store";
import { downloadCSV } from "@/lib/download";
import { cn } from "@/lib/utils";
import { CustomerTable } from "@/components/ui/customer-table";
import { ICustomer } from "@/types";

const STATUS_OPTIONS = [
  "all",
  "active",
  "trial",
  "inactive",
  "churned",
] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

function buildCSV(customers: ICustomer[], isRTL: boolean): string {
  return [
    "Name,Email,Plan,Status,Joined,Revenue",
    ...customers.map(
      (c) =>
        `${c.name},${c.email},${c.plan},${c.status},${c.joinedAt},${
          isRTL ? c.revenue.toLocaleString("fa-IR") : c.revenue
        }`,
    ),
  ].join("\n");
}

const StatusButton = memo(function StatusButton({
  status,
  active,
  label,
  onClick,
}: {
  status: StatusOption;
  active: boolean;
  label: string;
  onClick: (s: StatusOption) => void;
}) {
  return (
    <button
      onClick={() => onClick(status)}
      className={cn(
        "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
});

export function CustomersContent() {
  const t = useTranslations("customers");

  const isRTL = useSettingsStore((s) => s.locale === "fa");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOption>("all");
  const { data: customers, isLoading } = useCustomers(search, statusFilter);

  const handleExport = useCallback(() => {
    if (!customers?.length) return;
    downloadCSV("customers", buildCSV(customers, isRTL));
  }, [customers, isRTL]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleStatusChange = useCallback((s: StatusOption) => {
    setStatusFilter(s);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3",
            )}
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder={t("search")}
            className={cn(
              "w-full py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/50 transition-all",
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4",
            )}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-secondary/50 border border-border rounded-lg p-1">
            {STATUS_OPTIONS.map((s) => (
              <StatusButton
                key={s}
                status={s}
                active={statusFilter === s}
                label={t(s)}
                onClick={handleStatusChange}
              />
            ))}
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="relative top-[1px]">{t("export")}</span>
          </button>
        </div>
      </div>

      <CustomerTable customers={customers} isLoading={isLoading} />
    </div>
  );
}
