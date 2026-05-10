"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { X, Send, Bot, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore, useSettingsStore } from "@/store";
import { cn, getTextDirection } from "@/lib/utils";
import { MessageBubble } from "./message-bubble";

// Constants
const panelVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
} as const;

const panelTransition = {
  type: "spring",
  damping: 30,
  stiffness: 300,
} as const;

export function AIChatPanel() {
  const t = useTranslations("ai");
  const { locale } = useSettingsStore();
  const isRTL = locale === "fa";

  const {
    messages,
    isOpen,
    isLoading,
    setIsOpen,
    addMessage,
    updateMessage,
    clearMessages,
    setIsLoading,
  } = useChatStore();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setInput("");

      addMessage("user", text);
      setIsLoading(true);

      const store = useChatStore.getState();
      store.addMessage("assistant", "");
      const allMsgs = useChatStore.getState().messages;
      const lastMsg = allMsgs[allMsgs.length - 1];
      updateMessage(lastMsg.id, "", true);

      try {
        const history = useChatStore
          .getState()
          .messages.filter((m) => !m.isLoading)
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");

        updateMessage(lastMsg.id, data.content, false);
      } catch {
        updateMessage(lastMsg.id, t("errorMessage"), false);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, updateMessage, setIsLoading, t],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [sendMessage, input],
  );

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value),
    [],
  );
  const handleSend = useCallback(
    () => sendMessage(input),
    [sendMessage, input],
  );

  const suggestions = useMemo(
    () => [
      t("suggestions.revenue"),
      t("suggestions.churn"),
      t("suggestions.users"),
      t("suggestions.forecast"),
    ],
    [t],
  );

  const inputDir = input.trim()
    ? getTextDirection(input)
    : isRTL
      ? "rtl"
      : "ltr";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={panelTransition}
          dir={isRTL ? "rtl" : "ltr"}
          className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border flex flex-col shadow-2xl z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">{t("title")}</h2>
                <p className="text-xs text-muted-foreground">{t("poweredBy")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title={t("clearChat")}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-1">{t("title")}</p>
                  <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-start px-3 py-2.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isLoading={msg.isLoading}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-border shrink-0">
            <div className="flex items-end gap-2 bg-secondary rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                dir={inputDir}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                rows={1}
                className={cn(
                  "flex-1 bg-transparent text-xs resize-none outline-none text-foreground placeholder:text-muted-foreground max-h-28",
                  isRTL && "font-[Vazirmatn,sans-serif]",
                )}
                style={{ lineHeight: "1.5" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 text-center">
              {t("inputHint")}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}