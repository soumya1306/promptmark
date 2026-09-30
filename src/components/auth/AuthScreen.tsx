"use client";

import React, { useState } from "react";
import { signInWithGoogle } from "@/lib/auth/auth-service";

interface AuthScreenProps {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  isModal = false,
  onClose,
  onSuccess,
  onContinueAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Password Strength Calculation
  const getPasswordStrength = () => {
    if (password.length === 0) {
      return {
        label: "At least 8+ characters",
        pillClass: "bg-[#f0ece4] text-[#6b6358]",
        dotClass: "bg-[#74796e]",
      };
    }
    if (password.length < 8) {
      return {
        label: "Too short",
        pillClass: "bg-[#ffdad8] text-[#b83230]",
        dotClass: "bg-[#b83230]",
      };
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
    if (!hasUpper || !hasNumberOrSymbol) {
      return {
        label: "Good — add a number/symbol",
        pillClass: "bg-[#f8e0a8] text-[#705c30]",
        dotClass: "bg-[#705c30]",
      };
    }
    return {
      label: "Strong — 12+ chars & symbols",
      pillClass: "bg-[#c8e8d0] text-[#2a6038]",
      dotClass: "bg-[#4a7c59]",
    };
  };

  const strength = getPasswordStrength();

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Sign-In Failed:", err);
      setErrorMessage(
        err?.message || "Could not connect to Google OAuth. Please verify your Supabase configuration."
      );
      setIsGoogleLoading(false);
    }
  };

  // Handle Email Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(
      "Password auth is wired for Google OAuth. Please click 'Sign up with Google' for one-click access."
    );
  };

  const cardContent = (
    <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
      {/* Main Card */}
      <div className="w-full bg-white rounded-2xl p-7 sm:p-11 shadow-[0_8px_32px_rgba(46,50,48,0.08)] relative overflow-hidden border border-[#e6e2da]">
        {/* Top Decorative Gentle Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4a7c59] via-[#78a886] to-[#c4a66a]" />

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f0ece4] hover:bg-[#eae6de] text-[#6b6358] flex items-center justify-center transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}

        {/* Card Header */}
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0e8db] text-[#5e5548] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] animate-pulse" />
            <span>Early Access v2.4</span>
          </div>

          {/* Headline */}
          <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#2e3230] mt-4">
            {authMode === "signup" ? "Join your collaborative sanctuary" : "Welcome back to your sanctuary"}
          </h1>

          {/* Subheadline */}
          <p className="font-body text-sm sm:text-base text-[#4a4e4a] max-w-md mt-2.5 leading-relaxed">
            Write, review, and organize in real-time with teams who care about clarity and calm craft.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-5 p-3 rounded-xl bg-[#ffdad8] border border-[#b83230]/20 text-[#690005] text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#b83230]">error</span>
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="hover:opacity-75">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Google One-Click Auth Button */}
        <div className="mt-7 flex flex-col items-center">
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3.5 px-6 py-3.5 rounded-xl bg-[#f5f1ea] hover:bg-[#eae6de] active:scale-[0.99] transition-all duration-200 text-[#2e3230] font-semibold text-sm shadow-xs border border-[#e6e2da] cursor-pointer disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <span className="material-symbols-outlined animate-spin text-[20px] text-[#4a7c59]">
                progress_activity
              </span>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
                  fill="#34A853"
                />
                <path
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27 0-.78.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12c0 2.06.46 3.84 1.26 5.42l4.02-3.15z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span className="font-medium text-base">
              {authMode === "signup" ? "Sign up with Google" : "Sign in with Google"}
            </span>
          </button>

          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#6b6358] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#4a7c59]">verified</span>
            <span>Recommended for instant workspace sync &amp; 250MB storage</span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full h-px bg-[#e6e2da]" />
          <span className="absolute px-3.5 bg-white text-xs uppercase tracking-wider text-[#6b6358] font-semibold">
            or continue with work email
          </span>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {authMode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide text-[#2e3230] uppercase" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#6b6358] text-[20px] pointer-events-none">
                  person
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-[#f5f1ea] rounded-xl text-sm text-[#2e3230] placeholder:text-[#6b6358]/60 focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/30 transition-all border border-transparent focus:border-[#4a7c59]"
                  id="fullName"
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                />
              </div>
            </div>
          )}

          {/* Work Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide text-[#2e3230] uppercase" htmlFor="workEmail">
              Work Email
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#6b6358] text-[20px] pointer-events-none">
                mail
              </span>
              <input
                className="w-full pl-11 pr-4 py-3 bg-[#f5f1ea] rounded-xl text-sm text-[#2e3230] placeholder:text-[#6b6358]/60 focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/30 transition-all border border-transparent focus:border-[#4a7c59]"
                id="workEmail"
                placeholder="you@company.design"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-wide text-[#2e3230] uppercase" htmlFor="password">
                Password
              </label>
              {authMode === "signup" && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${strength.pillClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${strength.dotClass}`} />
                  <span>{strength.label}</span>
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#6b6358] text-[20px] pointer-events-none">
                lock
              </span>
              <input
                className="w-full pl-11 pr-11 py-3 bg-[#f5f1ea] rounded-xl text-sm text-[#2e3230] placeholder:text-[#6b6358]/60 focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/30 transition-all border border-transparent focus:border-[#4a7c59]"
                id="password"
                placeholder={authMode === "signup" ? "Create a strong password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#6b6358] hover:text-[#2e3230] transition-colors focus:outline-none flex items-center justify-center p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#4a7c59] hover:bg-[#3d6749] text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(74,124,89,0.22)] active:scale-[0.99] cursor-pointer"
            type="submit"
          >
            <span>{authMode === "signup" ? "Create free Promptmark account" : "Sign in to workspace"}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Trust & Features Checklist Inside Card */}
        <div className="mt-6 pt-5 bg-[#f5f1ea] rounded-xl p-4 border border-[#e6e2da]/60">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#6b6358] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4a7c59] text-[17px]">check_circle</span>
              <span>250MB Cloud Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4a7c59] text-[17px]">check_circle</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4a7c59] text-[17px]">check_circle</span>
              <span>Native DOCX Canvas</span>
            </div>
          </div>
        </div>

        {/* Demo / Guest Option */}
        {onContinueAsGuest && (
          <div className="mt-4 pt-3 flex justify-center border-t border-[#e6e2da]/40">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-semibold text-[#705c30] hover:text-[#2e3230] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#f5f1ea]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#705c30]">explore</span>
              <span>Or explore editor in Guest / Demo mode &rarr;</span>
            </button>
          </div>
        )}

        {/* Footer Micro-links */}
        <div className="mt-5 flex flex-col items-center text-center gap-2">
          <p className="text-sm text-[#6b6358]">
            {authMode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="font-semibold text-[#4a7c59] hover:underline transition-all cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="font-semibold text-[#4a7c59] hover:underline transition-all cursor-pointer"
                >
                  Sign up free
                </button>
              </>
            )}
          </p>
          <p className="text-[11px] text-[#6b6358]/80 max-w-sm leading-relaxed">
            By continuing, you agree to Promptmark’s{" "}
            <a className="underline hover:text-[#2e3230]" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline hover:text-[#2e3230]" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Social Proof Collaborator Strip (Below Card) */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3.5 px-4 text-center sm:text-left">
        <div className="flex items-center -space-x-2">
          <img
            className="w-7 h-7 rounded-full object-cover shadow-xs bg-[#e4e0d8] border-2 border-[#faf6f0]"
            alt="Sarah K."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA08zLlh4OZDp-zW8NkL9YcQ7HPN6RmURYQx6B3KTFywLbJtb8v-gZ-n_tXUC0IFG9qE0GJlYlJOdtup4xNgJyK9HBYqbOKQQVUZbG53zZdDHhjpVuJ-jfDHtzY4uX8Y8thsmzI8HIlN9PgVNU0N15yq0sPBBjsLm0eFkb_YFfQWRzN4VKOOYFcEfBR1Dyc7U2jtPGcf1bcMTi96No2VT-riPobyyNA3rp5aCEmfsI7M0lmJDIlOPj4"
          />
          <img
            className="w-7 h-7 rounded-full object-cover shadow-xs bg-[#e4e0d8] border-2 border-[#faf6f0]"
            alt="Alex R."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpZL2JwVjtHlDHO1qU-AFL6uTFT0W_B37hOv1HmbtYjV4w6GQl8xgEmOBOwjSV26raMrVZOtxFbO0TeTqh-yfvN5qLd_djWam0Z7b_o3w_ave108hGh5-7H9HZHBkgNrN4mBH0wyzaNWzlPAd1PDDCPVmQpm8O1HSVGlozPQN7iUpJgTfq8PKH3U-dDeYtyUHmZWntMymqPyy0E_d-am2m2IuiUwt2gXE34ECLKmjGFc5PiCOH9_4e"
          />
          <img
            className="w-7 h-7 rounded-full object-cover shadow-xs bg-[#e4e0d8] border-2 border-[#faf6f0]"
            alt="David C."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoDSMP2fvp79F_SBqgJ6gYvc6S4UpUPRvnpUrdXbR3GKSngNEedjaAzt9S9ba-yPcZI8Zg1GSXQTntjlrxVZhoekVcq2vT-deVRWxMIYAZoWwfT_GdPWnLMDW8OJ3bNf0wAi0BBuw544IPuWWSvazDvSwEJPz-o6kZsbTmRa4vOUfwVgGW9CqERq72iBYAYZGezSlBZuiAGMtgPpEA-KTgvKE-S9V5h4xlswb0VmKgFDrnNVS6fGSk"
          />
          <div className="w-7 h-7 rounded-full bg-[#f0e8db] text-[#5e5548] flex items-center justify-center text-[10px] font-bold shadow-xs border-2 border-[#faf6f0]">
            +40k
          </div>
        </div>
        <p className="text-xs text-[#6b6358] max-w-md">
          Trusted by 40,000+ writers, researchers, and product creators at humane craft companies.
        </p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2e3230]/40 backdrop-blur-md overflow-y-auto animate-in fade-in">
        {cardContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] font-body text-[#2e3230] flex flex-col justify-between selection:bg-[#c8e8d0] selection:text-[#002110] relative overflow-hidden">
      {/* Top Header */}
      <header className="w-full pt-8 pb-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4a7c59] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(46,50,48,0.06)]">
              <span className="material-symbols-outlined text-[20px]">nature</span>
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight text-[#2e3230]">
              Promptmark
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f0ece4] text-xs font-medium text-[#6b6358]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" />
            <span>Organic Documents</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-6 py-6 relative">
        {/* Subtle ambient decorative organic orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#c8e8d0]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-16 w-96 h-96 rounded-full bg-[#f8e0a8]/35 blur-3xl pointer-events-none" />

        {/* Organic Botanical Contour Lines (SVG Background Accent) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 overflow-hidden">
          <svg
            className="w-full max-w-4xl h-full text-[#c4c8bc]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            viewBox="0 0 900 650"
          >
            <path
              d="M 120 400 C 180 250, 320 180, 480 220 C 640 260, 720 160, 780 100"
              opacity="0.6"
              strokeDasharray="4 6"
            />
            <path
              d="M 80 480 C 220 420, 360 480, 520 390 C 680 300, 760 340, 840 280"
              opacity="0.4"
            />
            <path
              d="M 300 620 C 390 510, 470 540, 580 460 C 690 380, 780 430, 870 370"
              opacity="0.3"
            />
          </svg>
        </div>

        {cardContent}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-xs text-[#6b6358] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a className="hover:text-[#2e3230] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#2e3230] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#2e3230] transition-colors" href="#">
              Security &amp; Trust
            </a>
          </div>
          <div className="text-xs text-[#6b6358]/80">
            © {new Date().getFullYear()} Promptmark Systems, Inc. Rooted Warmth.
          </div>
        </div>
      </footer>
    </div>
  );
};
