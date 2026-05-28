"use client";

import { useEffect, useState } from "react";
import { renderMarkdown } from "@/lib/parseResponse";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp?: Date;
}

export default function MessageBubble({ role, content, image, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} ${
        isUser ? "animate-slide-right" : "animate-slide-left"
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mb-1">
          <span className="text-sm">🌾</span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 shadow-sm ${
          isUser
            ? "bg-user-bubble text-user-bubble-text rounded-2xl rounded-br-sm"
            : "bg-bot-bubble text-bot-bubble-text rounded-2xl rounded-bl-sm border border-border"
        }`}
      >
        {isUser ? (
          <div className="flex flex-col gap-2">
            {image && (
              <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-xl object-cover" />
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>
        ) : (
          <div
            className="text-sm leading-relaxed prose-sm [&_strong]:font-semibold [&_h2]:text-base [&_h3]:text-sm [&_ul]:my-1 [&_li]:my-0.5"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}

        {/* Timestamp - Only render on client to avoid hydration mismatch */}
        {mounted && timestamp && (
          <p
            className={`text-[10px] mt-1.5 ${
              isUser ? "text-white/60" : "text-muted"
            }`}
          >
            {timestamp.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
