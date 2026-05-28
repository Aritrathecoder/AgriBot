"use client";

import Link from "next/link";
import Image from "next/image";
import { agribotsProducts } from "@/data/products";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HeroCarousel from "@/components/HeroCarousel";
import HotDeals from "@/components/HotDeals";

function StoreContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const searchQuery = searchParams.get("q") || "";

  // Filter products based on search query
  const displayProducts = agribotsProducts.filter(
    (p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Prevent navigating to product detail
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="w-full">
      {!searchQuery && (
        <>
          <HeroCarousel />
          <HotDeals />
        </>
      )}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {searchQuery ? (
            <>Search Results for <span className="text-primary">"{searchQuery}"</span></>
          ) : (
            <>AgriBot <span className="text-primary">Store</span></>
          )}
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          {searchQuery ? `Found ${displayProducts.length} products matching your search.` : `Premium quality agricultural products trusted by farmers. Fast delivery and cash on delivery available.`}
        </p>
      </div>

      {displayProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted mb-4">No products found matching "{searchQuery}".</p>
          <Link href="/store" className="text-primary font-semibold hover:underline">
            Clear Search
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
          <Link
            href={`/store/${product.id}`}
            key={product.id}
            className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative aspect-square bg-white w-full overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider">
                {product.category}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1 mb-2 text-yellow-500">
                <Star size={12} className="fill-current" />
                <span className="text-xs font-semibold">{product.rating}</span>
                <span className="text-muted text-xs ml-1">({product.reviews.length})</span>
              </div>

              <h2 className="font-bold text-base text-foreground mb-1 line-clamp-2 leading-tight">
                {product.name}
              </h2>
              
              <div className="flex items-end gap-2 mt-auto pt-4">
                <span className="text-lg font-bold text-primary">₹{product.price}</span>
                <span className="text-xs text-muted line-through mb-1">₹{product.originalPrice}</span>
              </div>

              <button
                onClick={(e) => handleAddToCart(e, product)}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  addedItems[product.id]
                    ? "bg-green-500 text-white"
                    : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                }`}
              >
                <ShoppingCart size={16} />
                {addedItems[product.id] ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </Link>
        ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Loading store...</div>}>
      <StoreContent />
    </Suspense>
  );
}
