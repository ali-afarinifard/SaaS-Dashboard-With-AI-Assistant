import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Locale, Theme } from "@/types";
import { generateId } from "@/lib/utils";

// ─── UI Store
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// ─── Settings Store
interface SettingsState {
  theme: Theme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      locale: "en",
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => {
        set({ locale });
        // Sync with cookie for next-intl
        document.cookie = `locale=${locale};path=/;max-age=31536000`;
      },
    }),
    { name: "saas-dashboard-settings" }
  )
);

// ─── AI Chat Store
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (role: ChatMessage["role"], content: string) => string;
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
        m.id === id ? { ...m, content, isLoading } : m
      ),
    })),
  removeMessage: (id) =>
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
  clearMessages: () => set({ messages: [] }),
  setIsOpen: (open) => set({ isOpen: open }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
