import { MessageSquare, UserCheck, Clock } from "lucide-react";

export function PendingApprovals() {
  return (
    <div className="glass-panel rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Pending Approvals</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Community Posts</p>
              <p className="text-[10px] text-muted-foreground">Awaiting moderation</p>
            </div>
          </div>
          <span className="text-lg font-bold text-yellow-400">24</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Agent Verifications</p>
              <p className="text-[10px] text-muted-foreground">Documents submitted</p>
            </div>
          </div>
          <span className="text-lg font-bold text-primary">8</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Support Tickets</p>
              <p className="text-[10px] text-muted-foreground">Unresolved escalated</p>
            </div>
          </div>
          <span className="text-lg font-bold text-info">5</span>
        </div>
      </div>
    </div>
  );
}
