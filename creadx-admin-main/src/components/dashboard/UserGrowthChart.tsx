import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Aug", users: 1200 }, { month: "Sep", users: 1800 }, { month: "Oct", users: 2400 },
  { month: "Nov", users: 3100 }, { month: "Dec", users: 3800 }, { month: "Jan", users: 4600 },
];

export function UserGrowthChart() {
  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground">User Growth</h3>
        <p className="text-xs text-muted-foreground mt-1">New registrations by month</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 22%)" />
          <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(216, 45%, 15%)",
              border: "1px solid hsl(216, 30%, 28%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210, 40%, 92%)",
            }}
          />
          <Bar dataKey="users" fill="hsl(168, 76%, 42%)" radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
