"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle2, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import ReportModal from "@/components/ReportModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reportOrder, setReportOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem("agribot_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setIsLoaded(true);
  }, []);

  const isCancellable = (orderDate: string) => {
    const elapsedMs = Date.now() - new Date(orderDate).getTime();
    return elapsedMs < 10 * 60 * 1000; // 10 minutes window
  };

  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: "Cancelled" };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("agribot_orders", JSON.stringify(updatedOrders));
  };

  if (!isLoaded) {
    return <div className="p-20 text-center text-muted">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center max-w-2xl text-center">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-muted mb-6">
          <Package size={48} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No Orders Yet</h2>
        <p className="text-muted mb-8">You haven't placed any orders with AgriBot Store yet.</p>
        <Link
          href="/store"
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300"
        >
          Browse Store
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order, index) => {
          // Simulate different states based on how long ago they ordered
          // Since it's mock data, we'll just fake it. The newest order is "Shipped".
          const step = index === 0 ? 2 : index === 1 ? 4 : 3; 

          return (
            <div key={order.id} className="bg-surface border border-border rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="bg-background border-b border-border p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-sm font-semibold text-foreground text-primary">
                      {order.paymentMethod === "DENO" ? `${(order.total / 10).toFixed(2)} DENO` : `₹${order.total}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Ship To</p>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">{order.address.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Method</p>
                    <p className="text-sm font-semibold text-foreground font-mono text-[11px] bg-background px-2 py-0.5 rounded border border-border">
                      {order.paymentMethod === "DENO" ? "Deno Token" : order.paymentMethod === "ONLINE" ? "Online" : "COD"}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Order ID</p>
                  <p className="text-sm font-semibold text-foreground">{order.id}</p>
                </div>
              </div>

              {/* Status Tracking */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  {order.status === "Cancelled" ? (
                    <><AlertTriangle className="text-red-500" /> Order Cancelled</>
                  ) : step === 4 ? (
                    <><CheckCircle2 className="text-green-500" /> Delivered Successfully</>
                  ) : step === 3 ? (
                    <><Truck className="text-orange-500" /> Out for Delivery</>
                  ) : (
                    <><Package className="text-blue-500" /> Arriving Soon</>
                  )}
                </h3>

                {order.status === "Cancelled" ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                    <p>
                      {order.paymentMethod === "COD"
                        ? "This order was cancelled successfully."
                        : "This order was cancelled successfully. A full refund has been initiated to your source payment method."}
                    </p>
                  </div>
                ) : (
                  /* Progress Bar (Amazon/Flipkart style) */
                  <div className="relative mb-10 mx-4">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${(step - 1) * 33.33}%` }}></div>
                    
                    <div className="relative flex justify-between">
                      {[
                        { icon: Clock, label: "Ordered", status: step >= 1 },
                        { icon: Package, label: "Packed", status: step >= 2 },
                        { icon: Truck, label: "Shipped", status: step >= 3 },
                        { icon: CheckCircle2, label: "Delivered", status: step >= 4 },
                      ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors ${s.status ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-background border-2 border-border text-muted'}`}>
                            <s.icon size={14} />
                          </div>
                        <span className={`text-[10px] font-bold uppercase mt-2 absolute top-10 ${s.status ? 'text-foreground' : 'text-muted'}`}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
                <div className="mt-12 space-y-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden border border-border">
                        {item.product.images?.[0] || item.product.image ? (
                          <Image src={item.product.images?.[0] || item.product.image} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-xs">🌾</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-muted mt-1">{item.product.description.substring(0, 80)}...</p>
                        <div className="flex gap-4 mt-2">
                          <button className="text-xs font-semibold text-primary hover:underline">Buy it again</button>
                          <Link href={`/store/${item.product.id}`} className="text-xs font-semibold text-muted hover:text-foreground">View item</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
                  {order.status !== "Cancelled" && isCancellable(order.date) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors border border-red-500/20 cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button 
                    onClick={() => setReportOrder(order)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs font-bold text-muted hover:text-foreground hover:bg-surface transition-colors"
                  >
                    <AlertTriangle size={14} /> Report Issue
                  </button>
                  {order.status !== "Cancelled" && (
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors">
                      Track via Courier <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reportOrder && (
        <ReportModal order={reportOrder} onClose={() => setReportOrder(null)} />
      )}
    </div>
  );
}
