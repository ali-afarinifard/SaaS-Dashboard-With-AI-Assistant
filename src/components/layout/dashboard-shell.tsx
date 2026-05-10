"use client";

import dynamic from "next/dynamic";
import { Sidebar } from "./sidebar";

// Lazy load heavy AI panel — only loads when user opens it
const AIChatPanel = dynamic(
  () => import("@/components/ai/chat-panel").then((m) => ({ default: m.AIChatPanel })),
  { ssr: false }
);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
      <AIChatPanel />
    </div>
  );
}
