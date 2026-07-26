"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users } from "lucide-react";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  capacity: number;
  gradient: string;
}

const categoryStyles: Record<string, string> = {
  Workshop: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Social: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  Academic: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  Sports: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Career: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

export default function EventCard({ event }: { event: EventItem }) {
  const spotsLeft = event.capacity - event.attendeeCount;
  const isFull = spotsLeft <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl transition-colors hover:border-white/20"
    >
      {/* Thumbnail */}
      <div className={`relative h-28 w-full ${event.gradient}`}>
        <div className="absolute inset-0 bg-black/10" />
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            categoryStyles[event.category] ?? "border-white/20 bg-white/10 text-zinc-200"
          }`}
        >
          {event.category}
        </span>
      </div>

      {/* Body */}
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

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
            {event.attendeeCount}/{event.capacity}
          </div>
          <span
            className={`text-xs font-medium ${
              isFull ? "text-zinc-600" : spotsLeft <= 5 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {isFull ? "Full" : `${spotsLeft} spots left`}
          </span>
        </div>

        <button
          disabled={isFull}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isFull ? "Waitlist" : "Reserve spot"}
        </button>
      </div>
    </motion.div>
  );
}