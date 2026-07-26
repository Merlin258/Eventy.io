"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCog, Database, LayoutDashboard } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Manage Events", href: "/dashboard/admin/events", icon: CalendarCog },
  { label: "User DB", href: "/dashboard/admin/users", icon: Database },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-white/5 bg-zinc-950 lg:flex lg:flex-col">
      <div className="flex h-14 items-center border-b border-white/5 px-6">
        <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
          CEMS
        </span>
        <span className="ml-2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-zinc-100"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-medium text-white">
            SK
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-200">Sam Kessler</p>
            <p className="truncate text-[11px] text-zinc-500">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}