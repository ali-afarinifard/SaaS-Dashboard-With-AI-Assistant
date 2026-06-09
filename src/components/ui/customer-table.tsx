"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDateLocale } from "@/lib/utils";
import { useSettingsStore } from "@/store";
import { CustomerStatus, ICustomer, PlanType } from "@/types";

interface ICustomerTableProps {
  customers: ICustomer[] | undefined;
  isLoading: boolean;
}

const STATUS_VARIANT = {
  active: "success",
  trial: "warning",
  inactive: "outline",
  churned: "destructive",
} as const satisfies Record<CustomerStatus, "success" | "warning" | "destructive" | "outline">;

const PLAN_VARIANT = {
  starter: "secondary",
  pro: "default",
  business: "default",
  enterprise: "default",
} as const satisfies Record<PlanType, "default" | "secondary">;

const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => i);

// Skeleton Row
const SkeletonRow = memo(function SkeletonRow({ isRTL }: { isRTL: boolean }) {
  return (
    <tr>
      <td className="px-5 py-4"><div className="skeleton h-4 w-32" /></td>
      <td className="px-4 py-4 hidden md:table-cell"><div className="skeleton h-5 w-16" /></td>
      <td className="px-4 py-4"><div className="skeleton h-5 w-14" /></td>
      <td className="px-4 py-4 hidden lg:table-cell"><div className="skeleton h-4 w-20" /></td>
      <td className="px-5 py-4 text-end">
        <div className={cn("skeleton h-4 w-12", isRTL ? "me-auto" : "ms-auto")} />
      </td>
    </tr>
  );
});

// Customer Row
const CustomerRow = memo(function CustomerRow({
  customer,
  locale,
  t,
}: {
  customer: ICustomer;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors cursor-pointer group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <span className="relative top-[1px]">{customer.name.charAt(0)}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm truncate">{customer.name}</span>
            <span className="text-xs text-muted-foreground truncate">{customer.email}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <Badge variant={PLAN_VARIANT[customer.plan]} className="font-normal">
          <span className="relative top-[1px] capitalize">{customer.plan}</span>
        </Badge>
      </td>
      <td className="px-4 py-4">
        <Badge variant={STATUS_VARIANT[customer.status]} className="capitalize font-normal">
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
          {customer.revenue > 0 ? formatCurrency(customer.revenue, locale) : "—"}
        </span>
      </td>
    </tr>
  );
});

// Main Component
export function CustomerTable({ customers, isLoading }: ICustomerTableProps) {
  const t = useTranslations("customers");

  const locale = useSettingsStore((s) => s.locale);
  const isRTL = locale === "fa";

  const count = useMemo(
    () =>
      customers?.length
        ? isRTL
          ? customers.length.toLocaleString("fa-IR")
          : customers.length
        : null,
    [customers?.length, isRTL],
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-start px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("name")}</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">{t("plan")}</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("status")}</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">{t("joined")}</th>
              <th className="text-end px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("revenue")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              SKELETON_ROWS.map((i) => <SkeletonRow key={i} isRTL={isRTL} />)
            ) : customers?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground italic">
                  {t("noCustomers")}
                </td>
              </tr>
            ) : (
              customers!.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  locale={locale}
                  t={t}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {count !== null && (
        <div className="px-5 py-3 border-t border-border bg-secondary/10">
          <p className="text-xs text-muted-foreground">
            {t("showingCustomers", { count })}
          </p>
        </div>
      )}
    </div>
  );
}