"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, User, ArrowLeft, Loader2, AlertCircle, CheckCircle, Phone, KeyRound } from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/chat";

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, setupRecaptcha, signInWithPhoneNumber } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "phone">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "phone" && typeof window !== "undefined") {
      if (!(window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier = setupRecaptcha("recaptcha-container");
        } catch (err) {
          console.warn("Recaptcha init error", err);
        }
      }
    }

    // Cleanup for React 18 Strict Mode
    return () => {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (e) {}
      }
    };
  }, [mode, setupRecaptcha]);

  const cleanErrors = () => {
    setError(null);
    setMessage(null);
  };

  const handleModeChange = (newMode: "signin" | "signup" | "forgot" | "phone") => {
    setMode(newMode);
    cleanErrors();
    setConfirmationResult(null);
    setOtp("");
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    cleanErrors();

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        router.push(redirect);
      } else if (mode === "signup") {
        if (!name.trim()) {
          throw new Error("Please enter your name");
        }
        await signUpWithEmail(email, password, name);
        router.push(redirect);
      } else if (mode === "forgot") {
        try {
          await resetPassword(email);
          console.log("Password reset email sent successfully to:", email);
          setMessage(
            "If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folder."
          );
          setMode("signin");
        } catch (resetErr: any) {
          console.warn("Password reset error:", resetErr.code, resetErr.message);
          if (resetErr.code === "auth/user-not-found") {
            setError("No account found with this email. Please create an account first.");
          } else if (resetErr.code === "auth/invalid-email") {
            setError("Please enter a valid email address.");
          } else if (resetErr.code === "auth/too-many-requests") {
            setError("Too many requests. Please wait a few minutes and try again.");
          } else {
            setError(resetErr.message || "Failed to send reset email. Please try again.");
          }
        }
      }
    } catch (err: any) {
      let errorMsg = "An error occurred. Please try again.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        errorMsg = "Incorrect email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid email address.";
      } else {
        console.warn("Auth error:", err.code || err.message);
        if (err.message) errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    cleanErrors();

    try {
      if (!confirmationResult) {
        // Step 1: Send OTP
        const appVerifier = (window as any).recaptchaVerifier;
        if (!appVerifier) throw new Error("Recaptcha not initialized");
        const confirmation = await signInWithPhoneNumber(phoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        setMessage("OTP sent! Please check your phone.");
      } else {
        // Step 2: Verify OTP
        await confirmationResult.confirm(otp);
        router.push(redirect);
      }
    } catch (err: any) {
      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please include the country code (e.g. +91).");
      } else if (err.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please try again.");
      } else {
        console.warn("Phone Auth error:", err.code || err.message);
        setError(err.message || "An error occurred with Phone Authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (loading) return;

    setLoading(true);
    cleanErrors();

    try {
      await signInWithGoogle();
      router.push(redirect);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        // User closed the popup — not an error, just silently reset
      } else {
        console.warn("Google auth error:", err.code || err.message);
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 animate-fade-up">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100/70 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Glass Card */}
      <div className="glass-card shadow-2xl p-6 sm:p-8 backdrop-blur-xl border border-emerald-500/10 text-foreground bg-[#162216]/80">
        {/* Logo and Greeting */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shadow-md">
              <Image
                src="/images/agribot-avatar.png"
                alt="AgriBot Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              AgriBot
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {mode === "signin" && "Welcome Back! 👋"}
            {mode === "signup" && "Create Account 🌱"}
            {mode === "forgot" && "Reset Password 🔒"}
            {mode === "phone" && "Phone Sign In 📱"}
          </h2>
          <p className="text-xs text-white/70">
            {mode === "signin" && "Aapka Digital Krishi Salahkar • Sign in to continue"}
            {mode === "signup" && "Join AgriBot to get smart farming advice"}
            {mode === "forgot" && "Enter your email to receive a password reset link"}
            {mode === "phone" && "Verify your phone number with an OTP"}
          </p>
        </div>

        {/* Success / Error Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={mode === "phone" ? handlePhoneAuth : handleEmailAuth} className="space-y-4">
          {mode === "phone" ? (
            <>
              {!confirmationResult ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-emerald-100/80 block uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-100/50">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-white placeholder-emerald-100/30 text-sm focus:bg-emerald-950/50 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-emerald-100/80 block uppercase tracking-wider">
                    6-Digit OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-100/50">
                      <KeyRound size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-white placeholder-emerald-100/30 text-sm focus:bg-emerald-950/50 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-emerald-100/80 block uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-100/50">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-white placeholder-emerald-100/30 text-sm focus:bg-emerald-950/50 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-emerald-100/80 block uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-100/50">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@agribot.in"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-white placeholder-emerald-100/30 text-sm focus:bg-emerald-950/50 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold text-emerald-100/80 block uppercase tracking-wider">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => handleModeChange("forgot")}
                        className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-100/50">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-white placeholder-emerald-100/30 text-sm focus:bg-emerald-950/50 focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === "signin" ? (
              "Sign In"
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "phone" ? (
              !confirmationResult ? "Send OTP" : "Verify OTP"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Change Mode toggler */}
        {mode !== "forgot" && (
          <div className="text-center mt-5 text-xs text-white/60">
            {mode === "signin" ? (
              <>
                New to AgriBot?{" "}
                <button
                  onClick={() => handleModeChange("signup")}
                  className="font-bold text-primary hover:text-primary-light transition-colors"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => handleModeChange("signin")}
                  className="font-bold text-primary hover:text-primary-light transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}

        {mode === "forgot" && (
          <div className="text-center mt-5 text-xs text-white/60">
            Remembered your password?{" "}
            <button
              onClick={() => handleModeChange("signin")}
              className="font-bold text-primary hover:text-primary-light transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Continue with OAuth Divider */}
        {mode !== "forgot" && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-800/35"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#162216] px-3 text-white/40 font-semibold tracking-wider text-[9px]">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
        )}

        {/* Google & Phone sign-in buttons */}
        {mode !== "forgot" && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-800/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-700/30 text-white font-semibold text-xs flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Google Account
            </button>

            {mode !== "phone" && (
              <button
                type="button"
                onClick={() => handleModeChange("phone")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-800/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-700/30 text-white font-semibold text-xs flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Phone size={14} className="text-emerald-400" />
                Continue with Phone Number
              </button>
            )}
          </div>
        )}

        {/* Invisible Recaptcha container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d1a0d] px-4 py-12">
      {/* Decorative blurred background organic shape gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-900/25 blur-[150px] pointer-events-none" />

      {/* Grid background mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0d1a0d)] pointer-events-none" />

      {/* Dot patterns */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-3 relative z-10 text-white">
            <Loader2 size={32} className="animate-spin text-primary-light" />
            <p className="text-xs text-white/50">Loading authentication screen...</p>
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </div>
  );
}
