"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { ArrowLeft, CreditCard, Banknote, ShieldCheck, CheckCircle2, QrCode, Scan, Coins, MapPin } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const getNumericPrice = (p: any): number => {
  if (!p) return 0;
  if (typeof p.price === "number") return p.price;
  if (typeof p.price === "string") {
    return parseFloat(p.price.replace(/[^\d.]/g, "")) || 0;
  }
  return 0;
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "DENO">("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [markerPos, setMarkerPos] = useState({ lat: 22.5726, lng: 88.3639 }); // Default Bhātpāra
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerStep, setScannerStep] = useState(0);
  const [txHash, setTxHash] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD2B32chOJ0bMFBZ67fl_iHtkwMtUpDhV0",
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPos({ lat, lng });
          updateAddressFromCoords(lat, lng);
        },
        (error) => {
          console.error("Error detecting location:", error);
        }
      );
    }
  };

  const updateAddressFromCoords = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      address: `Delivery Route: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)} | Bhātpāra Rural Sector, West Bengal`,
      pincode: "743123",
    }));
  };

  const handleOnlinePayment = () => {
    setIsProcessing(true);
    const options = {
      key: "rzp_test_mock_key",
      amount: (cartTotal + 100) * 100, // in paise, including ₹100 delivery
      currency: "INR",
      name: "AgriBot Store",
      description: "Agricultural Products",
      image: "https://your-logo-url.com/logo.png",
      handler: function (response: any) {
        completeOrder("PAID_ONLINE", response.razorpay_payment_id);
      },
      prefill: {
        name: form.name,
        contact: form.phone,
      },
      theme: {
        color: "#2d6a2e",
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setTimeout(() => {
        completeOrder("PAID_ONLINE", "mock_pay_id_" + Math.random().toString(36).substr(2, 9));
      }, 1500);
    }
  };

  const runScannerSimulation = () => {
    setScannerStep(1);
    
    // Simulate steps sequentially
    setTimeout(() => {
      setScannerStep(2);
      setTimeout(() => {
        setScannerStep(3);
        setTimeout(() => {
          setScannerStep(4);
          setTimeout(() => {
            setScannerStep(5);
            const mockTx = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("");
            setTxHash(mockTx);
            setTimeout(() => {
              setIsScannerOpen(false);
              setScannerStep(0);
              completeOrder("Deno Token (DENO)", mockTx);
            }, 1500);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "ONLINE") {
      handleOnlinePayment();
    } else if (paymentMethod === "DENO") {
      setIsScannerOpen(true);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        completeOrder("COD", "N/A");
      }, 1000);
    }
  };

  const completeOrder = (status: string, paymentId: string) => {
    const newOrder = {
      id: "ORD" + Math.floor(Math.random() * 1000000),
      items: cartItems,
      total: cartTotal + 100, // Including ₹100 delivery charge
      status: "Processing",
      paymentMethod,
      paymentId,
      date: new Date().toISOString(),
      address: form
    };
    
    const existingOrders = JSON.parse(localStorage.getItem("agribot_orders") || "[]");
    localStorage.setItem("agribot_orders", JSON.stringify([newOrder, ...existingOrders]));
    
    clearCart();
    setIsProcessing(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center max-w-md text-center">
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted mb-8">Thank you for your purchase. You can track your delivery in the orders section.</p>
        <Link
          href="/orders"
          className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Track Order
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !success) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* CSS Animation Keyframes for the scanner laser */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      <Link href="/cart" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Checkout</h2>
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="bg-surface border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Shipping Details</h3>
              
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Full Name</label>
                <input required type="text" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Phone Number</label>
                <input required type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Delivery Address</label>
                <textarea required value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
              </div>

              {/* Map Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" /> Pin Your Location on Map (For accurate delivery route)
                </label>
                {loadError ? (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs">
                    Failed to load map delivery route assistant.
                  </div>
                ) : !isLoaded ? (
                  <div className="h-48 bg-muted animate-pulse rounded-xl flex items-center justify-center text-xs text-muted">
                    Loading Route Map...
                  </div>
                ) : (
                  <div className="h-48 rounded-xl overflow-hidden relative border border-border shadow-inner">
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={markerPos}
                      zoom={14}
                      onClick={(e) => {
                        if (e.latLng) {
                          const lat = e.latLng.lat();
                          const lng = e.latLng.lng();
                          setMarkerPos({ lat, lng });
                          updateAddressFromCoords(lat, lng);
                        }
                      }}
                      options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      <Marker
                        position={markerPos}
                        draggable={true}
                        onDragEnd={(e) => {
                          if (e.latLng) {
                            const lat = e.latLng.lat();
                            const lng = e.latLng.lng();
                            setMarkerPos({ lat, lng });
                            updateAddressFromCoords(lat, lng);
                          }
                        }}
                      />
                    </GoogleMap>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="absolute bottom-2 right-2 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors"
                    >
                      Detect Location
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">PIN Code</label>
                <input required type="text" value={form.pincode} onChange={(e)=>setForm({...form, pincode: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
              </div>
            </div>

            <div className="bg-surface border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Payment Method</h3>
              
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="w-4 h-4 text-primary bg-background border-border" />
                    <div>
                      <p className="font-bold text-sm text-foreground">Online Payment / UPI</p>
                      <p className="text-[10px] text-muted">Razorpay, Google Pay, Cards</p>
                    </div>
                  </div>
                  <CreditCard className={paymentMethod === 'ONLINE' ? 'text-primary' : 'text-muted'} size={24} />
                </label>

                {/* Deno Token Method */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'DENO' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="DENO" checked={paymentMethod === 'DENO'} onChange={() => setPaymentMethod('DENO')} className="w-4 h-4 text-primary bg-background border-border" />
                    <div>
                      <p className="font-bold text-sm text-foreground">Deno Token (DENO)</p>
                      <p className="text-[10px] text-muted">Pay using secure blockchain utility tokens</p>
                    </div>
                  </div>
                  <Coins className={paymentMethod === 'DENO' ? 'text-primary' : 'text-muted'} size={24} />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4 text-primary bg-background border-border" />
                    <div>
                      <p className="font-bold text-sm text-foreground">Cash on Delivery</p>
                      <p className="text-[10px] text-muted">Pay when order arrives</p>
                    </div>
                  </div>
                  <Banknote className={paymentMethod === 'COD' ? 'text-primary' : 'text-muted'} size={24} />
                </label>
              </div>
            </div>

            {paymentMethod === "DENO" && (
              <div className="bg-surface border border-border p-5 rounded-2xl space-y-4">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Deno Token Payment</h3>
                <div className="bg-background border border-border p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Conversion Rate</span>
                    <span className="font-semibold text-foreground">1 DENO = ₹10</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Token Amount to Pay</span>
                    <span className="font-bold text-primary">{((cartTotal + 100) / 10).toFixed(2)} DENO</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 text-center space-y-3">
                    <p className="text-[10px] text-muted">Scan QR below with your Deno Wallet app or click the button below to simulate scanning token submission.</p>
                    
                    <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                        <path fill="currentColor" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                        <path fill="currentColor" d="M35,5 h10 v10 h-10 z M50,5 h10 v5 h-10 z M35,20 h5 v5 h-5 z M50,20 h10 v10 h-10 z M5,35 h10 v5 h-10 z M20,35 h10 v10 h-10 z M5,50 h5 v10 h-5 z M20,50 h10 v5 h-10 z" />
                        <path fill="currentColor" d="M70,35 h10 v10 h-10 z M85,35 h10 v5 h-10 z M70,50 h5 v10 h-5 z M80,50 h10 v5 h-10 z" />
                        <path fill="currentColor" d="M35,70 h10 v5 h-10 z M50,70 h10 v10 h-10 z M35,85 h5 v5 h-5 z M50,85 h10 v5 h-10 z" />
                        <path fill="currentColor" d="M65,65 h5 v5 h-5 z M75,65 h10 v10 h-10 z M65,80 h15 v5 h-15 z M85,80 h10 v15 h-10 z" />
                      </svg>
                    </div>
                    <p className="text-[11px] font-mono text-muted bg-background/50 py-1.5 px-3 rounded-lg border border-border inline-block break-all max-w-full">
                      0xdeno_store_pay_address_f48a920b7c12
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-3 px-4 rounded-xl border border-primary/20 flex items-center justify-center gap-2 transition-all"
                      >
                        <Scan size={16} /> Scan & Submit Token Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div>
          <div className="bg-surface border border-border rounded-3xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => {
                const imgSrc = item.product.images?.[0] || item.product.image;
                return (
                  <div key={item.product.id} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <div className="relative w-12 h-12 rounded bg-white overflow-hidden flex-shrink-0">
                        {imgSrc ? (
                          <Image src={imgSrc} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-xs">🌾</div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground line-clamp-2">{item.product.name}</p>
                        <p className="text-[10px] text-muted">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-foreground">
                      {paymentMethod === "DENO" 
                        ? `${(getNumericPrice(item.product) * item.quantity / 10).toFixed(1)} DENO` 
                        : typeof item.product.price === "number" ? `₹${item.product.price * item.quantity}` : item.product.price}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 mb-6 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {paymentMethod === "DENO" ? `${(cartTotal / 10).toFixed(2)} DENO` : `₹${cartTotal}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping/Delivery Charge</span>
                <span className="font-semibold text-foreground">
                  {paymentMethod === "DENO" ? "10.00 DENO" : "₹100"}
                </span>
              </div>
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-foreground">Total to Pay</span>
                <span className="font-black text-2xl text-primary">
                  {paymentMethod === "DENO" ? `${((cartTotal + 100) / 10).toFixed(2)} DENO` : `₹${cartTotal + 100}`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all duration-300"
            >
              {isProcessing ? "Processing..." : paymentMethod === "ONLINE" ? "Pay Securely" : paymentMethod === "DENO" ? "Confirm & Scan QR" : "Place Order"}
            </button>
            <p className="text-center text-[10px] text-muted flex items-center justify-center gap-1 mt-3">
              <ShieldCheck size={12} /> Secure encrypted checkout
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Simulator Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-foreground text-center mb-1">Deno Token QR Scanner</h3>
            <p className="text-[10px] text-muted text-center mb-6">Device Camera Simulation — Submitting Token</p>
            
            {scannerStep === 0 && (
              <div className="space-y-6 flex flex-col items-center">
                <div className="relative w-64 h-64 border-2 border-primary/30 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                  {/* Pulsing Scan Laser */}
                  <div className="absolute inset-x-0 h-0.5 bg-primary animate-[scan_2s_infinite] shadow-lg shadow-primary" style={{ animation: "scan 2s linear infinite" }}></div>
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                  
                  <QrCode size={48} className="text-primary/30 animate-pulse" />
                </div>
                
                <button
                  type="button"
                  onClick={runScannerSimulation}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                >
                  Start Simulated Scan
                </button>
              </div>
            )}

            {scannerStep > 0 && (
              <div className="space-y-6 py-6 text-center">
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-foreground">
                    {scannerStep === 1 && "Reading QR Payload..."}
                    {scannerStep === 2 && "Connecting to Deno Blockchain..."}
                    {scannerStep === 3 && "Verifying Gas & Signatures..."}
                    {scannerStep === 4 && `Transferring ${((cartTotal + 100) / 10).toFixed(2)} DENO...`}
                    {scannerStep === 5 && "On-Chain Payment Confirmed!"}
                  </p>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${(scannerStep / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                {scannerStep === 5 && (
                  <p className="text-[10px] text-muted font-mono break-all px-4 bg-background/50 py-2 rounded-lg border border-border">
                    TX Hash: {txHash}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsScannerOpen(false);
                setScannerStep(0);
              }}
              disabled={scannerStep > 0 && scannerStep < 5}
              className="absolute top-4 right-4 text-muted hover:text-foreground text-sm p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
