"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, QrCode, XCircle } from "lucide-react";
import type { EventItem } from "@/components/EventCard";

interface RegisteredEventCardProps {
  event: EventItem;
  status: "upcoming" | "past";
  onViewTicket?: () => void;
  onCancel?: () => void;
}

const categoryStyles: Record<string, string> = {
  Workshop: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Social: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  Academic: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  Sports: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Career: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

export default function RegisteredEventCard({
  event,
  status,
  onViewTicket,
  onCancel,
}: RegisteredEventCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl transition-colors hover:border-white/20 ${
        status === "past" ? "opacity-70" : ""
      }`}
    >
      <div className={`relative h-24 w-full ${event.gradient}`}>
        <div className="absolute inset-0 bg-black/10" />
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            categoryStyles[event.category] ?? "border-white/20 bg-white/10 text-zinc-200"
          }`}
        >
          {event.category}
        </span>
        {status === "past" && (
          <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
            Attended
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold leading-snug text-zinc-100">{event.title}</h3>

        <div className="space-y-1.5 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.75} />
            {event.date} · {event.time}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.75} />
            {event.location}
          </div>
        </div>

        {status === "upcoming" ? (
          <div className="mt-auto flex gap-2 pt-2">
            <button
              onClick={onViewTicket}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10"
            >
              <QrCode className="h-3.5 w-3.5" strokeWidth={1.75} />
              View QR Ticket
            </button>
            <button
              onClick={onCancel}
              aria-label="Cancel registration"
              className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 px-3 text-red-400 transition-colors hover:bg-red-500/10"
            >
              <XCircle className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-2">
            <button className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200">
              View summary
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}