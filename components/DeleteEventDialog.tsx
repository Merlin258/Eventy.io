"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteEventDialogProps {
  isOpen: boolean;
  eventName: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteEventDialog({
  isOpen,
  eventName,
  isSubmitting = false,
  onConfirm,
  onClose,
}: DeleteEventDialogProps) {
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
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
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

            <h2 id="delete-modal-title" className="mt-4 text-base font-semibold text-zinc-100">
              Delete this event?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
              <span className="font-medium text-zinc-300">{eventName}</span> and all of its
              registration data will be permanently removed. This cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Deleting…" : "Delete event"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}