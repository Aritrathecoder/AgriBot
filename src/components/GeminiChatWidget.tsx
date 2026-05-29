"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Leaf, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { getBaseUrl } from "@/lib/baseUrl";

export default function GeminiChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Namaste! I am AgriBot. Ask me about crops, fertilizers, pests, or our store products!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only show on Store and Pest Diagnosis (Product Suggestion) pages
  const isVisible = pathname?.startsWith("/store") || pathname?.startsWith("/pest-diagnosis");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isVisible) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();
      const botResponse = data.response || data.error || "I'm sorry, I couldn't understand that. Could you rephrase?";
      
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", content: "Network error connecting to AI. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-green-600 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background"></span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-2rem)] bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden z-50 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1">AgriBot Assistant <Sparkles size={12} className="text-amber-300" /></h3>
              <p className="text-[10px] text-white/80">Online & Ready to Help</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-background/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-surface border border-border text-foreground rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border text-foreground rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{animationDelay: "150ms"}}></span>
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{animationDelay: "300ms"}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-surface border-t border-border">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-background border border-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary text-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1.5 w-9 h-9 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Send size={14} className="-ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[9px] text-muted font-medium">Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </>
  );
}
