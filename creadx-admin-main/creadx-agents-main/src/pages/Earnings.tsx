import { useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee, TrendingUp, ArrowDownToLine, Wallet,
  Calendar, ChevronRight, Building2, Receipt
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dailyData = [
  { day: "Mon", amount: 1400 },
  { day: "Tue", amount: 2100 },
  { day: "Wed", amount: 1800 },
  { day: "Thu", amount: 2600 },
  { day: "Fri", amount: 1900 },
  { day: "Sat", amount: 3200 },
  { day: "Sun", amount: 1620 },
];

const weeklyData = [
  { day: "W1", amount: 9800 },
  { day: "W2", amount: 12400 },
  { day: "W3", amount: 11200 },
  { day: "W4", amount: 14600 },
];

const monthlyData = [
  { day: "Jan", amount: 42000 },
  { day: "Feb", amount: 38500 },
  { day: "Mar", amount: 14620 },
];

const payouts = [
  { id: "p1", date: "Mar 1", amount: 8400, status: "paid" as const },
  { id: "p2", date: "Feb 22", amount: 12450, status: "paid" as const },
  { id: "p3", date: "Feb 15", amount: 9800, status: "paid" as const },
  { id: "p4", date: "Feb 8", amount: 11200, status: "paid" as const },
];

const tripBreakdown = [
  { id: "c1", destination: "Mysore Palace Tour", amount: 720, base: 4800 },
  { id: "c2", destination: "Airport Transfer", amount: 120, base: 800 },
  { id: "c3", destination: "Ooty Hill Station", amount: 1275, base: 8500 },
];

type Period = "daily" | "weekly" | "monthly";

const chartData: Record<Period, typeof dailyData> = {
  daily: dailyData, weekly: weeklyData, monthly: monthlyData,
};

const EarningsPage = () => {
  const [period, setPeriod] = useState<Period>("daily");

  return (
    <div className="min-h-screen bg-background pb-[calc(var(--nav-height)+1rem)]">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-primary p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-8 translate-x-8" />
          <p className="text-primary-foreground/60 text-xs font-medium flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" /> Available Balance
          </p>
          <p className="text-4xl font-extrabold text-primary-foreground mt-1">₹14,620</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-primary-foreground/60 text-xs">
              <TrendingUp className="h-3 w-3" /> Today: ₹1,620
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/60 text-xs">
              <Calendar className="h-3 w-3" /> Week: ₹12,450
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-sm text-card-foreground">Earnings Trend</p>
            <div className="flex bg-secondary rounded-lg p-0.5">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-[11px] font-semibold capitalize rounded-md transition-all ${
                    period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData[period]}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215,12%,50%)" }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]}
                />
                <Area
                  type="monotone" dataKey="amount" stroke="hsl(168, 76%, 42%)"
                  strokeWidth={2} fill="url(#colorAmt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commission breakdown */}
        <div>
          <h2 className="font-bold text-base text-foreground mb-3">Commission Breakdown</h2>
          <div className="space-y-2">
            {tripBreakdown.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-card p-3.5 border border-border">
                <div>
                  <p className="font-semibold text-sm text-card-foreground">{t.destination}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Base: ₹{t.base.toLocaleString()}</p>
                </div>
                <span className="font-bold text-accent text-sm">+₹{t.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout history */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-foreground">Payout History</h2>
            <span className="text-xs text-accent font-semibold">View All</span>
          </div>
          <div className="space-y-2">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-card p-3.5 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">₹{p.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold capitalize bg-success/10 text-success rounded-full px-2.5 py-0.5">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax placeholder */}
        <div className="rounded-xl bg-secondary p-4 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Tax Summary</p>
            <p className="text-xs text-muted-foreground">FY 2025-26 tax report available soon</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Bank + Withdraw */}
        <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">HDFC Bank ****4521</p>
            <p className="text-xs text-muted-foreground">Primary payout account</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-accent-foreground font-bold text-base active:scale-[0.98] transition-transform">
          <ArrowDownToLine className="h-5 w-5" /> Withdraw ₹14,620
        </button>
      </div>
    </div>
  );
};

export default EarningsPage;
