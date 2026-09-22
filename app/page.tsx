"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Zap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-300 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-zinc-950/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            CEMS
          </span>
        </div>
        <div>
          {user ? (
            <Link
              href={user.role === 'organizer' ? '/dashboard/admin' : '/dashboard/students'}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Sign up / Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-48">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 backdrop-blur-md">
              <span className="mr-1.5 flex h-2 w-2 rounded-full bg-blue-500"></span>
              Now built with PostgreSQL
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Manage campus events with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              absolute precision.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400"
          >
            A highly normalized, ACID-compliant platform for students and organizers. Register instantly, track live capacity, and never double-book a venue again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="https://github.com/Merlin258/Eventy.io"
              target="_blank"
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              View Documentation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-amber-400" />}
            title="Real-Time Capacity"
            desc="Driven by PostgreSQL triggers, seats are updated the exact millisecond a student registers."
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6 text-emerald-400" />}
            title="ACID Compliant"
            desc="Strict concurrency controls ensure venues are never overbooked, even under high traffic."
          />
          <FeatureCard 
            icon={<Users className="h-6 w-6 text-blue-400" />}
            title="Role-Based Access"
            desc="Dedicated dual-dashboards for organizers to manage events and students to discover them."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-sm text-zinc-500">
        <p>Built for 23CSE202 DBMS Project • Group C7</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group rounded-3xl border border-white/5 bg-zinc-900/30 p-8 transition-colors hover:border-white/10 hover:bg-zinc-900/50">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/50 border border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-medium text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
    </div>
  );
}
