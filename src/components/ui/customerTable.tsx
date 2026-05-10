"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateLocale } from "@/lib/utils";
import { useSettingsStore } from "@/store";
import type { Customer, CustomerStatus, PlanType } from "@/types";

interface CustomerTableProps {
  customers: Customer[] | undefined;
  isLoading: boolean;
}

const statusVariant: Record<CustomerStatus, "success" | "warning" | "destructive" | "outline"> = {
  active: "success",
  trial: "warning",
  inactive: "outline",
  churned: "destructive",
};

const planVariant: Record<PlanType, "default" | "secondary"> = {
  starter: "secondary",
  pro: "default",
  business: "default",
  enterprise: "default",
};

export function CustomerTable({ customers, isLoading }: CustomerTableProps) {
  const t = useTranslations("customers");
  const { locale } = useSettingsStore();
  const isRTL = locale === "fa";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {/* استفاده از text-start برای تراز خودکار بر اساس جهت صفحه */}
              <th className="text-start px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                {t("plan")}
              </th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                {t("joined")}
              </th>
              {/* فیلد عددی معمولاً در هر دو حالت بهتر است از جهت مخالف تراز شود */}
              <th className="text-end px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("revenue")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-4"><div className="skeleton h-4 w-32" /></td>
                  <td className="px-4 py-4 hidden md:table-cell"><div className="skeleton h-5 w-16" /></td>
                  <td className="px-4 py-4"><div className="skeleton h-5 w-14" /></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><div className="skeleton h-4 w-20" /></td>
                  <td className="px-5 py-4 text-end"><div className="skeleton h-4 w-12 ms-auto" /></td>
                </tr>
              ))
            ) : customers?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground italic">
                  {isRTL ? "مشتری‌ای یافت نشد" : "No customers found"}
                </td>
              </tr>
            ) : (
              customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-secondary/30 transition-colors cursor-pointer group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">{customer.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <Badge variant={planVariant[customer.plan] as any} className="font-normal relative">
                      <span className="relative top-[1px] capitalize">
                      {customer.plan}
                      </span>
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusVariant[customer.status]} className="capitalize font-normal">
                      {t(customer.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {formatDateLocale(customer.joinedAt, locale)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-end">
                    <span className="text-sm font-semibold tabular-nums">
                      {customer.revenue > 0 ? formatCurrency(customer.revenue) : "—"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && customers && customers.length > 0 && (
        <div className="px-5 py-3 border-t border-border bg-secondary/10">
          <p className="text-xs text-muted-foreground">
            {isRTL ? `نمایش ${customerTableCountFa(customers.length)} مشتری` : `Showing ${customers.length} customers`}
          </p>
        </div>
      )}
    </div>
  );
}

function customerTableCountFa(n: number) {
  return n.toLocaleString("fa-IR");
}