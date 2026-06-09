"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Globe, Save, Camera, Loader2, Sun, Moon, Monitor } from "lucide-react";
import { useSettingsStore } from "@/store";
import { toast } from "@/components/ui/toast";
import { mockApi } from "@/lib/mock-api";
import { cn } from "@/lib/utils";

const PROFILE_FIELDS = ["firstName", "lastName", "email", "role"] as const;
type ProfileField = (typeof PROFILE_FIELDS)[number];

const THEME_OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

const LOCALE_OPTIONS = [
  { value: "en" as const, label: "English" },
  { value: "fa" as const, label: "فارسی" },
] as const;

// ThemeButton
const ThemeButton = memo(function ThemeButton({
  value,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: (value: string, label: string) => void;
}) {
  const handleClick = useCallback(
    () => onClick(value, label),
    [onClick, value, label],
  );
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-2 py-3 rounded-lg border transition-all text-sm",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
});

// ProfileField input
const ProfileFieldInput = memo(function ProfileFieldInput({
  field,
  label,
  value,
  onChange,
}: {
  field: ProfileField;
  label: string;
  value: string;
  onChange: (field: ProfileField, value: string) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
    [onChange, field],
  );
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={handleChange}
        disabled={field === "role"}
        className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg outline-none focus:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
});

export function ProfileTab() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();

  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@me.io",
    role: t("owner"),
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = useCallback(async () => {
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
  }, [profile]);

  const handleFieldChange = useCallback(
    (field: ProfileField, value: string) => {
      setProfile((p) => ({ ...p, [field]: value }));
    },
    [],
  );

  const handleThemeChange = useCallback(
    (value: string, label: string) => {
      setTheme(value);
      toast.success("Theme changed", `Switched to ${label} mode`);
    },
    [setTheme],
  );

  const handleLocaleChange = useCallback(
    (value: "en" | "fa") => {
      setLocale(value);
      window.location.reload();
    },
    [setLocale],
  );

  const handleCameraClick = useCallback(() => {
    toast.info("Upload photo", "Photo upload coming soon");
  }, []);

  return (
    <>
      {/* Profile Information */}
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
              onClick={handleCameraClick}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Camera className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          {PROFILE_FIELDS.map((field) => (
            <ProfileFieldInput
              key={field}
              field={field}
              label={t(field)}
              value={profile[field]}
              onChange={handleFieldChange}
            />
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
              {THEME_OPTIONS.map(({ value, icon }) => (
                <ThemeButton
                  key={value}
                  value={value}
                  label={t(value)}
                  icon={icon}
                  active={mounted && theme === value}
                  onClick={handleThemeChange}
                />
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-3">
              {t("language")}
            </label>
            <div className="flex gap-2">
              {LOCALE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleLocaleChange(value)}
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

      {/* Save */}
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
  );
}
