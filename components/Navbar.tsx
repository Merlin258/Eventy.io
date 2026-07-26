"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";

const mockUser = {
  name: "Alex Rivera",
  email: "alex@cems.dev",
  initials: "AR",
};

const mockUnreadCount = 3;

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            CEMS
          </span>
        </a>

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
              {mockUnreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-zinc-950 bg-red-500 px-1 text-[10px] font-medium leading-none text-white">
                  {mockUnreadCount > 9 ? "9+" : mockUnreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border border-white/5 bg-zinc-900/95 shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="border-b border-white/5 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">Notifications</p>
                </div>
                <ul className="max-h-64 divide-y divide-white/5 overflow-y-auto text-sm">
                  <li className="px-4 py-3 text-zinc-300 hover:bg-white/5">
                    Deployment <span className="text-zinc-100">production-api</span> succeeded.
                  </li>
                  <li className="px-4 py-3 text-zinc-300 hover:bg-white/5">
                    New comment on issue <span className="text-zinc-100">CEMS-142</span>.
                  </li>
                  <li className="px-4 py-3 text-zinc-300 hover:bg-white/5">
                    Weekly usage report is ready.
                  </li>
                </ul>
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
                {mockUser.initials}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-white/5 bg-zinc-900/95 shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="border-b border-white/5 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">{mockUser.name}</p>
                  <p className="truncate text-xs text-zinc-500">{mockUser.email}</p>
                </div>
                <div className="py-1 text-sm">
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-zinc-100">
                    <UserIcon className="h-4 w-4" strokeWidth={1.75} />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-zinc-100">
                    <Settings className="h-4 w-4" strokeWidth={1.75} />
                    Settings
                  </button>
                </div>
                <div className="border-t border-white/5 py-1 text-sm">
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-white/5">
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