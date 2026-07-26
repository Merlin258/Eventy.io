"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, GraduationCap, Briefcase } from "lucide-react";

type LoginRole = "student" | "organizer";

interface FormState {
  identifier: string;
  password: string;
}

const ROLE_CONFIG: Record<
  LoginRole,
  { label: string; identifierLabel: string; placeholder: string }
> = {
  student: {
    label: "Student Login",
    identifierLabel: "College ID / Email",
    placeholder: "e.g. 21CS045 or you@college.edu",
  },
  organizer: {
    label: "Organizer Login",
    identifierLabel: "Email",
    placeholder: "you@college.edu",
  },
};

export default function Login() {
  const [role, setRole] = useState<LoginRole>("student");
  const [form, setForm] = useState<FormState>({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = ROLE_CONFIG[role];

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulated auth request — replace with real sign-in call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/60 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue to Campus Events
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-gray-100/80 p-1">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
              role === "student"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("organizer")}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
              role === "organizer"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Organizer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">
              {config.identifierLabel}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.identifier}
                onChange={(e) => handleChange("identifier", e.target.value)}
                placeholder={config.placeholder}
                className="w-full rounded-lg border border-gray-200 bg-white/70 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-500">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white/70 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700">
            Contact your admin
          </a>
        </p>
      </div>
    </div>
  );
}