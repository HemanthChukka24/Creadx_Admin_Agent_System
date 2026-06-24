import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../lib/api";

interface Booking {
  id: string;
  agent_name: string;
  customer_name: string;
  destination_title: string;
  scheduled_date: string;
  travelers: number;
  status: string;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.get("/admin/bookings")
      .then(res => setBookings(res.data.bookings || res.data || []))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b =>
    b.destination_title?.toLowerCase().includes(search.toLowerCase()) ||
    b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.agent_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Bookings & Revenue</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage bookings and track revenue</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]"
                placeholder="Search bookings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
            <button
              onClick={() => {
                const csv = [
                  ["ID", "Customer", "Agent", "Destination", "Date", "Travelers", "Status"],
                  ...filtered.map(b => [b.id, b.customer_name, b.agent_name, b.destination_title, formatDate(b.scheduled_date), b.travelers, b.status])
                ].map(r => r.join(",")).join("\n");
                const a = document.createElement("a");
                a.href = "data:text/csv," + encodeURIComponent(csv);
                a.download = "bookings.csv";
                a.click();
              }}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="glass-panel rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading bookings...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["ID", "Customer", "Agent", "Destination", "Date", "Travelers", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                      No bookings found
                    </td>
                  </tr>
                ) : filtered.map(b => (
                  <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">#{b.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{b.customer_name || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{b.agent_name || "—"}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{b.destination_title || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(b.scheduled_date)}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{b.travelers}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <ActionMenu actions={[
                        { label: "View Details" },
                        { label: "Refund", destructive: true },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;