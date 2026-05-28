"use client";

import { Star, ExternalLink } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  affiliateUrl: string;
  badge?: string | null;
  category: string;
}

export default function ProductCard({
  name,
  price,
  rating,
  reviews,
  description,
  affiliateUrl,
  badge,
  category,
}: ProductCardProps) {
  const categoryColors: Record<string, string> = {
    pesticide: "bg-red-500/10 text-red-600",
    herbicide: "bg-orange-500/10 text-orange-600",
    fungicide: "bg-purple-500/10 text-purple-600",
    fertilizer: "bg-green-500/10 text-green-700",
    organic: "bg-emerald-500/10 text-emerald-600",
    seeds: "bg-amber-500/10 text-amber-700",
    equipment: "bg-blue-500/10 text-blue-600",
  };

  const badgeColors: Record<string, string> = {
    "Best Seller": "bg-amber-500 text-white",
    Recommended: "bg-primary text-white",
    "Eco-Friendly": "bg-emerald-500 text-white",
  };

  return (
    <div
      className="flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl bg-surface border border-border
                 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden
                 hover:-translate-y-1 group"
    >
      {/* Top section with badge and category */}
      <div className="relative p-4 pb-2">
        {badge && (
          <span
            className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              badgeColors[badge] || "bg-gray-500 text-white"
            }`}
          >
            {badge}
          </span>
        )}
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
            categoryColors[category] || "bg-gray-100 text-gray-600"
          }`}
        >
          {category}
        </span>
      </div>

      {/* Product info */}
      <div className="px-4 pb-2">
        <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
          {name}
        </h4>
        <p className="text-xs text-muted mt-1 line-clamp-2">{description}</p>
      </div>

      {/* Rating */}
      <div className="px-4 flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              className={
                star <= Math.floor(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-xs text-muted">
          {rating} ({reviews.toLocaleString()})
        </span>
      </div>

      {/* Price and CTA */}
      <div className="p-4 pt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-primary">{price}</span>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                     bg-accent text-white hover:bg-accent-dark
                     active:scale-95 transition-all duration-200
                     shadow-sm hover:shadow-md"
        >
          Buy Now
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
