"use client";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useTranslations } from "next-intl";
import { X, Send, Bot, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore, useSettingsStore } from "@/store";
import { cn, getTextDirection } from "@/lib/utils";
import { MessageBubble } from "./message-bubble";

const panelVariantsRTL = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
} as const;

const panelVariantsLTR = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
} as const;

const panelTransition = {
  type: "spring",
  damping: 30,
  stiffness: 300,
} as const;

const POSITION_RTL = "right-0 border-l border-border";
const POSITION_LTR = "left-0 border-r border-border";

const MIN_HEIGHT = 36;
const MAX_HEIGHT = 112;

const SUGGESTION_KEYS = [
  "suggestions.revenue",
  "suggestions.churn",
  "suggestions.users",
  "suggestions.forecast",
] as const;

const SuggestionButton = memo(function SuggestionButton({
  text,
  onSend,
}: {
  text: string;
  onSend: (text: string) => void;
}) {
  const handleClick = useCallback(() => onSend(text), [onSend, text]);
  return (
    <button
      onClick={handleClick}
      className="w-full text-start px-3 py-2.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors border border-border/50"
    >
      {text}
    </button>
  );
});

export function AIChatPanel() {
  const t = useTranslations("ai");

  const locale = useSettingsStore((s) => s.locale);
  const isRTL = locale === "fa";

  const panelVariants = isRTL ? panelVariantsLTR : panelVariantsRTL;
  const positionClass = isRTL ? POSITION_LTR : POSITION_RTL;

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
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = `${MIN_HEIGHT}px`;
    const newHeight = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setInput("");
      addMessage("user", text);
      setIsLoading(true);

      const assistantId = useChatStore.getState().addMessage("assistant", "");
      updateMessage(assistantId, "", true);

      const history = useChatStore
        .getState()
        .messages.filter((m) => !m.isLoading && m.content.trim().length > 0)
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          updateMessage(assistantId, accumulated, false);
        }

        const tail = decoder.decode();
        if (tail) updateMessage(assistantId, accumulated + tail, false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        updateMessage(assistantId, t("errorMessage"), false);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
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

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    setIsOpen(false);
  }, [setIsOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setInput(e.target.value);

  const handleSend = useCallback(
    () => sendMessage(input),
    [sendMessage, input],
  );

  const suggestions = SUGGESTION_KEYS.map((key) => t(key));

  const inputDir = useMemo(
    () => (input.trim() ? getTextDirection(input) : isRTL ? "rtl" : "ltr"),
    [input, isRTL],
  );

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
          className={cn(
            "fixed top-0 h-full w-96 bg-card flex flex-col shadow-2xl z-50",
            positionClass,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">{t("title")}</h2>
                <p className="text-xs text-muted-foreground">
                  {t("poweredBy")}
                </p>
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
                  <p className="text-xs text-muted-foreground">
                    {t("subtitle")}
                  </p>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <SuggestionButton key={s} text={s} onSend={sendMessage} />
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isLoading={msg.isLoading && msg.content.length === 0}
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
                  "flex-1 bg-transparent text-xs resize-none outline-none text-foreground placeholder:text-muted-foreground overflow-hidden transition-[height] duration-100",
                  isRTL && "font-[Vazirmatn,sans-serif]",
                )}
                style={{ lineHeight: "1.5", minHeight: `${MIN_HEIGHT}px` }}
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
