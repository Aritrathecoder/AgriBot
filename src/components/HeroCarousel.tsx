"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { agribotsProducts } from "@/data/products";

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Pick 5 top products for the banner
  const bannerProducts = agribotsProducts.slice(0, 5);
  // Clone the first slide at the end to create an infinite loop effect
  const slides = [...bannerProducts, bannerProducts[0]];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds auto rotate

    return () => clearInterval(timer);
  }, [currentIndex]); // Reset timer on manual navigation

  useEffect(() => {
    if (currentIndex === bannerProducts.length) {
      // We've animated to the cloned first slide.
      // Wait for the animation to finish (700ms), then instantly snap back to the real first slide.
      const snapTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(snapTimer);
    }
  }, [currentIndex, bannerProducts.length]);

  const prevSlide = () => {
    if (currentIndex === 0) {
      // If at the beginning, instantly jump to the clone at the end, then animate backwards
      setIsTransitioning(false);
      setCurrentIndex(bannerProducts.length);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(bannerProducts.length - 1);
      }, 50);
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextSlide = () => {
    if (currentIndex === bannerProducts.length) return; // Prevent double click while on clone
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden bg-gradient-to-r from-blue-900 to-primary/90">
      {/* Slides */}
      <div 
        className={`flex h-full ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((product, index) => (
          <div key={`${product.id}-${index}`} className="min-w-full h-full relative flex items-center justify-center sm:justify-start px-12 md:px-24">
            {/* Background Image (Blurred/Decorative) */}
            <div className="absolute inset-0 opacity-20 z-0">
              <Image 
                src={product.images[0]} 
                alt="background" 
                fill 
                className="object-cover blur-md"
              />
            </div>
            
            <div className="z-10 flex flex-col sm:flex-row items-center w-full max-w-5xl mx-auto gap-8">
              {/* Promotional Text */}
              <div className="text-white flex-1 text-center sm:text-left drop-shadow-lg">
                <p className="text-sm md:text-base font-semibold uppercase tracking-widest text-emerald-300 mb-2">Featured {product.category}</p>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 line-clamp-2 leading-tight">
                  {product.name}
                </h2>
                <div className="text-lg md:text-2xl font-bold mb-6 flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-yellow-400 text-3xl">₹{product.price}</span>
                  <span className="text-sm line-through opacity-70">₹{product.originalPrice}</span>
                  <span className="text-xs font-bold text-white bg-green-500/80 px-2 py-1 rounded ml-2 shadow-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <Link 
                  href={`/store/${product.id}`}
                  className="inline-block bg-white text-primary px-8 py-3 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors shadow-xl"
                >
                  Shop Now
                </Link>
              </div>

              {/* Product Hero Image */}
              <div className="hidden sm:block relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors z-20"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors z-20"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2 z-20">
        {bannerProducts.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(idx);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              (currentIndex === idx || (currentIndex === bannerProducts.length && idx === 0))
                ? "bg-white w-8" 
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
