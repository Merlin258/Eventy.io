"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ticket } from "lucide-react";
import type { EventItem } from "@/components/EventCard";
import RegisteredEventCard from "../../../../components/RegisteredEventCard";
import CancelConfirmationModal from "../../../../components/CancelConfirmationModal";
import QRTicketModal from "../../../../components/QRTicketModal";
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/Toast';

type Tab = "upcoming" | "past";

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [userId, setUserId] = useState("");
  const { toast } = useToast();

  const fetchRegistrations = async (uid: string) => {
    try {
      const upRes = await fetch(`/api/registrations?student_id=${uid}`);
      const upData = await upRes.json();
      
      const pastRes = await fetch(`/api/registrations?student_id=${uid}&include_past=true`);
      const pastData = await pastRes.json();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mapToEventItem = (row: any) => ({
        id: row.event_id,
        title: row.name,
        category: row.category || 'Academic', 
        date: row.date ? new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD',
        time: row.time || 'TBD',
        location: row.venue || 'TBD',
        attendeeCount: Number(row.total_registered) || 0,
        capacity: Number(row.total_seats) || 0,
        gradient: 'bg-gradient-to-br from-indigo-600 to-violet-700'
      });

      const upEvents = (Array.isArray(upData) ? upData : [])
        .filter((e: any) => new Date(e.date) >= today)
        .map(mapToEventItem);
        
      const allPastEvents = (Array.isArray(pastData) ? pastData : [])
        .filter((e: any) => new Date(e.date) < today)
        .map(mapToEventItem);

      setUpcomingEvents(upEvents);
      setPastEvents(allPastEvents);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const { user } = await authRes.json();
          if (user && user.user_id) {
            setUserId(user.user_id);
            await fetchRegistrations(user.user_id);
          }
        }
      } catch (err) {}
    }
    init();
  }, []);

  const [cancelTarget, setCancelTarget] = useState<EventItem | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [ticketTarget, setTicketTarget] = useState<EventItem | null>(null);

  const activeList = useMemo(
    () => (activeTab === "upcoming" ? upcomingEvents : pastEvents),
    [activeTab, upcomingEvents, pastEvents]
  );

  async function handleConfirmCancel() {
    if (!cancelTarget || !userId) return;
    setIsCancelling(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: userId, event_id: cancelTarget.id })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel');
      }
      toast({ type: 'success', title: 'Registration cancelled' });
      await fetchRegistrations(userId);
    } catch (err: any) {
      toast({ type: 'error', title: 'Cancellation failed', description: err.message });
    } finally {
      setIsCancelling(false);
      setCancelTarget(null);
    }
  }

  return (
    <>
      <Navbar />
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
    </>
  );
}