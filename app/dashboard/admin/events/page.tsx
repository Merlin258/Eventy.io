"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import RowActionsMenu from "@/components/RowActionsMenu";
import DeleteEventDialog from "@/components/DeleteEventDialog";
import { useToast } from '@/components/ui/Toast';
import AdminEventModal from '@/components/AdminEventModal';
import type { EventFormData } from '@/components/AdminEventModal';

type EventStatus = "Published" | "Draft" | "Cancelled";

interface EventRow {
  id: string;
  name: string;
  date: string;
  registered: number;
  capacity: number;
  status: EventStatus;
}

const statusStyles: Record<EventStatus, string> = {
  Published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const ROWS_PER_PAGE = 6;


async function downloadAttendeeCsv(event: EventRow) {
  try {
    const res = await fetch(`/api/registrations?event_id=${event.id}`);
    const attendees = await res.json();
    
    if (!Array.isArray(attendees)) {
      throw new Error("Failed to fetch attendees");
    }

    const rows = attendees.map(a => `"${a.name}","${a.email}"`);
    const csv = ["Name,Email", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.id}-attendees.csv`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading CSV:", err);
    alert("Could not download CSV.");
  }
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<EventRow | null>(null);

  const fetchEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events.map((e: any) => ({
          id: e.id,
          name: e.title,
          date: e.date,
          registered: e.attendeeCount,
          capacity: e.capacity,
          status: 'Published' as EventStatus
        })));
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
    await fetch('/api/events', { method: 'DELETE', body: JSON.stringify({ event_id: deleteTarget.id }) });
    toast({ type: 'success', title: 'Deleted', description: 'Event deleted successfully.' });
    fetchEvents();
    setIsDeleting(false);
    setDeleteTarget(null);
  }

  async function handleModalSubmit(data: EventFormData) {
    if (modalMode === 'create') {
      await fetch('/api/events', { 
        method: 'POST', 
        body: JSON.stringify({ 
          name: data.name, 
          description: data.description, 
          category: data.category, 
          date: data.date, 
          time: data.time, 
          venue: data.venue, 
          total_seats: Number(data.capacity) 
        }) 
      });
      toast({ type: 'success', title: 'Created', description: 'Event created successfully.' });
    } else if (modalMode === 'edit' && editTarget) {
      await fetch('/api/events', { 
        method: 'PUT', 
        body: JSON.stringify({ 
          event_id: editTarget.id, 
          name: data.name,
          description: data.description, 
          category: data.category, 
          date: data.date, 
          time: data.time, 
          venue: data.venue, 
          total_seats: Number(data.capacity)
        }) 
      });
      toast({ type: 'success', title: 'Updated', description: 'Event updated successfully.' });
    }
    fetchEvents();
    setModalOpen(false);
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

          <div className="flex flex-col sm:flex-row items-center gap-4">
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
            
            <button
              onClick={() => {
                setModalMode('create');
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-indigo-500 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </button>
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
                            setModalMode('edit');
                            setEditTarget(event);
                            setModalOpen(true);
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

      <AdminEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initialData={editTarget ? { name: editTarget.name, date: editTarget.date, capacity: String(editTarget.capacity) } : undefined}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}