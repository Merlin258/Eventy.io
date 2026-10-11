"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Download, MapPin, X, CheckCircle2, Users } from "lucide-react";
import type { EventItem } from "@/components/EventCard";

interface EventSummaryModalProps {
  isOpen: boolean;
  event: EventItem | null;
  studentName?: string;
  onClose: () => void;
}

export default function EventSummaryModal({
  isOpen,
  event,
  studentName = "Student",
  onClose,
}: EventSummaryModalProps) {
  if (!event) return null;

  function handleExportCsv() {
    if (!event) return;
    const headers = ["Event ID", "Title", "Category", "Date", "Time", "Location", "Attendee", "Status"];
    const row = [
      `"${event.id}"`,
      `"${event.title.replace(/"/g, '""')}"`,
      `"${event.category}"`,
      `"${event.date}"`,
      `"${event.time}"`,
      `"${event.location}"`,
      `"${studentName}"`,
      `"Attended / Verified"`
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.id}-summary.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Attended
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                {event.category}
              </span>
            </div>

            <h2 id="summary-modal-title" className="mt-3 text-lg font-semibold text-zinc-100">
              {event.title}
            </h2>

            {/* Description */}
            <div className="mt-3 rounded-xl border border-white/5 bg-zinc-950/40 p-3.5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Event Description
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                {event.description || "No description provided for this institutional event."}
              </p>
            </div>

            {/* Logistics Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-zinc-950/20 p-2.5">
                <CalendarDays className="h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-[10px] text-zinc-500">Date & Time</p>
                  <p className="font-medium text-zinc-200">{event.date} · {event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-zinc-950/20 p-2.5">
                <MapPin className="h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-[10px] text-zinc-500">Venue</p>
                  <p className="font-medium text-zinc-200">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-zinc-950/20 p-2.5 col-span-2">
                <Users className="h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-[10px] text-zinc-500">Verified Enrollment</p>
                  <p className="font-medium text-zinc-200">{event.attendeeCount} participants / {event.capacity} seats</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleExportCsv}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-2.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
              >
                <Download className="h-4 w-4" />
                Export Summary (CSV)
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
