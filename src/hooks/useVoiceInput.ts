"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

// Add types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceInput(language: "en" | "hi" = "hi") {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: "",
    error: null,
    isSupported: false,
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setState((prev) => ({ ...prev, isSupported: true }));
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setState((prev) => ({ ...prev, transcript }));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMsg = "Voice input error";
        if (event.error === "not-allowed") {
          errorMsg = "Microphone access denied. Please allow microphone access.";
        } else if (event.error === "no-speech") {
          errorMsg = "No speech detected. Please try again.";
        }
        setState((prev) => ({
          ...prev,
          isListening: false,
          error: errorMsg,
        }));
      };

      recognition.onend = () => {
        setState((prev) => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Sync language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-IN";
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setState((prev) => ({
        ...prev,
        isListening: true,
        transcript: "",
        error: null,
      }));
      try {
        recognitionRef.current.start();
      } catch {
        // Already started
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState((prev) => ({ ...prev, isListening: false }));
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
  };
}
