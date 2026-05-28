"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { agribotsProducts } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { Star, ShoppingBag, ShoppingCart, ArrowLeft, CheckCircle2, ShieldCheck, Truck, Leaf, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const product = agribotsProducts.find((p) => p.id === resolvedParams.id);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/store" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-border bg-white shadow-lg">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                  activeImage === idx ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} className="fill-current" />
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-muted text-xs ml-1">({product.reviews.length} reviews)</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              {product.stock <= 10 ? (
                <div className="text-orange-500 text-sm font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> Only {product.stock} left in stock - order soon.
                </div>
              ) : (
                <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 size={14} /> In Stock
                </div>
              )}
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-black text-primary">₹{product.price}</span>
              <span className="text-lg text-muted line-through mb-1">₹{product.originalPrice}</span>
              <span className="text-sm font-semibold text-green-500 mb-1.5 ml-2 bg-green-500/10 px-2 py-0.5 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          </div>

          <p className="text-muted text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="bg-surface border border-border rounded-2xl p-5 mb-8">
            <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-surface text-foreground transition-colors"
                >-</button>
                <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-surface text-foreground transition-colors"
                >+</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 ${
                added 
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                  : "bg-surface border-2 border-primary text-primary hover:bg-primary/5"
              }`}
            >
              <ShoppingCart size={18} />
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingBag size={18} />
              Buy Now
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Secure Payments</h4>
                <p className="text-[10px] text-muted">Razorpay & Google Pay</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Fast Delivery</h4>
                <p className="text-[10px] text-muted">Tracked via Amazon/Flipkart</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Details Sections */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Star size={20} className="text-primary" /> Key Features
          </h3>
          <ul className="space-y-3">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-muted">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Leaf size={20} className="text-primary" /> How to Use
          </h3>
          <ol className="space-y-4">
            {product.usageInstructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-muted">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Related / Suggested Products */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Customers also viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agribotsProducts
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link
                href={`/store/${relatedProduct.id}`}
                key={relatedProduct.id}
                className="group flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-square w-full bg-white">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    <Star size={12} className="fill-current" />
                    <span className="text-xs font-bold">{relatedProduct.rating}</span>
                  </div>
                  <div className="mt-auto">
                    <span className="text-lg font-bold text-primary">₹{relatedProduct.price}</span>
                    <span className="text-xs text-muted line-through ml-2">₹{relatedProduct.originalPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
