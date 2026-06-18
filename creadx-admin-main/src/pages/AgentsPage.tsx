import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Star, Search } from "lucide-react";

const agents = [
  { id: "AGT-001", name: "Marco Silva", region: "Lisbon", rating: 4.8, earnings: "$12,400", docs: "Verified", status: "Approved", complaints: 0, commission: "12%" },
  { id: "AGT-002", name: "Priya Sharma", region: "Goa", rating: 4.5, earnings: "$8,200", docs: "Pending", status: "Pending", complaints: 1, commission: "10%" },
  { id: "AGT-003", name: "James O'Brien", region: "Dublin", rating: 4.9, earnings: "$18,900", docs: "Verified", status: "Approved", complaints: 0, commission: "15%" },
  { id: "AGT-004", name: "Fatima Al-Hassan", region: "Marrakech", rating: 3.8, earnings: "$5,600", docs: "Rejected", status: "Rejected", complaints: 4, commission: "8%" },
  { id: "AGT-005", name: "Luca Moretti", region: "Rome", rating: 4.6, earnings: "$14,100", docs: "Verified", status: "Approved", complaints: 1, commission: "12%" },
];

const AgentsPage = () => {
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
            <input className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]" placeholder="Search agents..." />
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["ID", "Agent", "Region", "Rating", "Earnings", "Documents", "Commission", "Complaints", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{a.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.region}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      <span className="text-xs font-medium text-foreground">{a.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{a.earnings}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.docs} /></td>
                  <td className="px-4 py-3 text-xs text-foreground">{a.commission}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{a.complaints}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <ActionMenu actions={[
                      { label: "Approve" },
                      { label: "Verify Badge" },
                      { label: "Assign Region" },
                      { label: "Set Commission" },
                      { label: "Freeze Payouts", destructive: true },
                      { label: "Deactivate", destructive: true },
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

export default AgentsPage;
