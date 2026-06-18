import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Search } from "lucide-react";

const tickets = [
  { id: "TKT-301", user: "Sarah Chen", agent: "Marco Silva", booking: "BK-10421", priority: "High", status: "Open", subject: "Booking date change request", created: "2h ago" },
  { id: "TKT-302", user: "Raj Patel", agent: "Priya Sharma", booking: "BK-10422", priority: "Medium", status: "Pending", subject: "Payment not reflected", created: "5h ago" },
  { id: "TKT-303", user: "Emma Wilson", agent: "—", booking: "—", priority: "Low", status: "Resolved", subject: "Account access issue", created: "1d ago" },
  { id: "TKT-304", user: "Aisha Mohammed", agent: "Fatima Al-Hassan", booking: "BK-10419", priority: "Critical", status: "Escalated", subject: "Safety concern during trip", created: "30m ago" },
  { id: "TKT-305", user: "Carlos Rodriguez", agent: "Luca Moretti", booking: "BK-10424", priority: "High", status: "Open", subject: "Refund not processed", created: "4h ago" },
];

const priorityColors: Record<string, string> = {
  Critical: "text-destructive",
  High: "text-orange-400",
  Medium: "text-yellow-400",
  Low: "text-muted-foreground",
};

const SupportPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and resolve support requests</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]" placeholder="Search tickets..." />
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Ticket ID", "Subject", "User", "Agent", "Booking", "Priority", "Status", "Created", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground max-w-[200px] truncate">{t.subject}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.user}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.agent}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.booking}</td>
                  <td className={`px-4 py-3 text-xs font-semibold ${priorityColors[t.priority]}`}>{t.priority}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.created}</td>
                  <td className="px-4 py-3">
                    <ActionMenu actions={[
                      { label: "View Details" },
                      { label: "Reassign" },
                      { label: "Add Internal Note" },
                      { label: "Escalate" },
                      { label: "Close Ticket" },
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

export default SupportPage;
