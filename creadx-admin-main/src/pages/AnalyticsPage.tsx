import { DashboardLayout } from "@/components/DashboardLayout";
import { DollarSign, TrendingUp, Users, Globe, BarChart3, Repeat } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jul", revenue: 42000 }, { month: "Aug", revenue: 58000 }, { month: "Sep", revenue: 65000 },
  { month: "Oct", revenue: 71000 }, { month: "Nov", revenue: 82000 }, { month: "Dec", revenue: 95000 },
  { month: "Jan", revenue: 110000 },
];

const sourceData = [
  { name: "Organic Search", value: 35 },
  { name: "Social Media", value: 28 },
  { name: "Referral", value: 22 },
  { name: "Direct", value: 15 },
];

const COLORS = ["hsl(168, 76%, 42%)", "hsl(199, 89%, 48%)", "hsl(45, 93%, 47%)", "hsl(280, 67%, 55%)"];

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep dive into platform performance</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Avg. Agent Response" value="2.4h" change="-18%" changeType="positive" icon={TrendingUp} subtitle="improving" />
          <MetricCard title="Repeat Customers" value="34.2%" change="+5.1%" changeType="positive" icon={Repeat} subtitle="vs last quarter" />
          <MetricCard title="Funnel Drop-off" value="42%" change="-3.2%" changeType="positive" icon={BarChart3} subtitle="checkout step" />
          <MetricCard title="Geo Reach" value="48" change="+3" changeType="positive" icon={Globe} subtitle="countries" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Revenue trend */}
          <div className="glass-panel rounded-xl p-5 col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 22%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(216, 45%, 15%)", border: "1px solid hsl(216, 30%, 28%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 92%)" }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(168, 76%, 42%)" strokeWidth={2} fill="url(#analyticsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Acquisition sources */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Acquisition Sources</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(216, 45%, 15%)", border: "1px solid hsl(216, 30%, 28%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 92%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {sourceData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
