"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface IToast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

// Global toast state (simple pub/sub)
type ToastListener = (toast: IToast) => void;
const listeners: ToastListener[] = [];

export function toast(options: Omit<IToast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const t: IToast = { duration: 4000, ...options, id };
  listeners.forEach((fn) => fn(t));
  return id;
}

toast.success = (title: string, description?: string) =>
  toast({ type: "success", title, description });
toast.error = (title: string, description?: string) =>
  toast({ type: "error", title, description });
toast.info = (title: string, description?: string) =>
  toast({ type: "info", title, description });
toast.warning = (title: string, description?: string) =>
  toast({ type: "warning", title, description });

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-primary/30 bg-primary/10 text-primary",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

function ToastItem({
  toast: t,
  onRemove,
}: {
  toast: IToast;
  onRemove: (id: string) => void;
}) {
  const Icon = icons[t.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), t.duration);
    return () => clearTimeout(timer);
  }, [t.id, t.duration, onRemove]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm",
        "bg-card/90 border-border animate-slide-in-right min-w-[280px] max-w-[360px]",
      )}
    >
      <div className={cn("p-1 rounded-md shrink-0", styles[t.type])}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{t.title}</p>
        {t.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onRemove(t.id)}
        className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = useCallback((t: IToast) => {
    setToasts((prev) => [...prev.slice(-4), t]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
