// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, locale: string = "en-US") => {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export function formatPercent(
  value: number,
  locale: string = "en",
  decimals = 1,
): string {
  const isFa = locale.startsWith("fa");
  const formattedValue = Math.abs(value).toLocaleString(
    isFa ? "fa-IR" : "en-US",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    },
  );

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return isFa ? `${sign}${formattedValue}٪` : `${sign}${formattedValue}%`;
}

export function formatDate(date: string | Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDateLocale(date: string | Date, locale: string): string {
  const localeMap: Record<string, string> = { fa: "fa-IR", en: "en-US" };
  return new Intl.DateTimeFormat(localeMap[locale] ?? "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getTextDirection(text: string): "rtl" | "ltr" {
  const rtlChars =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/;
  const trimmed = text.trim();
  if (!trimmed) return "ltr";
  for (const char of trimmed) {
    if (rtlChars.test(char)) return "rtl";
    if (/[a-zA-Z]/.test(char)) return "ltr";
  }
  return "ltr";
}
