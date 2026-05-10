"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Download } from "lucide-react";
import { useCustomers } from "@/hooks/use-queries";
import { useSettingsStore } from "@/store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { CustomerTable } from "@/components/ui/customerTable";

const STATUS_OPTIONS = ["all", "active", "trial", "inactive", "churned"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

export function CustomersContent() {
  const t = useTranslations("customers");
  const { locale } = useSettingsStore();
  const isRTL = locale === "fa";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOption>("all");
  const { data: customers, isLoading } = useCustomers(search, statusFilter);

  const handleExport = () => {
    if (!customers?.length) return;
    const csv = [
      "Name,Email,Plan,Status,Joined,Revenue",
      ...customers.map(c => `${c.name},${c.email},${c.plan},${c.status},${c.joinedAt},${c.revenue}`)
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(
      isRTL ? "خروجی با موفقیت گرفته شد" : "Export complete",
      isRTL ? `${customers.length.toLocaleString("fa-IR")} مشتری صادر شدند` : `${customers.length} customers exported`
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
            isRTL ? "right-3" : "left-3"
          )} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className={cn(
              "w-full py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/50 transition-all",
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
            )}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-secondary/50 border border-border rounded-lg p-1">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  statusFilter === s
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(s)}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            {t("export")}
          </button>
        </div>
      </div>

      {/* Table Component */}
      <CustomerTable customers={customers} isLoading={isLoading} />
    </div>
  );
}