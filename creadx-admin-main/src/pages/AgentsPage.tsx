import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Star, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../lib/api";

interface Agent {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  city: string;
  service_type: string;
  average_rating: number;
  status: string;
  commission_rate: number;
}

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    adminApi.get("/admin/agents")
      .then(res => setAgents(res.data.agents || res.data || []))
      .catch(() => setError("Failed to load agents."))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (agentId: string, status: string) => {
    setUpdating(agentId);
    try {
      await adminApi.put(`/admin/agents/${agentId}/status`, { status });
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status } : a));
    } catch {
      alert("Failed to update agent status.");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = agents.filter(a =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Agent Verification</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and manage travel agents</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]"
              placeholder="Search agents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
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
              <span className="text-sm">Loading agents...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["ID", "Agent", "City", "Service", "Rating", "Commission", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                      No agents found
                    </td>
                  </tr>
                ) : filtered.map(a => (
                  <tr key={a.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">#{a.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{a.full_name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{a.city || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{a.service_type || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        <span className="text-xs font-medium text-foreground">
                          {Number(a.average_rating ?? 0).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      {a.commission_rate ?? 10}%
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3">
                      {updating === a.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <ActionMenu actions={[
                          { label: "Approve", onClick: () => updateStatus(a.id, "approved") },
                          { label: "Suspend", onClick: () => updateStatus(a.id, "suspended") },
                          { label: "Reject", onClick: () => updateStatus(a.id, "rejected"), destructive: true },
                        ]} />
                      )}
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

export default AgentsPage;