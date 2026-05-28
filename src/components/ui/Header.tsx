"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, LogOut, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

interface HeaderProps {
  language?: "en" | "hi";
  onLanguageChange?: (lang: "en" | "hi") => void;
  location?: string | null;
  hideLanguageSelector?: boolean;
}

export default function Header({ language = "en", onLanguageChange, location, hideLanguageSelector }: HeaderProps) {
  const pathname = usePathname();
  const isChat = pathname === "/chat";
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header
      className="sticky top-0 z-50 glass-card border-b border-border/50 rounded-none"
      id="app-header"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {isChat && (
            <Link
              href="/"
              id="back-btn"
              className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center
                         hover:bg-primary/10 transition-colors border border-border"
            >
              <ArrowLeft size={16} className="text-foreground" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shadow-sm">
              <Image
                src="/images/agribot-avatar.png"
                alt="AgriBot"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground leading-tight">
                  AgriBot
                </h1>
                {/* Location Badge on the Left Side as requested */}
                {location && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-bold border border-primary/20">
                    <MapPin size={9} />
                    {location}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-primary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {language === "hi" ? "AI Krishi Salahkar" : "AI Agricultural Advisor"}
              </p>
            </div>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          {!hideLanguageSelector && (
            <div className="flex items-center bg-surface-elevated border border-border rounded-full p-0.5">
              <button
                onClick={() => onLanguageChange?.("en")}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                  language === "en"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange?.("hi")}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                  language === "hi"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
            </div>
          )}

          {/* User Auth Info */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
              <span className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-light text-white text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer border border-border hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.displayName || user.email || "U")
                )}
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-2xl shadow-xl py-2 z-20 animate-fade-up">
                    <div className="px-4 py-2 border-b border-border/50">
                      <p className="text-xs font-bold text-foreground truncate">
                        {user.displayName || "Farmer"}
                      </p>
                      <p className="text-[10px] text-muted truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut size={14} />
                      {language === "hi" ? "लॉग आउट" : "Sign Out"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href={`/auth?redirect=${encodeURIComponent(pathname)}`}
              className="px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold flex items-center gap-1 active:scale-95 shadow-sm hover:shadow"
            >
              <LogIn size={13} />
              {language === "hi" ? "लॉग इन" : "Sign In"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
