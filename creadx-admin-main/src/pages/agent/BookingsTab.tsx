import { useState, useEffect } from "react";
import { MapPin, Calendar, User, ChevronRight, ArrowLeft,
         Phone, Mail, Loader2, RefreshCw, PackageOpen } from "lucide-react";
import { adminApi } from "../../lib/api";

interface Booking {
  id: string;
  package_name: string;
  destination: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  num_travellers: number;
  total_price: number;
  status: string;
  created_at: string;
}

const statusStyle: Record<string, string> = {
  confirmed:  "bg-teal-50 text-teal-700",
  requested:  "bg-amber-50 text-amber-700",
  completed:  "bg-slate-100 text-slate-500",
  cancelled:  "bg-red-50 text-red-600",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchBookings = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");
      const res = await adminApi.get("/agent/bookings");
      setBookings(res.data.bookings || res.data || []);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // — Detail view —
  if (selected) {
    return (
      <div className="px-4 pt-4 pb-24">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-teal-600 text-sm font-medium mb-4 active:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-xl font-bold text-slate-900 mb-1">{selected.package_name}</h1>
        <div className="flex items-center gap-2 mb-5">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[selected.status] || "bg-slate-100 text-slate-500"}`}>
            {selected.status}
          </span>
          <span className="text-sm text-slate-500">{formatDate(selected.travel_date)}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Customer Details</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              {selected.customer_name}
            </div>
            {selected.customer_phone && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Phone className="h-4 w-4 text-slate-400" />
                {selected.customer_phone}
              </div>
            )}
            {selected.customer_email && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Mail className="h-4 w-4 text-slate-400" />
                {selected.customer_email}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Booking Summary</h3>
          <div className="space-y-2">
            {[
              ["Travellers", `${selected.num_travellers} guest${selected.num_travellers !== 1 ? "s" : ""}`],
              ["Total Price", `$${Number(selected.total_price).toLocaleString()}`],
              ["Booked On", formatDate(selected.created_at)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // — List view —
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-slate-900">My Bookings</h1>
        <button
          onClick={() => fetchBookings(true)}
          disabled={refreshing}
          className="p-2 rounded-xl text-teal-600 active:bg-teal-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-5">{bookings.length} trips</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelected(b)}
            className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-sm active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-slate-900">{b.package_name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(b.travel_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {b.customer_name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[b.status] || "bg-slate-100 text-slate-500"}`}>
                  {b.status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        ))}

        {bookings.length === 0 && !error && (
          <div className="text-center py-16">
            <PackageOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No bookings yet</p>
            <p className="text-slate-400 text-xs mt-1">Your trips will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}