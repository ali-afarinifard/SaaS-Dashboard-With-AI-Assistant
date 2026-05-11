"use client";
import { useCallback } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, Search } from "lucide-react";
import { useSettingsStore } from "@/store";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TopbarActionsProps {
  onSearchOpen: () => void;
  mounted: boolean;
}

export function TopbarActions({ onSearchOpen, mounted }: TopbarActionsProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");
  const { locale } = useSettingsStore();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleLocale = useCallback(() => {
    const newLocale = locale === "en" ? "fa" : "en";
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    window.location.reload();
  }, [locale]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSearchOpen}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground bg-secondary border border-border hover:border-primary/40 hover:text-foreground transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="text-xs relative top-[1px]">{t("search")}</span>
        <div
          className={cn(
            "text-[11px] px-1.5 py-0.5 bg-background rounded border border-border",
            locale === "fa" ? "mr-2" : "ml-2",
          )}
        >
          <kbd
            className={cn(
              locale === "fa" ? "relative top-[2px]" : "relative top-[1px]",
            )}
          >
            ⌘
          </kbd>
        </div>
      </button>

      <NotificationDropdown />

      <button
        onClick={toggleLocale}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="relative top-[2px]">
          {locale === "en" ? "FA" : "EN"}
        </span>
      </button>

      <button
        onClick={toggleTheme}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Toggle theme"
      >
        {mounted ? (
          theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )
        ) : (
          <span className="w-4 h-4 block" />
        )}
      </button>
    </div>
  );
}
