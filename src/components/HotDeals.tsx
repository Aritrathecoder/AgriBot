"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { agribotsProducts } from "@/data/products";
import { Flame, Clock, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function HotDeals() {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products with low stock for hot deals
  const hotDeals = agribotsProducts.filter((p) => p.stock > 0 && p.stock <= 15).sort((a, b) => a.stock - b.stock);

  if (hotDeals.length < 2) return null; // Fallback if not enough low stock items

  useEffect(() => {
    // Randomize deals on mount to avoid hydration errors
    const randomStart = Math.floor(Math.random() * (hotDeals.length / 2)) * 2;
    setCurrentIndex(randomStart);
  }, [hotDeals.length]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Get current 2 items
  const item1 = hotDeals[currentIndex];
  const item2 = hotDeals[(currentIndex + 1) % hotDeals.length];
  const displayItems = [item1, item2];

  return (
    <div className="w-full bg-orange-50 border-y border-orange-200 py-10 relative overflow-hidden">
      {/* Decorative background flame icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Flame size={400} />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white p-2 rounded-full animate-pulse">
              <Flame size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-red-600 uppercase tracking-tight">Flash Deals</h2>
              <p className="text-orange-700 text-sm font-semibold flex items-center gap-1">
                <Clock size={14} /> Limited Stock Remaining
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayItems.map((product) => (
            <Link
              key={product.id}
              href={`/store/${product.id}`}
              className="bg-white rounded-2xl border-2 border-orange-100 p-4 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:border-orange-300 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded shadow-md">
                  ONLY {product.stock} LEFT!
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col flex-grow justify-center py-2">
                <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
                  {product.category}
                </div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-3 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-2xl font-black text-red-600">₹{product.price}</span>
                  <span className="text-sm text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded ml-auto">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden">
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${(product.stock / 15) * 100}%` }}
                  ></div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`mt-auto w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    addedItems[product.id]
                      ? "bg-green-500 text-white"
                      : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {addedItems[product.id] ? "Added to Cart" : "Claim Deal Now"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
