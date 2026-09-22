"use client";
import { useEffect, useState } from "react";
import { CalendarCheck, Cpu, Users } from "lucide-react";
import MetricCard from "../../../components/MetricCard";
import ActivityFeed, { RealActivity } from "../../../components/ActivityFeed";

// Mock sparkline series — replace with real time-series data from the metrics API.
const registrationsTrend = [120, 132, 128, 145, 160, 158, 172, 190, 184, 205, 214, 230];
const systemLoadTrend = [42, 48, 45, 61, 58, 66, 72, 69, 75, 71, 78, 74];
const activeEventsTrend = [8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{ totalRegistrations: number; activeEvents: number; recentActivity: RealActivity[] } | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Overview</h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            A live snapshot of platform activity and system health.
          </p>
        </div>

        {/* Metric cards */}
        <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <MetricCard
            label="Total Registrations"
            value={stats ? stats.totalRegistrations.toLocaleString() : "..."}
            delta="Live"
            deltaTone="up"
            icon={Users}
            accent="blue"
            sparkline={registrationsTrend}
          />
          <MetricCard
            label="System Load"
            value="74%"
            delta="Nominal"
            deltaTone="neutral"
            icon={Cpu}
            accent="amber"
            sparkline={systemLoadTrend}
          />
          <MetricCard
            label="Active Events"
            value={stats ? stats.activeEvents.toString() : "..."}
            delta="Live"
            deltaTone="up"
            icon={CalendarCheck}
            accent="emerald"
            sparkline={activeEventsTrend}
          />
        </section>

        {/* Recent activity */}
        <section>
          <ActivityFeed activities={stats?.recentActivity} />
        </section>
      </div>
    </div>
  );
}