"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setName(data.user.name);
          setEmail(data.user.email);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password: password || undefined })
      });
      const data = await res.json();
      if (data.success) {
        toast({ type: 'success', title: 'Profile updated' });
        setPassword(""); // Clear password field after update
      } else {
        toast({ type: 'error', title: 'Update failed', description: data.error });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-100">Edit Profile</h1>
        <p className="mt-2 text-sm text-zinc-400">Manage your account settings and personal information.</p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-400 outline-none cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-zinc-500">Email cannot be changed.</p>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">New Password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </>
  );
}
