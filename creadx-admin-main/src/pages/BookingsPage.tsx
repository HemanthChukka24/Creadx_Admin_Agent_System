import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Search, Filter, Download } from "lucide-react";

const bookings = [
  { id: "BK-10421", user: "Sarah Chen", agent: "Marco Silva", package: "Bali Explorer", date: "2024-01-15", amount: "$2,400", commission: "$288", status: "Confirmed" },
  { id: "BK-10422", user: "Raj Patel", agent: "Priya Sharma", package: "Golden Triangle", date: "2024-01-16", amount: "$1,800", commission: "$180", status: "Pending" },
  { id: "BK-10423", user: "Emma Wilson", agent: "James O'Brien", package: "Irish Countryside", date: "2024-01-17", amount: "$3,200", commission: "$480", status: "Confirmed" },
  { id: "BK-10424", user: "Carlos Rodriguez", agent: "Luca Moretti", package: "Rome Heritage", date: "2024-01-18", amount: "$2,100", commission: "$252", status: "Cancelled" },
  { id: "BK-10425", user: "Yuki Tanaka", agent: "Marco Silva", package: "Lisbon Coastal", date: "2024-01-19", amount: "$1,950", commission: "$234", status: "Confirmed" },
];

const BookingsPage = () => {
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
              <input className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]" placeholder="Search bookings..." />
            </div>
            <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
            <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Booking ID", "User", "Agent", "Package", "Date", "Amount", "Commission", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{b.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{b.user}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.agent}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{b.package}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.date}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{b.amount}</td>
                  <td className="px-4 py-3 text-xs text-primary font-medium">{b.commission}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <ActionMenu actions={[
                      { label: "View Details" },
                      { label: "Payment Logs" },
                      { label: "Refund", destructive: true },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
