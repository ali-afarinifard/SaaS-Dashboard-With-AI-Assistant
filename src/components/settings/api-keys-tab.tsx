"use client";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Key, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { mockApi } from "@/lib/mock-api";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
}

export function ApiKeysTab() {
  const t = useTranslations("settings");

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "k1",
      name: "Production Key",
      key: "nx_live_••••••••••••••3f2a",
      created: "Jan 15, 2026",
    },
    {
      id: "k2",
      name: "Development Key",
      key: "nx_test_••••••••••••••8c1d",
      created: "Mar 2, 2026",
    },
  ]);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [revokingKey, setRevokingKey] = useState<string | null>(null);

  const handleRevokeKey = useCallback(async (id: string, name: string) => {
    setRevokingKey(id);
    try {
      await mockApi.apiKeys.revoke(name);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.warning("Key revoked", `"${name}" has been revoked`);
    } catch {
      toast.error("Failed", "Could not revoke key. Try again.");
    } finally {
      setRevokingKey(null);
    }
  }, []);

  const handleGenerateKey = useCallback(async () => {
    setGeneratingKey(true);
    try {
      const res = await mockApi.apiKeys.generate();
      setApiKeys((prev) => [
        ...prev,
        {
          id: `k${Date.now()}`,
          name: "New Key",
          key: res.key,
          created: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
      ]);
      toast.success("Key generated", "Copy it now — it won't be shown again");
    } catch {
      toast.error("Failed", "Could not generate key. Try again.");
    } finally {
      setGeneratingKey(false);
    }
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold mb-5">API Keys</h3>
      <div className="space-y-3">
        {apiKeys.map(({ id, name, key, created }) => (
          <div
            key={id}
            className="flex items-center gap-3 p-4 rounded-lg border border-border/50"
          >
            <Key className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                {key}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("created")} {created}
              </p>
            </div>
            <button
              onClick={() => handleRevokeKey(id, name)}
              disabled={revokingKey === id}
              className="flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50 shrink-0"
            >
              {revokingKey === id && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {t("revoke")}
            </button>
          </div>
        ))}
        <button
          onClick={handleGenerateKey}
          disabled={generatingKey}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-primary border border-dashed border-primary/40 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-60"
        >
          {generatingKey ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> {t("generating")}
            </>
          ) : (
            t("generateNewKey")
          )}
        </button>
      </div>
    </div>
  );
}
