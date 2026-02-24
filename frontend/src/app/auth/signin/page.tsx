"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

function OAuthButton({
  icon,
  label,
  onClick,
  bgColor,
  textColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md border"
      style={{
        background: bgColor,
        color: textColor,
        borderColor: borderColor || bgColor,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export default function SignInPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>();

  const handleSignIn = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Signed in successfully!");
        router.push("/profile");
      }
    } catch {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed");
      }
      toast.success("Account created! Please sign in.");
      setTab("signin");
      reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{
        background:
          "linear-gradient(135deg, #fff8f0 0%, #f0faf5 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #FF6B00, #2D6A4F)",
              }}
            >
              🐄
            </div>
            <span className="font-extrabold text-xl text-gray-800 group-hover:text-orange-600 transition-colors">
              Dhyan Foundation
            </span>
            <span className="text-gray-400 text-sm">Guwahati, Assam</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="p-8 pb-6">
            <h1 className="text-2xl font-extrabold text-gray-800 mb-1">
              Sign In to Dhyan Foundation
            </h1>
            <p className="text-gray-400 text-sm">
              Access donation history, 80G certificates, and more.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="px-8 pb-6 space-y-3">
            <OAuthButton
              label="Continue with Google"
              onClick={() => signIn("google", { callbackUrl: "/profile" })}
              bgColor="#ffffff"
              textColor="#374151"
              borderColor="#e5e7eb"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            />
            <OAuthButton
              label="Continue with Microsoft"
              onClick={() => signIn("azure-ad", { callbackUrl: "/profile" })}
              bgColor="#0078D4"
              textColor="white"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="white">
                  <rect x="1" y="1" width="9" height="9" />
                  <rect x="11" y="1" width="9" height="9" fill="#a0c4f1" />
                  <rect x="1" y="11" width="9" height="9" fill="#a0c4f1" />
                  <rect x="11" y="11" width="9" height="9" />
                </svg>
              }
            />
            <OAuthButton
              label="Continue with Apple"
              onClick={() => signIn("apple", { callbackUrl: "/profile" })}
              bgColor="#000000"
              textColor="white"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
              }
            />
          </div>

          {/* Divider */}
          <div className="px-8 flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Tab Switcher */}
          <div className="px-8 mb-6">
            <div className="flex rounded-xl p-1" style={{ background: "#f5f5f5" }}>
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); reset(); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                  style={{
                    background: tab === t ? "white" : "transparent",
                    color: tab === t ? "#FF6B00" : "#9ca3af",
                    boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(tab === "signin" ? handleSignIn : handleSignUp)}
            className="px-8 pb-8 space-y-4"
            noValidate
          >
            {tab === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  {...register("name", { required: tab === "signup" ? "Name is required" : false })}
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {tab === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              ) : tab === "signin" ? "Sign In" : "Create Account"}
            </button>

            {/* Guest link */}
            <div className="text-center pt-2">
              <Link
                href="/donate"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                Continue as Guest →
              </Link>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          By signing in, you agree to our terms. Your data is protected and
          never shared. 80G certificates are issued to your registered email.
        </p>
      </div>
    </div>
  );
}
