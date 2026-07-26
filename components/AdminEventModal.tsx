"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  Tag,
  Type,
  Users,
  X,
} from "lucide-react";

export interface EventFormData {
  name: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  capacity: string;
  description: string;
}

interface AdminEventModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: Partial<EventFormData>;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void> | void;
}

const emptyForm: EventFormData = {
  name: "",
  category: "Workshop",
  date: "",
  time: "",
  venue: "",
  capacity: "",
  description: "",
};

const categories = ["Workshop", "Social", "Academic", "Sports", "Career"];
const DESCRIPTION_LIMIT = 500;

type FieldErrors = Partial<Record<keyof EventFormData, string>>;

export default function AdminEventModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: AdminEventModalProps) {
  const [form, setForm] = useState<EventFormData>({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state whenever the modal is opened fresh for a given record.
  useEffect(() => {
    if (isOpen) {
      setForm({ ...emptyForm, ...initialData });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function updateField<K extends keyof EventFormData>(key: K, value: EventFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = "Event name is required.";
    if (!form.date) next.date = "Date is required.";
    if (!form.time) next.time = "Time is required.";
    if (!form.venue.trim()) next.venue = "Venue is required.";
    if (!form.capacity.trim()) next.capacity = "Capacity is required.";
    else if (Number(form.capacity) <= 0) next.capacity = "Must be greater than 0.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setShakeKey((k) => k + 1);
      return;
    }

    setIsSubmitting(true);
    await onSubmit(form);
    setIsSubmitting(false);
  }

  const descriptionCount = form.description.length;
  const descriptionRatio = descriptionCount / DESCRIPTION_LIMIT;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => !isSubmitting && onClose()}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-7 py-5">
              <div>
                <h2 id="event-modal-title" className="text-lg font-semibold text-zinc-100">
                  {mode === "create" ? "Create event" : "Edit event"}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {mode === "create"
                    ? "Fill in the details below to publish a new event."
                    : "Update the details for this event."}
                </p>
              </div>
              <button
                onClick={() => !isSubmitting && onClose()}
                aria-label="Close"
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Two-column body */}
              <div className="grid max-h-[65vh] grid-cols-1 gap-8 overflow-y-auto px-7 py-6 md:grid-cols-2">
                {/* Left: basic info */}
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Basic info
                  </p>

                  <div key={`name-${shakeKey}`} className={errors.name ? "animate-shake" : ""}>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                      Event name
                    </label>
                    <div className="relative">
                      <Type
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        strokeWidth={1.75}
                      />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Intro to Machine Learning Workshop"
                        className={`w-full rounded-lg border bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                          errors.name ? "border-red-500/60" : "border-white/10"
                        }`}
                      />
                    </div>
                    {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                      Category
                    </label>
                    <div className="relative">
                      <Tag
                        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                        strokeWidth={1.75}
                      />
                      <select
                        value={form.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-zinc-950 py-2.5 pl-9 pr-8 text-sm text-zinc-100 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c} className="bg-zinc-900">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div key={`date-${shakeKey}`} className={errors.date ? "animate-shake" : ""}>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Date
                      </label>
                      <div className="custom-date-field relative">
                        <CalendarDays
                          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                          strokeWidth={1.75}
                        />
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => updateField("date", e.target.value)}
                          style={{ colorScheme: "dark" }}
                          className={`w-full rounded-lg border bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                            errors.date ? "border-red-500/60" : "border-white/10"
                          }`}
                        />
                      </div>
                      {errors.date && <p className="mt-1.5 text-xs text-red-400">{errors.date}</p>}
                    </div>

                    <div key={`time-${shakeKey}`} className={errors.time ? "animate-shake" : ""}>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Time
                      </label>
                      <div className="custom-date-field relative">
                        <Clock
                          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                          strokeWidth={1.75}
                        />
                        <input
                          type="time"
                          value={form.time}
                          onChange={(e) => updateField("time", e.target.value)}
                          style={{ colorScheme: "dark" }}
                          className={`w-full rounded-lg border bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                            errors.time ? "border-red-500/60" : "border-white/10"
                          }`}
                        />
                      </div>
                      {errors.time && <p className="mt-1.5 text-xs text-red-400">{errors.time}</p>}
                    </div>
                  </div>
                </div>

                {/* Right: logistics */}
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Logistics
                  </p>

                  <div key={`venue-${shakeKey}`} className={errors.venue ? "animate-shake" : ""}>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                      Venue
                    </label>
                    <div className="relative">
                      <MapPin
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        strokeWidth={1.75}
                      />
                      <input
                        type="text"
                        value={form.venue}
                        onChange={(e) => updateField("venue", e.target.value)}
                        placeholder="Engineering Hall, Rm 204"
                        className={`w-full rounded-lg border bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                          errors.venue ? "border-red-500/60" : "border-white/10"
                        }`}
                      />
                    </div>
                    {errors.venue && <p className="mt-1.5 text-xs text-red-400">{errors.venue}</p>}
                  </div>

                  <div key={`capacity-${shakeKey}`} className={errors.capacity ? "animate-shake" : ""}>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                      Capacity limit
                    </label>
                    <div className="relative">
                      <Users
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        strokeWidth={1.75}
                      />
                      <input
                        type="number"
                        min={1}
                        value={form.capacity}
                        onChange={(e) => updateField("capacity", e.target.value)}
                        placeholder="50"
                        className={`w-full rounded-lg border bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                          errors.capacity ? "border-red-500/60" : "border-white/10"
                        }`}
                      />
                    </div>
                    {errors.capacity && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.capacity}</p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-400">Description</label>
                      <span
                        className={`text-[11px] tabular-nums ${
                          descriptionRatio >= 1
                            ? "text-red-400"
                            : descriptionRatio >= 0.9
                              ? "text-amber-400"
                              : "text-zinc-600"
                        }`}
                      >
                        {descriptionCount}/{DESCRIPTION_LIMIT}
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={form.description}
                      maxLength={DESCRIPTION_LIMIT}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Give students a sense of what to expect…"
                      className="w-full resize-none rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 px-7 py-5">
                <button
                  type="button"
                  onClick={() => !isSubmitting && onClose()}
                  disabled={isSubmitting}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      {mode === "create" ? "Creating…" : "Saving…"}
                    </>
                  ) : mode === "create" ? (
                    "Create event"
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <style jsx global>{`
            /* Recolor the native calendar/clock glyph so it reads on a dark field
               instead of the default dark-on-dark browser icon. */
            .custom-date-field input[type="date"]::-webkit-calendar-picker-indicator,
            .custom-date-field input[type="time"]::-webkit-calendar-picker-indicator {
              filter: invert(0.6);
              opacity: 0.7;
              cursor: pointer;
              transition: opacity 0.15s ease;
            }
            .custom-date-field input[type="date"]::-webkit-calendar-picker-indicator:hover,
            .custom-date-field input[type="time"]::-webkit-calendar-picker-indicator:hover {
              opacity: 1;
            }

            @keyframes shake {
              10%,
              90% {
                transform: translateX(-1px);
              }
              20%,
              80% {
                transform: translateX(2px);
              }
              30%,
              50%,
              70% {
                transform: translateX(-4px);
              }
              40%,
              60% {
                transform: translateX(4px);
              }
            }
            .animate-shake {
              animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-shake {
                animation: none !important;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}