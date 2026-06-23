import { useEffect, useState } from "react";
import {
  MapPin, Star, ShieldCheck, Wallet, CalendarCheck, Tag,
  Bell, Clock, ChevronRight, Wifi, WifiOff,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface UpcomingTrip {
  id: number;
  status: string;
  scheduled_date: string;
  customer_name: string;
}

interface DashboardData {
  agentName: string;
  rating: number;
  upcomingTrips: UpcomingTrip[];
}

interface EarningsData {
  totals: {
    totalEarned: string | number;
    totalPaid: string | number;
    totalPending: string | number;
  };
}

export function HomeTab() {
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [pendingLeadsCount, setPendingLeadsCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [dashboardRes, earningsRes, bookingsRes, leadsRes] = await Promise.all([
          adminApi.get("/agent/dashboard"),
          adminApi.get("/agent/earnings"),
          adminApi.get("/agent/bookings"),
          adminApi.get("/agent/leads"),
        ]);

        if (cancelled) return;

        setDashboard(dashboardRes.data);
        setEarnings(earningsRes.data);

        const active = (bookingsRes.data || []).filter(
          (b: { status: string }) => !["completed", "cancelled"].includes(b.status)
        );
        setActiveBookingsCount(active.length);

        const pending = (leadsRes.data || []).filter(
          (l: { status: string }) => l.status === "new"
        );
        setPendingLeadsCount(pending.length);
      } catch (err) {
        if (!cancelled) setError("Couldn't load your dashboard. Pull to refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const initials = dashboard?.agentName
    ? dashboard.agentName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "—";

  if (loading) {
    return (
      <div className="px-4 pt-8 pb-24 text-center text-sm text-slate-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-teal-700 px-5 pt-6 pb-7 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-white">
                  {dashboard?.agentName || "Agent"}
                </h1>
                <ShieldCheck className="h-4 w-4 text-teal-200" />
              </div>
              <div className="flex items-center gap-1 text-teal-100/80 text-xs">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{dashboard?.rating ?? "—"} rating</span>
              </div>
            </div>
          </div>
          <button className="relative p-2.5 rounded-xl bg-white/10">
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-400" />
          </button>
        </div>

        {/* Online toggle — UI only for now, no backend status field yet */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            isOnline ? "bg-amber-400 text-slate-900" : "bg-white/10 text-white/70"
          }`}
        >
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {isOnline ? "Online — Receiving Offers" : "Offline — Tap to Go Online"}
        </button>
      </div>

      <div className="px-4 -mt-4 space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
              <Wallet className="h-4 w-4" />
            </div>
            <p className="text-base font-extrabold text-slate-900">
              ${earnings?.totals.totalEarned ?? 0}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              Total Earnings
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <p className="text-base font-extrabold text-slate-900">{activeBookingsCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              Active Bookings
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Tag className="h-4 w-4" />
            </div>
            <p className="text-base font-extrabold text-slate-900">{pendingLeadsCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              Pending Leads
            </p>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-slate-900">Upcoming Trips</h2>
            <span className="text-xs text-teal-600 font-semibold">View All</span>
          </div>
          <div className="space-y-2.5">
            {dashboard && dashboard.upcomingTrips.length > 0 ? (
              dashboard.upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200 shadow-sm"
                >
                  <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {trip.customer_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(trip.scheduled_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-teal-600 bg-teal-50 rounded-full px-2 py-0.5 shrink-0">
                    {trip.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-sm">No upcoming trips</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
