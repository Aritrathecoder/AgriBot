"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Bell, Shield, MapPin, Package, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading || !user) {
    return <div className="p-20 text-center text-muted">Loading your profile...</div>;
  }

  // Derive first and last name from displayName if possible
  const nameParts = (user.displayName || "User").split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <div className="p-5 bg-surface border border-border rounded-3xl mb-6 text-center">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
              <User size={32} />
            </div>
            <h2 className="font-bold text-lg text-foreground truncate mx-2">{user.displayName || "Guest User"}</h2>
            <div className="w-full overflow-x-auto custom-scrollbar pb-1 mb-3 px-2">
              <p className="text-xs text-muted whitespace-nowrap">{user.phoneNumber || user.email || "No contact info"}</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">
              Verified Farmer
            </span>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
            <button className="flex items-center justify-between p-4 border-b border-border hover:bg-background transition-colors text-left group">
              <div className="flex items-center gap-3">
                <User size={18} className="text-muted group-hover:text-primary" />
                <span className="font-semibold text-sm">Personal Info</span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
            <Link href="/orders" className="flex items-center justify-between p-4 border-b border-border hover:bg-background transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-muted group-hover:text-primary" />
                <span className="font-semibold text-sm">My Orders & Tracking</span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </Link>
            <button className="flex items-center justify-between p-4 border-b border-border hover:bg-background transition-colors text-left group">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-muted group-hover:text-primary" />
                <span className="font-semibold text-sm">Addresses</span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
            <button className="flex items-center justify-between p-4 hover:bg-background transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-muted group-hover:text-primary" />
                <span className="font-semibold text-sm">Privacy & Security</span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Personal Information</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">First Name</label>
                  <input type="text" defaultValue={firstName} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">Last Name</label>
                  <input type="text" defaultValue={lastName} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-muted mb-2">Phone Number</label>
                <input type="tel" defaultValue={user.phoneNumber || ""} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-2">Email (Optional)</label>
                <input type="email" defaultValue={user.email || ""} placeholder="No email associated" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <button type="button" onClick={handleSignOut} className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
                <button type="button" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
