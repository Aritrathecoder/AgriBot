import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import GeminiChatWidget from "@/components/GeminiChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriBot — AI Agricultural Advisor for Indian Farmers",
  description:
    "Get expert farming advice, crop details, pest solutions, and product recommendations powered by AI. Designed for farmers in West Bengal and Eastern India.",
  keywords: [
    "agriculture",
    "farming",
    "chatbot",
    "crop advisor",
    "pest control",
    "West Bengal",
    "India",
    "AgriBot",
  ],
  openGraph: {
    title: "AgriBot — Smart Farming Advisor",
    description:
      "AI-powered agricultural chatbot for Indian farmers. Get instant crop advice, pest solutions & product suggestions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/images/agribot-avatar.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#2d6a2e" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <GeminiChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
