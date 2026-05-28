"use client";

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({
  replies,
  onSelect,
  disabled = false,
}: QuickRepliesProps) {
  if (!replies || replies.length === 0) return null;

  return (
    <div
      className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1 animate-fade-up"
      id="quick-replies-container"
    >
      {replies.map((reply, index) => (
        <button
          key={index}
          id={`quick-reply-${index}`}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium
                     bg-surface border border-border text-foreground
                     hover:bg-primary hover:text-white hover:border-primary
                     active:scale-95 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm hover:shadow-md"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
