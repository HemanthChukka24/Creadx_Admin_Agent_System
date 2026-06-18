import { DashboardLayout } from "@/components/DashboardLayout";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyRevenue = [
  { month: "Jul", platform: 28000, commission: 8400 },
  { month: "Aug", platform: 35000, commission: 10500 },
  { month: "Sep", platform: 42000, commission: 12600 },
  { month: "Oct", platform: 51000, commission: 15300 },
  { month: "Nov", platform: 58000, commission: 17400 },
  { month: "Dec", platform: 72000, commission: 21600 },
  { month: "Jan", platform: 84000, commission: 25200 },
];

const RevenuePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div>
          <h1 className="text-xl font-bold text-foreground">Revenue</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform revenue and commission breakdown</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Gross Revenue" value="$284.5K" change="+12.5%" changeType="positive" icon={DollarSign} subtitle="this month" />
          <MetricCard title="Net Revenue" value="$199.1K" change="+10.2%" changeType="positive" icon={TrendingUp} subtitle="after costs" />
          <MetricCard title="Commission Earned" value="$85.3K" change="+15.8%" changeType="positive" icon={ArrowUpRight} subtitle="agent payouts" />
          <MetricCard title="Refunds" value="$3.2K" change="-22%" changeType="positive" icon={ArrowDownRight} subtitle="decreasing" />
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue vs Commission</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 22%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(216, 45%, 15%)", border: "1px solid hsl(216, 30%, 28%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 92%)" }} />
              <Area type="monotone" dataKey="platform" stroke="hsl(168, 76%, 42%)" strokeWidth={2} fill="url(#platGrad)" name="Platform Revenue" />
              <Area type="monotone" dataKey="commission" stroke="hsl(199, 89%, 48%)" strokeWidth={2} fill="url(#commGrad)" name="Commission" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RevenuePage;
