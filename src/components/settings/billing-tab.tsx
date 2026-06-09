"use client";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { CreditCard } from "lucide-react";
import { useSettingsStore } from "@/store";
import { toast } from "@/components/ui/toast";

export function BillingTab() {
  const t = useTranslations("settings");

  const locale = useSettingsStore((s) => s.locale);

  const handleManagePlan = useCallback(() => {
    toast.info("Plan management", "Contact sales to change your plan");
  }, []);

  const handleUpdateCard = useCallback(() => {
    toast.info("Update card", "Card update redirects to billing portal");
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">{t("currentPlan")}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {t("billingActive")}
        </p>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div>
            <p className="font-bold text-lg">Enterprise</p>
            <p className="text-xs text-muted-foreground">{t("billingDesc")}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">
              $299
              {locale === "en" && (
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("billedAnnually")}
            </p>
          </div>
        </div>
        <button
          onClick={handleManagePlan}
          className="mt-4 text-xs text-primary hover:underline"
        >
          {t("managePlan")} →
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-4">{t("paymentMethod")}</h3>
        <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
          <div className="w-10 h-7 bg-secondary rounded flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium" dir="ltr">
              •••• •••• •••• 4242
            </p>
            <p className="text-xs text-muted-foreground">
              {t("expires")} 12/27
            </p>
          </div>
          <button
            onClick={handleUpdateCard}
            className="ml-auto text-xs text-primary hover:underline"
          >
            {t("update")}
          </button>
        </div>
      </div>
    </div>
  );
}
