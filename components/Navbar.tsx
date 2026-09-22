"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, User as UserIcon } from "lucide-react";

interface Notification {
  notification_id: number;
  message: string;
}

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string; user_id: string; role: string; initials: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close either popover on outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const initials = data.user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
          setUser({ ...data.user, initials });

          // Fetch real notifications for students
          if (data.user.role === "student") {
            fetch(`/api/notifications?student_id=${data.user.user_id}`)
              .then((r) => r.json())
              .then((notifs) => {
                if (Array.isArray(notifs)) setNotifications(notifs);
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, []);

  async function dismissNotification(id: number) {
    try {
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: id }),
      });
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
    } catch {}
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            CEMS
          </span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                setUserMenuOpen(false);
              }}
              aria-label="View notifications"
              aria-expanded={notifOpen}
              className="relative flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-950 bg-red-500 px-1 text-[10px] font-medium leading-none text-white">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-white/5 bg-zinc-900/95 shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="border-b border-white/5 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">Notifications</p>
                </div>
                {notifications.length > 0 ? (
                  <ul className="max-h-64 divide-y divide-white/5 overflow-y-auto text-sm">
                    {notifications.map((n) => (
                      <li
                        key={n.notification_id}
                        className="flex items-start justify-between gap-2 px-4 py-3 text-zinc-300 hover:bg-white/5"
                      >
                        <span className="flex-1">{n.message}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(n.notification_id);
                          }}
                          className="shrink-0 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
                          aria-label="Dismiss"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-zinc-500">
                    No notifications
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User avatar dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="Open user menu"
              aria-expanded={userMenuOpen}
              className="flex items-center gap-1.5 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-medium text-white">
                {user ? user.initials : "U"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-white/5 bg-zinc-900/95 shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="border-b border-white/5 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">{user ? user.name : "User"}</p>
                  <p className="truncate text-xs text-zinc-500">{user ? user.email : ""}</p>
                </div>
                <div className="py-1 text-sm">
                  <Link href="/dashboard/profile" className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-zinc-100">
                    <UserIcon className="h-4 w-4" strokeWidth={1.75} />
                    Profile
                  </Link>
                </div>
                <div className="border-t border-white/5 py-1 text-sm">
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/login';
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}