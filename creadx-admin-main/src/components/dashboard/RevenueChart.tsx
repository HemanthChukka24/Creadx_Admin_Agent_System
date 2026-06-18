import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data7d = [
  { day: "Mon", revenue: 12400 }, { day: "Tue", revenue: 15800 }, { day: "Wed", revenue: 13200 },
  { day: "Thu", revenue: 18900 }, { day: "Fri", revenue: 21300 }, { day: "Sat", revenue: 24100 },
  { day: "Sun", revenue: 19800 },
];

const data30d = [
  { day: "W1", revenue: 78000 }, { day: "W2", revenue: 92000 }, { day: "W3", revenue: 86000 },
  { day: "W4", revenue: 110000 },
];

const data90d = [
  { day: "Jan", revenue: 240000 }, { day: "Feb", revenue: 310000 }, { day: "Mar", revenue: 380000 },
];

const ranges = { "7D": data7d, "30D": data30d, "90D": data90d };

export function RevenueChart() {
  const [range, setRange] = useState<keyof typeof ranges>("7D");

  return (
    <div className="glass-panel rounded-xl p-5 col-span-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Analytics</h3>
          <p className="text-xs text-muted-foreground mt-1">Platform revenue over time</p>
        </div>
        <div className="flex bg-secondary/60 rounded-lg p-0.5 border border-border">
          {(Object.keys(ranges) as (keyof typeof ranges)[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={ranges[range]}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 22%)" />
          <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(216, 45%, 15%)",
              border: "1px solid hsl(216, 30%, 28%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210, 40%, 92%)",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="hsl(168, 76%, 42%)" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
