/**
 * Skeleton placeholder for EventCard. Dimensions are matched block-for-block
 * against the real card (see components/EventCard.tsx) so the grid doesn't
 * jump or reflow once real data replaces the skeletons:
 *   - thumbnail: h-28
 *   - body padding: p-4, gap-3
 *   - title: text-sm line
 *   - two meta rows (date, location): icon + text
 *   - footer row: attendee count (left) vs spots-left (right)
 *   - action button: py-2 / h-8
 *
 * Usage:
 *   {isLoading
 *     ? <EventCardSkeletonGrid count={8} />
 *     : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 *         {events.map((e) => <EventCard key={e.id} event={e} />)}
 *       </div>}
 */
export default function EventCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading event"
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl"
    >
      {/* Thumbnail */}
      <div className="relative h-28 w-full animate-pulse bg-zinc-800">
        {/* Category badge placeholder */}
        <div className="absolute left-3 top-3 h-5 w-16 animate-pulse rounded-full bg-zinc-700" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title (two lines, second shorter to read as wrapped text) */}
        <div className="space-y-1.5">
          <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-800" />
        </div>

        {/* Meta rows: date, location */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>

        {/* Footer row: attendee count vs spots-left */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-3 w-10 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
        </div>

        {/* Action button */}
        <div className="mt-1 h-8 w-full animate-pulse rounded-lg bg-zinc-800" />
      </div>
    </div>
  );
}

/** Convenience wrapper for rendering a full grid of skeletons while data loads. */
export function EventCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}