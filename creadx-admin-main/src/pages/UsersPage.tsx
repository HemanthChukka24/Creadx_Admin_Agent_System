import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Search, Filter } from "lucide-react";

const users = [
  { id: "USR-001", name: "Sarah Chen", email: "sarah@example.com", phone: "+1 555-0142", location: "San Francisco", bookings: 12, posts: 8, status: "Active" },
  { id: "USR-002", name: "Raj Patel", email: "raj@example.com", phone: "+91 98765-43210", location: "Mumbai", bookings: 5, posts: 23, status: "Active" },
  { id: "USR-003", name: "Emma Wilson", email: "emma@example.com", phone: "+44 7700-900123", location: "London", bookings: 0, posts: 2, status: "Suspended" },
  { id: "USR-004", name: "Carlos Rodriguez", email: "carlos@example.com", phone: "+52 55-1234-5678", location: "Mexico City", bookings: 8, posts: 0, status: "Active" },
  { id: "USR-005", name: "Aisha Mohammed", email: "aisha@example.com", phone: "+971 50-123-4567", location: "Dubai", bookings: 15, posts: 45, status: "Flagged" },
  { id: "USR-006", name: "Yuki Tanaka", email: "yuki@example.com", phone: "+81 90-1234-5678", location: "Tokyo", bookings: 3, posts: 12, status: "Active" },
];

const UsersPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage platform users and their accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]" placeholder="Search users..." />
            </div>
            <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["ID", "Name", "Email", "Phone", "Location", "Bookings", "Posts", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.phone}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.location}</td>
                    <td className="px-4 py-3 text-xs text-foreground font-medium">{u.bookings}</td>
                    <td className="px-4 py-3 text-xs text-foreground font-medium">{u.posts}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3">
                      <ActionMenu actions={[
                        { label: "View Activity" },
                        { label: "Reset Password" },
                        { label: "Suspend Account", destructive: true },
                        { label: "Ban User", destructive: true },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
