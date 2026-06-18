import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActionMenu } from "@/components/ActionMenu";
import { Search, Filter, Eye, Heart, MessageCircle, Bot } from "lucide-react";

const posts = [
  { id: "PST-001", user: "Sarah Chen", location: "Bali, Indonesia", engagement: { views: 1240, likes: 89, comments: 12 }, reports: 0, status: "Approved", ai: false, image: "🏝️" },
  { id: "PST-002", user: "Raj Patel", location: "Jaipur, India", engagement: { views: 890, likes: 56, comments: 8 }, reports: 3, status: "Flagged", ai: true, image: "🏰" },
  { id: "PST-003", user: "Aisha Mohammed", location: "Santorini, Greece", engagement: { views: 3200, likes: 245, comments: 34 }, reports: 0, status: "Approved", ai: false, image: "🌅" },
  { id: "PST-004", user: "Carlos Rodriguez", location: "Cancún, Mexico", engagement: { views: 560, likes: 23, comments: 2 }, reports: 1, status: "Pending", ai: true, image: "🏖️" },
  { id: "PST-005", user: "Yuki Tanaka", location: "Kyoto, Japan", engagement: { views: 1800, likes: 134, comments: 19 }, reports: 0, status: "Approved", ai: false, image: "⛩️" },
];

const CommunityPostsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Community Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">Moderate and manage user content</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input className="h-9 pl-9 pr-4 rounded-lg bg-secondary/60 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-[220px]" placeholder="Search posts..." />
            </div>
            <button className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["", "Post ID", "Posted By", "Location", "Engagement", "Reports", "AI", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/60 border border-border flex items-center justify-center text-lg">
                      {p.image}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{p.user}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.engagement.views}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{p.engagement.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{p.engagement.comments}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{p.reports > 0 ? <span className="text-destructive">{p.reports}</span> : "0"}</td>
                  <td className="px-4 py-3">
                    {p.ai && <Bot className="h-4 w-4 text-primary" />}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <ActionMenu actions={[
                      { label: "Approve" },
                      { label: "Edit Location" },
                      { label: "Disable Comments" },
                      { label: "Soft Delete", destructive: true },
                      { label: "Shadow Ban", destructive: true },
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

export default CommunityPostsPage;
