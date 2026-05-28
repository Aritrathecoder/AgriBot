"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Mic, MicOff, Square, ImagePlus, X } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, images?: string[]) => void;
  isLoading: boolean;
  placeholder?: string;
  language?: "en" | "hi";
}

export default function ChatInput({
  input = "",
  onInputChange,
  onSubmit,
  isLoading,
  placeholder = "Type your message...",
  language = "en",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isListening, transcript, isSupported, toggleListening, error } =
    useVoiceInput(language);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  // When voice transcript updates, fill input
  useEffect(() => {
    if (transcript) {
      onInputChange(transcript);
    }
  }, [transcript, onInputChange]);

  // Show voice error briefly
  useEffect(() => {
    if (error) {
      setShowVoiceError(true);
      const timer = setTimeout(() => setShowVoiceError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (((input || "").trim() || selectedImage) && !isLoading) {
        const form = e.currentTarget.closest("form");
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading && ((input || "").trim() || selectedImage)) {
      const images = selectedImage ? [selectedImage] : undefined;
      onSubmit(e, images);
      removeImage();
    }
  };

  return (
    <div className="relative" id="chat-input-container">
      {/* Voice error toast */}
      {showVoiceError && (
        <div className="absolute -top-12 left-0 right-0 mx-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-xs text-center animate-fade-up">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {selectedImage && (
        <div className="absolute -top-24 left-4 p-1 bg-surface border border-border rounded-xl shadow-lg z-10 animate-fade-up">
          <div className="relative">
            <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 sm:p-4">
        {/* Image upload button */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageSelect}
          className="hidden" 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-surface-elevated text-muted hover:text-primary hover:bg-primary/10 border border-border"
          title="Upload image"
        >
          <ImagePlus size={18} />
        </button>

        {/* Voice input button */}
        {isSupported && (
          <button
            type="button"
            id="voice-input-btn"
            onClick={toggleListening}
            className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isListening
                ? "bg-red-500 text-white voice-pulse"
                : "bg-surface-elevated text-muted hover:text-primary hover:bg-primary/10 border border-border"
            }`}
            title={
              isListening 
                ? (language === "hi" ? "रिकॉर्डिंग रोकें" : "Stop recording") 
                : (language === "hi" ? "आवाज़ से लिखें" : "Voice input")
            }
          >
            {isListening ? <Square size={16} /> : <Mic size={16} />}
          </button>
        )}

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            id="chat-text-input"
            value={input || ""}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening 
                ? (language === "hi" ? "🎙️ सुन रहा हूँ..." : "🎙️ Listening...") 
                : placeholder
            }
            rows={1}
            disabled={isLoading}
            className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm
                       placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all duration-200 max-h-[120px]"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          id="send-message-btn"
          disabled={!((input || "").trim() || selectedImage) || isLoading}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center
                     hover:bg-primary-dark active:scale-95 transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary
                     shadow-md hover:shadow-lg"
        >
          <Send size={16} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
}
