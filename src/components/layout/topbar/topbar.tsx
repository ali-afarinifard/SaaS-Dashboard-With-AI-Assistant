"use client";
import { useState, useEffect, useCallback } from "react";
import { CommandPalette } from "@/components/ui/command-palette";
import { TopbarActions } from "./topbar-actions";

interface ITopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: ITopbarProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCmd = useCallback(() => setCmdOpen(true), []);

  const closeCmd = () => setCmdOpen(false);

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

  return (
    <>
      <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <div>
          <h1 className="font-semibold text-base leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <TopbarActions onSearchOpen={openCmd} mounted={mounted} />
      </header>

      <CommandPalette open={cmdOpen} onClose={closeCmd} />
    </>
  );
}
