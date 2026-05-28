"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-up" id="typing-indicator">
      {/* Bot avatar */}
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <span className="text-sm">🌾</span>
      </div>
      {/* Typing bubble */}
      <div className="bg-bot-bubble text-bot-bubble-text rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm border border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
        </div>
      </div>
    </div>
  );
}
