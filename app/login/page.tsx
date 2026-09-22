"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Lock, Mail } from "lucide-react";

type Role = "student" | "admin";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [loading, setLoading] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!email.trim()) next.email = "Email is required.";
    if (!password.trim()) next.password = "Password is required.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      // Bump the key to re-trigger the shake animation even on repeated failed submits.
      setShakeKey((k) => k + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.redirectTo || (role === "admin" ? "/dashboard/admin" : "/dashboard/student");
      } else {
        setErrors((prev) => ({ ...prev, password: data.error || "Login failed." }));
        setShakeKey((k) => k + 1);
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, password: "An error occurred." }));
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-zinc-950 lg:grid-cols-2">
      {/* Left: animated abstract gradient mesh */}
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:block">
        <div className="mesh-blob mesh-blob-a" />
        <div className="mesh-blob mesh-blob-b" />
        <div className="mesh-blob mesh-blob-c" />
        <div className="absolute inset-0 bg-zinc-950/30" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            CEMS
          </span>
          <div className="max-w-sm">
            <h1 className="text-2xl font-medium text-zinc-100">
              Sign in to keep things moving.
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your courses, records, and admin tools, all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-xl font-semibold text-zinc-100">Welcome back</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Role toggle */}
            <div className="mb-6 flex items-center justify-center">
              <div className="relative flex w-full rounded-full border border-white/10 bg-zinc-950/60 p-1">
                <span
                  className="absolute inset-y-1 w-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-900/40 transition-transform duration-300 ease-out"
                  style={{
                    transform: role === "admin" ? "translateX(100%)" : "translateX(0%)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`relative z-10 flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-300 ${
                    role === "student" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`relative z-10 flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-300 ${
                    role === "admin" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email field */}
              <div key={`email-${shakeKey}`} className={errors.email ? "animate-shake" : ""}>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                    strokeWidth={1.75}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder={role === "admin" ? "admin@cems.dev" : "you@school.edu"}
                    className={`w-full rounded-lg border bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                      errors.email ? "border-red-500/60" : "border-white/10"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div key={`password-${shakeKey}`} className={errors.password ? "animate-shake" : ""}>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-zinc-400"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                    strokeWidth={1.75}
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                      errors.password ? "border-red-500/60" : "border-white/10"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-zinc-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-white/20 bg-zinc-900 accent-blue-600"
                  />
                  Remember me
                </label>
                <a href="#" className="text-zinc-400 hover:text-zinc-200">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Signing in…
                  </>
                ) : (
                  `Sign in as ${role === "admin" ? "Admin" : "Student"}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes mesh-move-a {
          0% {
            transform: translate(-10%, -10%) scale(1);
          }
          50% {
            transform: translate(10%, 5%) scale(1.15);
          }
          100% {
            transform: translate(-10%, -10%) scale(1);
          }
        }
        @keyframes mesh-move-b {
          0% {
            transform: translate(10%, 10%) scale(1.1);
          }
          50% {
            transform: translate(-15%, -5%) scale(1);
          }
          100% {
            transform: translate(10%, 10%) scale(1.1);
          }
        }
        @keyframes mesh-move-c {
          0% {
            transform: translate(0%, 15%) scale(1);
          }
          50% {
            transform: translate(-10%, -15%) scale(1.2);
          }
          100% {
            transform: translate(0%, 15%) scale(1);
          }
        }
        .mesh-blob {
          position: absolute;
          width: 60%;
          height: 60%;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.55;
        }
        .mesh-blob-a {
          top: -10%;
          left: -10%;
          background: radial-gradient(circle at 30% 30%, #4f46e5, transparent 70%);
          animation: mesh-move-a 18s ease-in-out infinite;
        }
        .mesh-blob-b {
          bottom: -15%;
          right: -10%;
          background: radial-gradient(circle at 70% 70%, #7c3aed, transparent 70%);
          animation: mesh-move-b 22s ease-in-out infinite;
        }
        .mesh-blob-c {
          bottom: 10%;
          left: 20%;
          width: 45%;
          height: 45%;
          background: radial-gradient(circle at 50% 50%, #2563eb, transparent 70%);
          animation: mesh-move-c 26s ease-in-out infinite;
        }

        @keyframes shake {
          10%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .mesh-blob {
            animation: none !important;
          }
          .animate-shake {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}