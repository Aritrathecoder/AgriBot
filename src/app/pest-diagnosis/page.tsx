"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { getBaseUrl } from "@/lib/baseUrl";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
  Leaf,
  Activity,
  Heart,
  ShoppingBag,
  Search,
  Sparkles,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface RemedyItem {
  name: string;
  instructions: string;
  searchQuery: string;
}

interface DiagnosisResult {
  plantName: string;
  isHealthy: boolean;
  diseaseName: string | null;
  confidenceScore: string;
  symptoms: string[];
  infectedParts: string[];
  remedies: {
    organic: RemedyItem[];
    chemical: RemedyItem[];
  };
}

export default function PestDiagnosisPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/pest-diagnosis");
    }
  }, [user, authLoading, router]);

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "remedies" | "shop">("report");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or JPEG).");
      return;
    }

    setError(null);
    setResult(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
  };

  const handleDiagnose = async () => {
    if (!image) return;

    setIsDiagnosing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${getBaseUrl()}/api/pest-diagnosis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete diagnosis");
      }

      setResult(data);
      setActiveTab("report");
    } catch (err: any) {
      console.warn("Diagnosis Error:", err.message || err);
      setError(err.message || "An unexpected error occurred during diagnosis.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Helper to generate dynamic search URLs
  const getAmazonLink = (query: string) => 
    `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  const getGoogleLink = (query: string) => 
    `https://www.google.com/search?q=${encodeURIComponent(query + " buy online")}`;

  const getFlipkartLink = (query: string) => 
    `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1a0d] text-white">
        <Leaf className="animate-spin text-emerald-400 mb-3" size={32} />
        <p className="text-xs text-white/50">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0d1a0d] px-4 py-8 md:py-12 overflow-hidden text-white flex flex-col">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-800/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto relative z-10 flex-grow flex flex-col">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100/70 hover:text-white mb-6 transition-colors group self-start"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Pest & Disease Diagnosis</h1>
              <p className="text-xs text-emerald-100/60">Upload tree/plant parts to identify infections and retrieve organic & chemical solutions</p>
            </div>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Diagnosis Failed</p>
              <p className="opacity-95">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Upload and Trigger */}
          <div className="space-y-4">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] overflow-hidden bg-[#162216]/60 backdrop-blur-xl
                ${dragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-emerald-800/30 hover:border-primary/50'}`}
            >
              {image ? (
                <div className="relative w-full h-full min-h-[260px] flex flex-col items-center justify-center">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-emerald-800/30 shadow-inner">
                    <img 
                      src={image} 
                      alt="Uploaded plant part preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={clearImage}
                    className="mt-4 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Remove & Upload Another
                  </button>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-800/20 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-md">
                    <Upload size={24} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Drag and drop your image here</h3>
                  <p className="text-[11px] text-white/50 mb-4 max-w-xs mx-auto">Supports JPG, JPEG, and PNG. Make sure the infected part of the leaf/tree is clearly visible.</p>
                  <button 
                    onClick={triggerFileInput}
                    className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-light font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Select from device
                  </button>
                </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" 
              />
            </div>

            <button
              onClick={handleDiagnose}
              disabled={!image || isDiagnosing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 font-bold text-sm shadow-xl shadow-green-950/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isDiagnosing ? (
                <>
                  <Leaf className="animate-spin text-white" size={18} />
                  Analyzing with AI Bot...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Diagnose Plant Health
                </>
              )}
            </button>
          </div>

          {/* Right Column: Results Dashboard */}
          <div>
            {!result && !isDiagnosing && (
              <div className="border border-emerald-800/20 bg-[#162216]/30 backdrop-blur-xl rounded-3xl p-8 text-center min-h-[365px] flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-950/40 flex items-center justify-center text-emerald-500/60 mb-3 border border-emerald-800/10">
                  <HelpCircle size={22} />
                </div>
                <h3 className="font-semibold text-sm mb-1 text-emerald-100">Waiting for Upload</h3>
                <p className="text-[11px] text-white/40 max-w-xs leading-relaxed">
                  Provide an image of the plant leaf or affected trunk on the left and click "Diagnose Plant Health" to view the AI analysis.
                </p>
              </div>
            )}

            {isDiagnosing && (
              <div className="border border-emerald-800/20 bg-[#162216]/30 backdrop-blur-xl rounded-3xl p-8 text-center min-h-[365px] flex flex-col justify-center items-center space-y-4">
                <div className="relative w-16 h-16 flex items-center justify-center bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <Leaf className="text-emerald-400 animate-bounce" size={28} />
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-transparent animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-emerald-100">Diagnosing Crop Health...</h3>
                  <p className="text-[11px] text-white/40 max-w-xs mt-1 leading-relaxed">
                    AI Bot is scanning tree structures and analyzing tissue pathology. This will take just a moment.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="border border-emerald-500/10 bg-[#162216]/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[365px]">
                {/* Result Card Header Banner */}
                <div className={`px-5 py-4 border-b border-emerald-500/10 flex items-center justify-between
                  ${result.isHealthy ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}
                >
                  <div className="flex items-center gap-2.5">
                    {result.isHealthy ? (
                      <CheckCircle className="text-emerald-400" size={18} />
                    ) : (
                      <AlertCircle className="text-amber-400" size={18} />
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {result.isHealthy ? 'Healthy Plant Detected' : 'Infection Detected'}
                      </h4>
                      <p className="text-[9px] text-white/60">Confidence: {result.confidenceScore}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
                    ${result.isHealthy ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/60 text-amber-400 border border-amber-500/20'}`}
                  >
                    {result.isHealthy ? 'Healthy' : 'Diseased'}
                  </span>
                </div>

                {/* Tabs Selector */}
                <div className="flex border-b border-emerald-500/10 text-xs font-semibold bg-emerald-950/20">
                  <button
                    onClick={() => setActiveTab("report")}
                    className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer
                      ${activeTab === "report" ? 'border-primary text-primary-light bg-[#162216]/30' : 'border-transparent text-white/50 hover:text-white'}`}
                  >
                    <BookOpen size={13} />
                    Report
                  </button>
                  <button
                    onClick={() => setActiveTab("remedies")}
                    className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer
                      ${activeTab === "remedies" ? 'border-primary text-primary-light bg-[#162216]/30' : 'border-transparent text-white/50 hover:text-white'}`}
                  >
                    <Heart size={13} />
                    Remedies
                  </button>
                  <button
                    onClick={() => setActiveTab("shop")}
                    className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer
                      ${activeTab === "shop" ? 'border-primary text-primary-light bg-[#162216]/30' : 'border-transparent text-white/50 hover:text-white'}`}
                  >
                    <ShoppingBag size={13} />
                    Buy Remedies
                  </button>
                </div>

                {/* Tab content area */}
                <div className="p-5 flex-grow text-sm leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar">
                  
                  {/* TAB 1: REPORT */}
                  {activeTab === "report" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-950/30 border border-emerald-900/30 rounded-2xl overflow-hidden">
                          <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">Identified Plant</p>
                          <div className="overflow-x-auto pb-1">
                            <p className="font-semibold text-emerald-100 whitespace-nowrap w-max pr-2">{result.plantName}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-950/30 border border-emerald-900/30 rounded-2xl overflow-hidden">
                          <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">Primary Issue</p>
                          <div className="overflow-x-auto pb-1">
                            <p className="font-semibold text-emerald-100 whitespace-nowrap w-max pr-2">{result.diseaseName || "None - Plant is Healthy"}</p>
                          </div>
                        </div>
                      </div>

                      {result.infectedParts.length > 0 && (
                        <div>
                          <p className="font-bold text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Infected Parts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.infectedParts.map((part, i) => (
                              <span key={i} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-[10px] font-medium">
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Observed Symptoms</p>
                        <ul className="space-y-1.5 list-disc list-inside text-white/70 pl-1">
                          {result.symptoms.map((symptom, i) => (
                            <li key={i} className="leading-relaxed">
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: REMEDIES */}
                  {activeTab === "remedies" && (
                    <div className="space-y-4">
                      {result.remedies.organic.length === 0 && result.remedies.chemical.length === 0 && (
                        <p className="text-center text-white/40 py-8">No remedies required. The plant is healthy!</p>
                      )}

                      {result.remedies.organic.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider border-b border-emerald-500/10 pb-1">
                            🍀 Organic & Natural Remedies
                          </h5>
                          {result.remedies.organic.map((item, i) => (
                            <div key={i} className="p-3 bg-emerald-950/20 border border-emerald-900/20 rounded-2xl space-y-1">
                              <p className="font-bold text-white text-[11px]">{item.name}</p>
                              <p className="text-white/60 text-[10px] leading-relaxed">{item.instructions}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.remedies.chemical.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h5 className="font-bold text-[10px] text-amber-400 uppercase tracking-wider border-b border-amber-500/10 pb-1">
                            🧪 Chemical Control Measures
                          </h5>
                          {result.remedies.chemical.map((item, i) => (
                            <div key={i} className="p-3 bg-amber-950/10 border border-amber-900/10 rounded-2xl space-y-1">
                              <p className="font-bold text-white text-[11px]">{item.name}</p>
                              <p className="text-white/60 text-[10px] leading-relaxed">{item.instructions}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SHOPPING LINKS */}
                  {activeTab === "shop" && (
                    <div className="space-y-4">
                      <p className="text-[10px] text-white/50 leading-relaxed bg-emerald-950/30 p-3 rounded-2xl border border-emerald-900/20">
                        Suggesting trusted online platforms and search results. Click the buttons below to look up these remedies:
                      </p>

                      {result.remedies.organic.length === 0 && result.remedies.chemical.length === 0 && (
                        <p className="text-center text-white/40 py-8">Your plant is healthy! No products required.</p>
                      )}

                      {[...result.remedies.organic, ...result.remedies.chemical].map((item, idx) => (
                        <div key={idx} className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl space-y-3">
                          <div>
                            <span className="text-[9px] bg-primary/20 text-primary-light border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 inline-block">
                              Product Recommendation
                            </span>
                            <h5 className="font-bold text-white text-sm">{item.name}</h5>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <a
                              href={getAmazonLink(item.searchQuery)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 font-bold text-[10px] hover:bg-orange-500/20 flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                            >
                              Amazon
                              <ExternalLink size={10} />
                            </a>
                            <a
                              href={getFlipkartLink(item.searchQuery)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-1 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 font-bold text-[10px] hover:bg-yellow-500/20 flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                            >
                              Flipkart
                              <ExternalLink size={10} />
                            </a>
                            <a
                              href={getGoogleLink(item.searchQuery)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 font-bold text-[10px] hover:bg-blue-500/20 flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                            >
                              Google
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
