import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Search, Filter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../lib/api";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.get("/admin/users")
      .then(res => setUsers(res.data.users || res.data || []))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
              <input
                className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading users...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    {["ID", "Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : filtered.map(u => (
                    <tr key={u.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">#{u.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{u.full_name}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 text-xs text-foreground capitalize">{u.role}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={u.is_active ? "Active" : "Suspended"} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
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
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;