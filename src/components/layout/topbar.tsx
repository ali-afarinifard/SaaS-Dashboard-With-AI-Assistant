"use client";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, Search } from "lucide-react";
import { useSettingsStore } from "@/store";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { CommandPalette } from "../ui/command-palette";

export function Topbar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");
  const { locale, setLocale } = useSettingsStore();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openCmd();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openCmd]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "fa" : "en");
    window.location.reload();
  }, [locale, setLocale]);

  return (
    <>
      <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        {/* Left */}
        <div>
          <h1 className="font-semibold text-base leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCmd}
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

          <button
            onClick={openCmd}
            className="sm:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Search className="w-4 h-4" />
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
      </header>

      <CommandPalette open={cmdOpen} onClose={closeCmd} />
    </>
  );
}
