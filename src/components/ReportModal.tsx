"use client";

import { useState } from "react";
import { User, Bell, Shield, MapPin, X, UploadCloud, AlertCircle } from "lucide-react";

export default function ReportModal({ order, onClose }: { order: any, onClose: () => void }) {
  const [issueType, setIssueType] = useState("damaged");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-border bg-background">
          <h2 className="text-xl font-bold text-foreground">Report an Issue</h2>
          <button onClick={onClose} className="p-2 bg-surface hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Report Submitted</h3>
              <p className="text-muted text-sm">Our support team will review your report for Order #{order.id} and get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl mb-6">
                <p className="text-xs text-primary font-bold">Reporting for Order: {order.id}</p>
                <p className="text-[10px] text-muted truncate">{order.items.map((i:any) => i.product.name).join(", ")}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-2">Issue Type</label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground">
                  <option value="damaged">Product Damaged</option>
                  <option value="missing">Missing Items</option>
                  <option value="wrong">Received Wrong Item</option>
                  <option value="quality">Poor Quality</option>
                  <option value="delivery">Delivery Delay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-2">Attach Images (Required for Damage)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-background transition-colors cursor-pointer relative overflow-hidden group">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }} />
                  <UploadCloud size={32} className="text-muted group-hover:text-primary transition-colors mb-2" />
                  {fileName ? (
                    <p className="text-sm font-semibold text-primary">{fileName}</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-2">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="Please describe the issue in detail..." />
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-3 rounded-xl font-bold transition-all duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
