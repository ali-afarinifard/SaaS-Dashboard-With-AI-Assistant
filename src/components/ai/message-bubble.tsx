"use client";
import { memo } from "react";
import { Bot, User } from "lucide-react";
import { cn, getTextDirection } from "@/lib/utils";

// TypingIndicator
export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";


// MessageBubble
export interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export const MessageBubble = memo(function MessageBubble({
  role,
  content,
  isLoading,
}: MessageBubbleProps) {
  const dir = getTextDirection(content);
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          !isUser
            ? "bg-gradient-to-br from-primary to-accent"
            : "bg-secondary border border-border",
        )}
      >
        {!isUser ? (
          <Bot className="w-3 h-3 text-white" />
        ) : (
          <User className="w-3 h-3 text-muted-foreground" />
        )}
      </div>
      <div
        dir={dir}
        className={cn(
          "max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-foreground",
          dir === "rtl" && "text-right font-[Vazirmatn,sans-serif]",
        )}
      >
        {isLoading ? <TypingIndicator /> : content}
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";