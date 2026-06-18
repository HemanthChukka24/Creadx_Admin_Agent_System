import { AlertTriangle, Clock, FileWarning } from "lucide-react";

const alerts = [
  { icon: AlertTriangle, text: "3 agents pending document verification", time: "2m ago", severity: "warning" as const },
  { icon: FileWarning, text: "12 community posts flagged for review", time: "15m ago", severity: "error" as const },
  { icon: Clock, text: "Payment gateway latency above 2s threshold", time: "1h ago", severity: "warning" as const },
  { icon: AlertTriangle, text: "5 support tickets escalated to admin", time: "3h ago", severity: "info" as const },
];

const severityStyles = {
  warning: "text-yellow-400 bg-yellow-400/10",
  error: "text-red-400 bg-red-400/10",
  info: "text-info bg-info/10",
};

export function SystemAlerts() {
  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">System Alerts</h3>
        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all</span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${severityStyles[alert.severity]}`}>
              <alert.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-relaxed">{alert.text}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
