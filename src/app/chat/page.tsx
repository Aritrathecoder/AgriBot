"use client";

import { useEffect, useRef, useState, useCallback, FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import Header from "@/components/ui/Header";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import QuickReplies from "@/components/chat/QuickReplies";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ProductCarousel from "@/components/products/ProductCarousel";
import CropDetailPanel from "@/components/crops/CropDetailPanel";
import { parseResponse } from "@/lib/parseResponse";
import { INITIAL_MESSAGE, DEFAULT_QUICK_REPLIES } from "@/data/systemPrompt";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/baseUrl";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  affiliate_url: string;
  badge?: string | null;
}

interface CropData {
  id: string;
  name: string;
  hindi_name: string;
  emoji: string;
  description: string;
  soil: { type: string; ph: string };
  water: { needs: string; irrigation: string };
  seasons: { sowing: string; harvest: string; duration: string };
  growth_stages: { stage: string; duration: string; notes: string }[];
  common_pests: { name: string; hindi: string; symptoms: string; solution: string }[];
  fertilizers: { nitrogen: string; phosphorus: string; potash: string };
  yield: { average: string; potential: string };
  varieties: string[];
  tips: string[];
}

interface MessageEnrichments {
  products?: Product[];
  cropData?: CropData;
  quickReplies?: string[];
}

// Helper to extract text from UIMessage parts in this version of AI SDK
function getMessageText(message: any): string {
  if (message.content) return message.content;
  if (!message.parts) return "";
  return message.parts
    .filter((part: any) => part.type === "text")
    .map((part: any) => part.text)
    .join("");
}

const HINDI_GREETING = `👋 **नमस्ते! मैं हूँ एग्रीबॉट (AgriBot)** — आपका डिजिटल कृषि सलाहकार!
मैं आपकी इन चीज़ों में मदद कर सकता हूँ:
- 🐛 **कीट और रोग** की पहचान
- 🌱 **फसल विवरण** — बुवाई, कटाई, किस्में
- 💊 **समाधान** — उर्वरक, कीटनाशक, मात्रा
- 🛒 **उत्पाद सुझाव** — बीज, उपकरण, उर्वरक

आप किस फसल के बारे में जानना चाहते हैं? 👇`;

const HINDI_QUICK_REPLIES = [
  "चावल की खेती के टिप्स",
  "मेरी फसल में कीट की समस्या",
  "आलू की खेती की गाइड",
  "टमाटर के रोग",
];

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [enrichments, setEnrichments] = useState<Record<string, MessageEnrichments>>({});
  const [language, setLanguage] = useState<"en" | "hi">("hi");
  const [currentQuickReplies, setCurrentQuickReplies] = useState<string[]>(
    language === "hi" ? HINDI_QUICK_REPLIES : DEFAULT_QUICK_REPLIES
  );
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const { city: location, weather: weatherContext } = useGeolocation();
  
  // Redirect logged out users to login page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?redirect=/chat");
    }
  }, [user, loading, router]);
  
  // Manual input state (Required for this version of @ai-sdk/react)
  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming" | "error">("ready");

  const isLoading = status === 'submitted' || status === 'streaming';

  const sendMessage = async ({ text, images }: { text?: string, images?: string[] }) => {
    if ((!(text || "").trim() && (!images || images.length === 0)) || isLoading) return;
    
    setStatus("submitted");
    const parts: any[] = [];
    if ((text || "").trim()) parts.push({ type: "text", text });
    if (images && images.length > 0) {
      images.forEach(img => parts.push({ type: "image", image: img }));
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text || "",
      image: images?.[0], // Display the first image in the UI
      parts: parts
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const res = await fetch(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          language,
          location,
          weatherContext,
        }),
      });

      if (!res.ok) {
        let errorMsg = res.statusText;
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      if (!res.body) throw new Error("No body");

      setStatus("streaming");
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "", parts: [{ type: "text", text: "" }] }
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullContent = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          fullContent += chunkValue;
          
          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx].id === assistantMessageId) {
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: fullContent,
                parts: [{ type: "text", text: fullContent }]
              };
            }
            return updated;
          });
        }
      }
      
      setStatus("ready");
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage = language === "hi"
        ? `⚠️ त्रुटि: ${error.message || "AI से जवाब नहीं मिल सका। कृपया बाद में पुनः प्रयास करें।"}`
        : `⚠️ Error: ${error.message || "Could not get a response from AI. Please try again later."}`;
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: errorMessage, parts: [{ type: "text", text: errorMessage }] }
      ]);
      setStatus("ready");
    }
  };

  // Process completed messages when status becomes 'ready'
  useEffect(() => {
    if (status === 'ready' && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const content = getMessageText(lastMessage);
        if (content) {
          processMessage(lastMessage.id, content);
        }
      }
    }
  }, [status, messages]);

  // Update quick replies when language changes
  useEffect(() => {
    if (messages.length === 0) {
      setCurrentQuickReplies(language === "hi" ? HINDI_QUICK_REPLIES : DEFAULT_QUICK_REPLIES);
    }
  }, [language, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Process completed bot messages for embedded data
  const processMessage = useCallback(async (messageId: string, content: string) => {
    if (processedMessagesRef.current.has(messageId)) return;
    processedMessagesRef.current.add(messageId);

    const parsed = parseResponse(content);
    const newEnrichments: MessageEnrichments = {};

    if (parsed.products && parsed.products.length > 0) {
      try {
        const query = parsed.products[0].query;
        const res = await fetch(`${getBaseUrl()}/api/products?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const products = await res.json();
          if (products.length > 0) newEnrichments.products = products;
        }
      } catch {}
    }

    if (parsed.cropDetail) {
      try {
        const res = await fetch(`${getBaseUrl()}/api/crops?id=${encodeURIComponent(parsed.cropDetail[0].crop)}`);
        if (res.ok) {
          const cropData = await res.json();
          if (cropData && !cropData.error) newEnrichments.cropData = cropData;
        }
      } catch {}
    }

    if (parsed.quickReplies && parsed.quickReplies.length > 0) {
      newEnrichments.quickReplies = parsed.quickReplies;
      setCurrentQuickReplies(parsed.quickReplies);
    }

    if (Object.keys(newEnrichments).length > 0) {
      setEnrichments((prev) => ({ ...prev, [messageId]: newEnrichments }));
    }
  }, []);

  const handleQuickReply = (reply: string) => {
    sendMessage({ text: reply });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>, images?: string[]) => {
    e.preventDefault();
    if (((inputValue || "").trim() || (images && images.length > 0)) && !isLoading) {
      sendMessage({ text: inputValue, images });
      setInputValue("");
    }
  };

  const getDisplayContent = (message: any) => {
    const text = getMessageText(message);
    return parseResponse(text).textContent;
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1a0d] text-white gap-3">
        <Loader2 size={36} className="animate-spin text-primary-light" />
        <p className="text-sm text-emerald-100/60 font-medium">
          Loading your farming assistant...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" id="chat-page">
      <Header 
        language={language} 
        onLanguageChange={setLanguage} 
        location={location}
        hideLanguageSelector={messages.length > 0}
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4"
        id="messages-container"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <MessageBubble
            role="assistant"
            content={language === "hi" ? HINDI_GREETING : INITIAL_MESSAGE}
            timestamp={new Date()}
          />

          {messages.map((message) => (
            <div key={message.id}>
              <MessageBubble
                role={message.role as "user" | "assistant"}
                content={getDisplayContent(message)}
                image={message.image}
                timestamp={undefined}
              />

              {enrichments[message.id]?.cropData && (
                <div className="ml-10 mt-2">
                  <CropDetailPanel crop={enrichments[message.id].cropData!} />
                </div>
              )}
              {enrichments[message.id]?.products && (
                <div className="ml-10 mt-2">
                  <ProductCarousel products={enrichments[message.id].products!} />
                </div>
              )}
            </div>
          ))}

          {isLoading && <TypingIndicator />}
        </div>
      </div>

      <div className="border-t border-border bg-surface/80 backdrop-blur-sm" id="chat-bottom-bar">
        <div className="max-w-2xl mx-auto">
          <div className="px-3 pt-3">
            <QuickReplies
              replies={currentQuickReplies}
              onSelect={handleQuickReply}
              disabled={isLoading}
            />
          </div>

          <ChatInput
            input={inputValue}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
            isLoading={isLoading}
            placeholder={language === "hi" ? "अपना सवाल पूछें..." : "Type your message..."}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
