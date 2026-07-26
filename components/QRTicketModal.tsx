"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "lucide-react";

interface QRTicketModalProps {
  isOpen: boolean;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  onClose: () => void;
}

// Deterministic mock QR pattern - purely visual, not a real scannable code.
function MockQRPattern() {
  const cells = Array.from({ length: 121 }, (_, i) => {
    const seed = (i * 37 + 11) % 97;
    return seed % 3 === 0;
  });

  return (
    <div className="grid grid-cols-11 gap-[2px] rounded-lg bg-white p-3">
      {cells.map((filled, i) => (
        <div key={i} className={`aspect-square ${filled ? "bg-zinc-950" : "bg-white"}`} />
      ))}
    </div>
  );
}

export default function QRTicketModal({
  isOpen,
  eventTitle,
  date,
  time,
  location,
  onClose,
}: QRTicketModalProps) {
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
            aria-labelledby="qr-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-6 text-center shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <h2 id="qr-modal-title" className="text-base font-semibold text-zinc-100">
              Your ticket
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Show this at check-in</p>

            <div className="mx-auto mt-5 w-fit">
              <MockQRPattern />
            </div>

            <div className="mt-5 space-y-1">
              <p className="text-sm font-medium text-zinc-200">{eventTitle}</p>
              <p className="text-xs text-zinc-500">
                {date} - {time}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                {location}
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}