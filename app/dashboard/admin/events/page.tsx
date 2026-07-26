"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import RowActionsMenu from "@/components/RowActionsMenu";
import DeleteEventDialog from "@/components/DeleteEventDialog";

type EventStatus = "Published" | "Draft" | "Cancelled";

interface EventRow {
  id: string;
  name: string;
  date: string;
  registered: number;
  capacity: number;
  status: EventStatus;
}

const initialEvents: EventRow[] = [
  { id: "EVT-1001", name: "Intro to Machine Learning Workshop", date: "Aug 3, 2026", registered: 42, capacity: 50, status: "Published" },
  { id: "EVT-1002", name: "Fall Welcome Mixer", date: "Aug 5, 2026", registered: 200, capacity: 200, status: "Published" },
  { id: "EVT-1003", name: "Research Symposium: Climate Systems", date: "Aug 8, 2026", registered: 95, capacity: 120, status: "Published" },
  { id: "EVT-1004", name: "Intramural Basketball Finals", date: "Aug 9, 2026", registered: 60, capacity: 60, status: "Published" },
  { id: "EVT-1005", name: "Resume Review with Alumni", date: "Aug 11, 2026", registered: 18, capacity: 30, status: "Draft" },
  { id: "EVT-1006", name: "Startup Pitch Night", date: "Aug 14, 2026", registered: 25, capacity: 40, status: "Published" },
  { id: "EVT-1007", name: "Photography Club: Golden Hour Walk", date: "Aug 15, 2026", registered: 14, capacity: 25, status: "Draft" },
  { id: "EVT-1008", name: "Data Structures Study Jam", date: "Aug 16, 2026", registered: 22, capacity: 35, status: "Published" },
  { id: "EVT-1009", name: "Alumni Networking Night", date: "Aug 19, 2026", registered: 80, capacity: 80, status: "Published" },
  { id: "EVT-1010", name: "Spring Concert Series (cancelled)", date: "Aug 21, 2026", registered: 0, capacity: 300, status: "Cancelled" },
  { id: "EVT-1011", name: "Hackathon Kickoff", date: "Aug 23, 2026", registered: 130, capacity: 150, status: "Published" },
  { id: "EVT-1012", name: "Wellness & Mindfulness Session", date: "Aug 25, 2026", registered: 12, capacity: 40, status: "Draft" },
  { id: "EVT-1013", name: "Grad School Info Fair", date: "Aug 27, 2026", registered: 88, capacity: 100, status: "Published" },
  { id: "EVT-1014", name: "Intramural Soccer Semifinal", date: "Aug 29, 2026", registered: 48, capacity: 48, status: "Published" },
];

const statusStyles: Record<EventStatus, string> = {
  Published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const ROWS_PER_PAGE = 6;
const ATTENDEE_NAME_POOL = [
  "Alex Rivera", "Priya Nair", "John Doe", "Maria Chen", "Devon Okafor",
  "Liam Torres", "Ava Kim", "Noah Bennett", "Sofia Marin", "Ethan Brooks",
];

function downloadAttendeeCsv(event: EventRow) {
  const rows = Array.from({ length: Math.min(event.registered, 50) }, (_, i) => {
    const name = ATTENDEE_NAME_POOL[i % ATTENDEE_NAME_POOL.length];
    return `${name},${event.id}-${String(i + 1).padStart(3, "0")}@cems.edu`;
  });
  const csv = ["Name,Email", ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}-attendees.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventRow[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
    );
  }, [events, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    // Simulated API call — replace with a real delete request.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setIsDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Manage Events</h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""} total
            </p>
          </div>

          {/* Global search */}
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name or ID…"
              className="w-full rounded-lg border border-white/10 bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 ring-offset-background transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-3 font-medium">Event ID</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Capacity</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pageRows.map((event) => {
                  const isFull = event.registered >= event.capacity;
                  return (
                    <tr key={event.id} className="group transition-colors hover:bg-white/[0.03]">
                      <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-zinc-500">
                        {event.id}
                      </td>
                      <td className="max-w-xs px-5 py-3.5 font-medium text-zinc-200">
                        {event.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-zinc-400">{event.date}</td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">
                            {event.registered}/{event.capacity}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                              isFull
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {isFull ? "Full" : "Open"}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <RowActionsMenu
                          onEdit={() => {
                            // Placeholder — wire up to your edit flow (drawer, modal, or route).
                          }}
                          onExport={() => downloadAttendeeCsv(event)}
                          onDelete={() => setDeleteTarget(event)}
                        />
                      </td>
                    </tr>
                  );
                })}

                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-500">
                      No events match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3.5">
            <p className="text-xs text-zinc-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteEventDialog
        isOpen={deleteTarget !== null}
        eventName={deleteTarget?.name ?? ""}
        isSubmitting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => !isDeleting && setDeleteTarget(null)}
      />
    </div>
  );
}