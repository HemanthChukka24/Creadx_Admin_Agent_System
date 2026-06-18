import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  subtitle?: string;
}

export function MetricCard({ title, value, change, changeType, icon: Icon, subtitle }: MetricCardProps) {
  const changeColor = changeType === "positive" 
    ? "text-primary" 
    : changeType === "negative" 
    ? "text-destructive" 
    : "text-muted-foreground";

  return (
    <div className="glass-panel rounded-xl p-5 metric-card-hover">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${changeColor}`}>{change}</span>
            {subtitle && <span className="text-xs text-muted-foreground">· {subtitle}</span>}
          </div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
