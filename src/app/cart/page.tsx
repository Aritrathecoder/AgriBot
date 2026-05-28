"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center max-w-2xl text-center">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-muted mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
        <p className="text-muted mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link
          href="/store"
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-primary/20"
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const imgSrc = item.product.images?.[0] || item.product.image;
            return (
              <div key={item.product.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-surface border border-border rounded-2xl">
                <Link href={`/store/${item.product.id}`} className="block relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-white flex-shrink-0">
                  {imgSrc ? (
                    <Image src={imgSrc} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-xs">🌾</div>
                  )}
                </Link>
              
              <div className="flex flex-col flex-grow justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">
                      {item.product.category}
                    </span>
                    <Link href={`/store/${item.product.id}`} className="font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                  </div>
                  <span className="font-black text-lg text-foreground whitespace-nowrap">
                    {typeof item.product.price === "number" ? `₹${item.product.price}` : item.product.price}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-surface text-foreground font-bold transition-colors"
                    >-</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-surface text-foreground font-bold transition-colors"
                    >+</button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-3xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold text-foreground">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>
              <div className="border-t border-border pt-3 mt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-black text-xl text-primary">₹{cartTotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            
            <Link
              href="/store"
              className="w-full mt-3 block text-center text-sm text-muted hover:text-foreground font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
