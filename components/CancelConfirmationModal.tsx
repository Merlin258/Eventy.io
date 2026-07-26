"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface CancelConfirmationModalProps {
  isOpen: boolean;
  eventTitle: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelConfirmationModal({
  isOpen,
  eventTitle,
  isSubmitting = false,
  onConfirm,
  onClose,
}: CancelConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" strokeWidth={1.75} />
            </div>

            <h2 id="cancel-modal-title" className="mt-4 text-base font-semibold text-zinc-100">
              Cancel registration?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
              You&apos;re about to cancel your spot for{" "}
              <span className="font-medium text-zinc-300">{eventTitle}</span>. This cannot be
              undone, and your spot may be given to someone on the waitlist.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Keep my spot
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Cancelling…" : "Yes, cancel it"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}