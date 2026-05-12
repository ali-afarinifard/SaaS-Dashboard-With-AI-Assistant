"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore, useSettingsStore } from "@/store";
import { CommandGroup } from "./command-group";
import type { ICommand, ICommandPaletteProps } from "./types";

export function CommandPalette({ open, onClose }: ICommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tAi = useTranslations("ai");
  const tDash = useTranslations("dashboard");
  const tCust = useTranslations("customers");
  const tRep = useTranslations("reports");
  const tSet = useTranslations("settings");
  const tCmd = useTranslations("commandPalette");

  const { setIsOpen: setChatOpen } = useChatStore();
  const { locale } = useSettingsStore();
  const isRTL = locale === "fa";

  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(0);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      onClose();
    },
    [router, onClose],
  );

  const openChat = useCallback(() => {
    setChatOpen(true);
    onClose();
  }, [setChatOpen, onClose]);

  const commands: ICommand[] = useMemo(
    () => [
      {
        id: "dashboard",
        label: tNav("dashboard"),
        description: tDash("subtitle"),
        icon: LayoutDashboard,
        action: () => navigate("/dashboard"),
        group: tCmd("navigation"),
      },
      {
        id: "reports",
        label: tNav("reports"),
        description: tRep("subtitle"),
        icon: BarChart3,
        action: () => navigate("/reports"),
        group: tCmd("navigation"),
      },
      {
        id: "customers",
        label: tNav("customers"),
        description: tCust("subtitle"),
        icon: Users,
        action: () => navigate("/customers"),
        group: tCmd("navigation"),
      },
      {
        id: "settings",
        label: tNav("settings"),
        description: tSet("subtitle"),
        icon: Settings,
        action: () => navigate("/settings"),
        group: tCmd("navigation"),
      },
      {
        id: "ai",
        label: tAi("title"),
        description: tAi("subtitle"),
        icon: Bot,
        action: openChat,
        group: tCmd("actions"),
      },
    ],
    [navigate, openChat, tNav, tAi, tDash, tCust, tRep, tSet, tCmd],
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q),
    );
  }, [query, commands]);

  const groups = useMemo(
    () => [...new Set(filtered.map((c) => c.group))],
    [filtered],
  );

  useEffect(() => {
    itemsRef.current[selected]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    setQuery("");
    setSelected(0);
    itemsRef.current = [];
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelected((s) => Math.min(s + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelected((s) => Math.max(s - 1, 0));
          break;
        case "Enter":
          filtered[selected]?.action();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selected, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4",
        isRTL ? "font-vazir" : "font-sans",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tCommon("search")}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 px-2 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded uppercase">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2 custom-scrollbar">
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {tCmd("noResults", { query })}
              </p>
            </div>
          )}

          {groups.map((group) => {
            const groupItems = filtered.filter((c) => c.group === group);
            const groupStartIndex = filtered.findIndex((c) => c.group === group);

            return (
              <CommandGroup
                key={group}
                group={group}
                items={groupItems}
                startIndex={groupStartIndex}
                selected={selected}
                isRTL={isRTL}
                itemsRef={itemsRef}
                onSelect={setSelected}
              />
            );
          })}
        </div>
        {/* Footer */}
         <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-secondary rounded border border-border">↑↓</kbd> {tCmd("navigate")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-secondary rounded border border-border">↵</kbd> {tCmd("select")}
          </span>
        </div>
      </div>
    </div>
  );
}