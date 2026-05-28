"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Settings, Leaf, Search } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const showNavbar = pathname.startsWith("/store") || pathname.startsWith("/cart");
  
  if (!showNavbar) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      router.push(`/store?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push(`/store`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
            <Leaf size={18} className="rotate-12 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            AgriBot
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search products..."
              className="w-full bg-surface border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          </form>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/store" className="text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:block">
            Store
          </Link>
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-foreground group">
            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm animate-in fade-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/settings" className="p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-foreground group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
