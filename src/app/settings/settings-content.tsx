"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Monitor,
  Globe,
  Bell,
  User,
  CreditCard,
  Users,
  Key,
  Save,
  Camera,
  Loader2,
} from "lucide-react";
import { useSettingsStore } from "@/store";
import { toast } from "@/components/ui/toast";
import { mockApi } from "@/lib/mock-api";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

type Tab = "profile" | "notifications" | "billing" | "team" | "api";

const tabs: { key: Tab; icon: React.ElementType }[] = [
  { key: "profile", icon: User },
  { key: "notifications", icon: Bell },
  { key: "billing", icon: CreditCard },
  { key: "team", icon: Users },
  { key: "api", icon: Key },
];

const NOTIFICATION_LABELS: Record<
  string,
  { label: string; description: string }
> = {
  email: {
    label: "Email notifications",
    description: "Receive updates via email",
  },
  push: {
    label: "Push notifications",
    description: "Browser push notifications",
  },
  weekly: { label: "Weekly digest", description: "Summary of weekly activity" },
  monthly: {
    label: "Monthly report",
    description: "Full monthly analytics report",
  },
};

export function SettingsContent() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── State ─────────────────────────────────────────────────────────────────

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@nexus.io",
    role: t("owner"),
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  const [apiKeys, setApiKeys] = useState([
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

  const [teamMembers, setTeamMembers] = useState([
    { id: "m1", name: "Admin User", email: "admin@nexus.io", role: t("owner") },
    { id: "m2", name: "Sarah Miller", email: "sarah@nexus.io", role: t("admin") },
    { id: "m3", name: "John Doe", email: "john@nexus.io", role: t("member") },
  ]);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await mockApi.profile.update(profile);
      toast.success(
        "Profile updated",
        "Your changes have been saved successfully",
      );
    } catch {
      toast.error("Save failed", "Something went wrong. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifs(true);
    try {
      await mockApi.notifications.update(notifications);
      toast.success("Preferences saved", "Notification settings updated");
    } catch {
      toast.error("Save failed", "Something went wrong. Please try again.");
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleRevokeKey = async (id: string, name: string) => {
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
  };

  const handleGenerateKey = async () => {
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
  };

  const handleInviteMember = async () => {
    setInviting(true);
    try {
      await mockApi.team.invite("new@nexus.io");
      toast.success("Invitation sent", "Invite link copied to clipboard");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    setRemovingMember(id);
    try {
      await mockApi.team.remove(name);
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      toast.warning("Member removed", `${name} has been removed from the team`);
    } catch {
      toast.error("Failed", "Could not remove member. Try again.");
    } finally {
      setRemovingMember(null);
    }
  };

  const themeOptions = [
    { value: "light", label: t("light"), icon: Sun },
    { value: "dark", label: t("dark"), icon: Moon },
    { value: "system", label: t("system"), icon: Monitor },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(key as any)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content panels */}
        <div className="flex-1 space-y-5">
          {/* ─── Profile ─── */}
          {activeTab === "profile" && (
            <>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold mb-5">
                  {t("profileInformation")}
                </h3>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                      {profile.firstName[0]}
                    </div>
                    <button
                      onClick={() =>
                        toast.info("Upload photo", "Photo upload coming soon")
                      }
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Camera className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t("firstName"), field: "firstName" as const },
                    { label: t("lastName"), field: "lastName" as const },
                    { label: t("email"), field: "email" as const },
                    { label: t("role"), field: "role" as const },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        {label}
                      </label>
                      <input
                     value={profile[field as keyof typeof profile]}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, [field]: e.target.value }))
                        }
                        disabled={field === "role"}
                        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg outline-none focus:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Appearance */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold mb-5">{t("appearance")}</h3>
                <div className="space-y-5">
                  {/* Theme */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-3">
                      {t("theme")}
                    </label>
                    <div className="flex gap-2">
                      {themeOptions.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setTheme(value);
                            toast.success(
                              "Theme changed",
                              `Switched to ${label} mode`,
                            );
                          }}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-2 py-3 rounded-lg border transition-all text-sm",
                            mounted && theme === value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-3">
                      {t("language")}
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "en", label: "English" },
                        { value: "fa", label: "فارسی" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setLocale(value as "en" | "fa");
                            window.location.reload();
                          }}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm",
                            locale === value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          )}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {savingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {savingProfile ? t("saving") : t("save")}
                </button>
              </div>
            </>
          )}

          {/* ─── Notifications ─── */}
          {activeTab === "notifications" && (
            <>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold mb-5">
                  {t("notificationPreferences")}
                </h3>
                <div className="space-y-5">
                  {(
                    Object.keys(notifications) as Array<
                      keyof typeof notifications
                    >
                  ).map((key) => (
                    <div
                      key={key}
                      className="border-b border-border/50 last:border-0 pb-5 last:pb-0"
                    >
                      <ToggleSwitch
                        checked={notifications[key]}
                        onChange={(val) =>
                          setNotifications((prev) => ({ ...prev, [key]: val }))
                        }
                        label={NOTIFICATION_LABELS[key].label}
                        description={NOTIFICATION_LABELS[key].description}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  disabled={savingNotifs}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {savingNotifs ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {savingNotifs ? "Saving..." : t("save")}
                </button>
              </div>
            </>
          )}

          {/* ─── Billing ─── */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold mb-1">{t("currentPlan")}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("billingActive")}
                </p>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <div>
                    <p className="font-bold text-lg">Enterprise</p>
                    <p className="text-xs text-muted-foreground">
                      {t("billingDesc")}
                    </p>
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
                  onClick={() =>
                    toast.info(
                      "Plan management",
                      "Contact sales to change your plan",
                    )
                  }
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
                    <p className="text-sm font-medium" dir="ltr">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">
                      {t("expires")} 12/27
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toast.info(
                        "Update card",
                        "Card update redirects to billing portal",
                      )
                    }
                    className="ml-auto text-xs text-primary hover:underline"
                  >
                    {t("update")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Team ─── */}
          {activeTab === "team" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold">{t("teamMembers")}</h3>
                <button
                  onClick={handleInviteMember}
                  disabled={inviting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {inviting && <Loader2 className="w-3 h-3 animate-spin" />}
                  {t("inviteMember")}
                </button>
              </div>
              <div className="space-y-3">
                {teamMembers.map(({ id, name, email, role }) => (
                  <div
                    key={id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold shrink-0">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                      {role}
                    </span>
                    {role !== "Owner" && (
                      <button
                        onClick={() => handleRemoveMember(id, name)}
                        disabled={removingMember === id}
                        className="flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50"
                      >
                        {removingMember === id && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        {t("remove")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── API Keys ─── */}
          {activeTab === "api" && (
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
                        Created {created}
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
          )}
        </div>
      </div>
    </div>
  );
}
