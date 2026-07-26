"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ticket } from "lucide-react";
import type { EventItem } from "@/components/EventCard";
import RegisteredEventCard from "../../../../components/RegisteredEventCard";
import CancelConfirmationModal from "../../../../components/CancelConfirmationModal";
import QRTicketModal from "../../../../components/QRTicketModal";

type Tab = "upcoming" | "past";

const upcomingEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Intro to Machine Learning Workshop",
    category: "Workshop",
    date: "Aug 3",
    time: "2:00 PM",
    location: "Engineering Hall, Rm 204",
    attendeeCount: 42,
    capacity: 50,
    gradient: "bg-gradient-to-br from-blue-600 to-indigo-700",
  },
  {
    id: "evt-3",
    title: "Research Symposium: Climate Systems",
    category: "Academic",
    date: "Aug 8",
    time: "10:00 AM",
    location: "Science Center Auditorium",
    attendeeCount: 95,
    capacity: 120,
    gradient: "bg-gradient-to-br from-indigo-600 to-violet-700",
  },
  {
    id: "evt-6",
    title: "Startup Pitch Night",
    category: "Career",
    date: "Aug 14",
    time: "5:00 PM",
    location: "Innovation Lab",
    attendeeCount: 25,
    capacity: 40,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
];

const pastEvents: EventItem[] = [
  {
    id: "evt-p1",
    title: "Welcome Week Kickoff",
    category: "Social",
    date: "Jul 12",
    time: "5:00 PM",
    location: "Student Union Courtyard",
    attendeeCount: 210,
    capacity: 210,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: "evt-p2",
    title: "Career Fair: Tech & Engineering",
    category: "Career",
    date: "Jul 18",
    time: "11:00 AM",
    location: "Convocation Center",
    attendeeCount: 400,
    capacity: 400,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    id: "evt-p3",
    title: "Intramural Soccer Opener",
    category: "Sports",
    date: "Jul 22",
    time: "6:00 PM",
    location: "West Athletic Field",
    attendeeCount: 48,
    capacity: 48,
    gradient: "bg-gradient-to-br from-emerald-600 to-teal-700",
  },
];

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [registered, setRegistered] = useState<EventItem[]>(upcomingEvents);

  const [cancelTarget, setCancelTarget] = useState<EventItem | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [ticketTarget, setTicketTarget] = useState<EventItem | null>(null);

  const activeList = useMemo(
    () => (activeTab === "upcoming" ? registered : pastEvents),
    [activeTab, registered]
  );

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    // Simulated API call — replace with a real cancellation request.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setRegistered((prev) => prev.filter((e) => e.id !== cancelTarget.id));
    setIsCancelling(false);
    setCancelTarget(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/40">
            <Ticket className="h-4.5 w-4.5 text-zinc-400" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100">My Events</h1>
            <p className="text-sm text-zinc-500">Everything you&apos;ve registered for.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mb-8 flex w-fit gap-1 rounded-xl border border-white/10 bg-zinc-900/40 p-1">
          {(["upcoming", "past"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-white/10"
                />
              )}
              <span
                className={`relative z-10 ${
                  activeTab === tab ? "text-zinc-100" : "text-zinc-500"
                }`}
              >
                {tab === "upcoming" ? "Upcoming" : "Past Events"}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {activeList.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {activeList.map((event) => (
                    <RegisteredEventCard
                      key={event.id}
                      event={event}
                      status={activeTab}
                      onViewTicket={() => setTicketTarget(event)}
                      onCancel={() => setCancelTarget(event)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/20 px-6 py-20 text-center">
                <h3 className="text-base font-medium text-zinc-200">
                  {activeTab === "upcoming" ? "No upcoming events" : "No past events yet"}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm text-zinc-500">
                  {activeTab === "upcoming"
                    ? "You haven't registered for anything yet. Head to Discover to find something."
                    : "Once you attend an event, it'll show up here."}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <CancelConfirmationModal
        isOpen={cancelTarget !== null}
        eventTitle={cancelTarget?.title ?? ""}
        isSubmitting={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => !isCancelling && setCancelTarget(null)}
      />

      <QRTicketModal
        isOpen={ticketTarget !== null}
        eventTitle={ticketTarget?.title ?? ""}
        date={ticketTarget?.date ?? ""}
        time={ticketTarget?.time ?? ""}
        location={ticketTarget?.location ?? ""}
        onClose={() => setTicketTarget(null)}
      />
    </div>
  );
}