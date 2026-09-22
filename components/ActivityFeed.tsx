"use client";

import { motion } from "framer-motion";
import { CalendarPlus, LogIn, UserPlus, XCircle } from "lucide-react";

interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  type: "register" | "signup" | "login" | "cancel";
}

export interface RealActivity {
  student_id: string;
  student_name: string;
  event_name: string;
  registration_time: string;
}

interface ActivityFeedProps {
  activities?: RealActivity[];
}

const mockActivity: ActivityEntry[] = [
  { id: "a1", actor: "John Doe", action: "registered for", target: "AI Workshop", time: "12s ago", type: "register" },
  { id: "a2", actor: "Maria Chen", action: "created an account", target: "", time: "48s ago", type: "signup" },
  { id: "a3", actor: "Admin (S. Kessler)", action: "published", target: "Startup Pitch Night", time: "2m ago", type: "register" },
  { id: "a4", actor: "Devon Okafor", action: "cancelled registration for", target: "Career Fair", time: "4m ago", type: "cancel" },
  { id: "a5", actor: "Priya Nair", action: "signed in from", target: "new device", time: "6m ago", type: "login" },
  { id: "a6", actor: "Liam Torres", action: "registered for", target: "Research Symposium", time: "9m ago", type: "register" },
  { id: "a7", actor: "Ava Kim", action: "registered for", target: "Resume Review", time: "13m ago", type: "register" },
];

const typeStyles: Record<ActivityEntry["type"], { icon: typeof UserPlus; classes: string }> = {
  register: { icon: CalendarPlus, classes: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  signup: { icon: UserPlus, classes: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  login: { icon: LogIn, classes: "text-zinc-400 bg-white/5 border-white/10" },
  cancel: { icon: XCircle, classes: "text-red-400 bg-red-500/10 border-red-500/20" },
};

function formatTime(timeString: string) {
  const d = new Date(timeString);
  if (isNaN(d.getTime())) return timeString;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const feedData: ActivityEntry[] = activities 
    ? activities.map(a => ({
        id: a.student_id + a.event_name,
        actor: a.student_name,
        action: "registered for",
        target: a.event_name,
        time: formatTime(a.registration_time),
        type: "register"
      }))
    : mockActivity;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Recent Activity</h2>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <ul className="space-y-1">
        {feedData.map((entry, i) => {
          const { icon: Icon, classes } = typeStyles[entry.type];
          return (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-white/5"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${classes}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <p className="min-w-0 flex-1 truncate text-zinc-300">
                <span className="font-medium text-zinc-100">{entry.actor}</span>{" "}
                {entry.action}{" "}
                {entry.target && <span className="font-medium text-zinc-100">{entry.target}</span>}
              </p>
              <span className="shrink-0 text-xs text-zinc-600">{entry.time}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}