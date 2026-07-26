"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CalendarClock, CompassIcon, Search, SlidersHorizontal } from "lucide-react";
import EventCard, { type EventItem } from "../../../components/EventCard";

const currentUser = {
  name: "Priya",
  eventsAttended: 12,
  upcoming: 3,
};

const mockEvents: EventItem[] = [
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
    id: "evt-2",
    title: "Fall Welcome Mixer",
    category: "Social",
    date: "Aug 5",
    time: "6:30 PM",
    location: "Student Union Courtyard",
    attendeeCount: 180,
    capacity: 200,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
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
    id: "evt-4",
    title: "Intramural Basketball Finals",
    category: "Sports",
    date: "Aug 9",
    time: "7:00 PM",
    location: "Rec Center Gym",
    attendeeCount: 60,
    capacity: 60,
    gradient: "bg-gradient-to-br from-emerald-600 to-teal-700",
  },
  {
    id: "evt-5",
    title: "Resume Review with Alumni",
    category: "Career",
    date: "Aug 11",
    time: "1:00 PM",
    location: "Career Center, Rm 110",
    attendeeCount: 18,
    capacity: 30,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
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
  {
    id: "evt-7",
    title: "Photography Club: Golden Hour Walk",
    category: "Social",
    date: "Aug 15",
    time: "6:00 PM",
    location: "Campus Quad",
    attendeeCount: 14,
    capacity: 25,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: "evt-8",
    title: "Data Structures Study Jam",
    category: "Academic",
    date: "Aug 16",
    time: "4:00 PM",
    location: "Library, Floor 3",
    attendeeCount: 22,
    capacity: 35,
    gradient: "bg-gradient-to-br from-indigo-600 to-violet-700",
  },
];

const categories = ["All", "Workshop", "Social", "Academic", "Sports", "Career"];

export default function StudentDiscoveryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        search.trim() === "" || event.title.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = category === "All" || event.category === category;
      const matchesAvailability = !availableOnly || event.attendeeCount < event.capacity;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [search, category, availableOnly]);

  const hasActiveFilters = search.trim() !== "" || category !== "All" || availableOnly;

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* Hero */}
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Welcome back, {currentUser.name}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Here&apos;s what&apos;s happening around campus this week.
          </p>

          {/* Stats banner */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-zinc-500">
                <CalendarCheck className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs">Events attended</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {currentUser.eventsAttended}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-zinc-500">
                <CalendarClock className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs">Upcoming</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">{currentUser.upcoming}</p>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <section className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-3 backdrop-blur-xl sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="w-full rounded-lg border border-white/10 bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Category select */}
            <div className="relative">
              <SlidersHorizontal
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                strokeWidth={1.75}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none rounded-lg border border-white/10 bg-zinc-900 py-2.5 pl-8 pr-8 text-sm text-zinc-100 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Available only toggle */}
            <button
              type="button"
              onClick={() => setAvailableOnly((v) => !v)}
              aria-pressed={availableOnly}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 py-2.5 pl-3 pr-3.5 text-sm text-zinc-300 transition-colors hover:border-white/20"
            >
              <span
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                  availableOnly ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    availableOnly ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
              Available only
            </button>
          </div>
        </section>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/20 px-6 py-20 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-zinc-900/60">
                <CompassIcon className="h-6 w-6 text-zinc-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-zinc-200">No events found</h3>
              <p className="mt-1.5 max-w-xs text-sm text-zinc-500">
                {hasActiveFilters
                  ? "Nothing matches your filters right now. Try widening your search."
                  : "There's nothing on the calendar yet. Check back soon."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setAvailableOnly(false);
                  }}
                  className="mt-5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}