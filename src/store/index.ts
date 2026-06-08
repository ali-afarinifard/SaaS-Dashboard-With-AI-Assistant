// src/store/index.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IChatMessage, Locale, Theme } from "@/types";
import { generateId } from "@/lib/utils";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
}

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`;
}

// ─── UI Store
interface IUIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<IUIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// ─── Settings Store
interface ISettingsState {
  theme: Theme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
}

export const useSettingsStore = create<ISettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      locale: "en",
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => {
        setLocaleCookie(locale);
      },
    }),
    {
      name: "saas-dashboard-settings",
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const cookieLocale = getCookie("locale") as Locale | undefined;
          state.locale = cookieLocale ?? "en";
        }
      },
    }
  )
);

// ─── AI Chat Store
interface ChatState {
  messages: IChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (role: IChatMessage["role"], content: string) => string;
  updateMessage: (id: string, content: string, isLoading?: boolean) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  setIsOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  addMessage: (role, content) => {
    const id = generateId();
    set((s) => ({
      messages: [
        ...s.messages,
        { id, role, content, timestamp: new Date(), isLoading: false },
      ],
    }));
    return id;
  },
  updateMessage: (id, content, isLoading = false) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content, isLoading } : m,
      ),
    })),
  removeMessage: (id) =>
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
  clearMessages: () => set({ messages: [] }),
  setIsOpen: (open) => set({ isOpen: open }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));