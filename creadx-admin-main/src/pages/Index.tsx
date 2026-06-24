import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { SystemAlerts } from "@/components/dashboard/SystemAlerts";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { 
  DollarSign, Users, UserCheck, CalendarCheck, 
  TrendingUp, Activity
} from "lucide-react";
import { adminApi } from "../lib/api";
import { useEffect, useState } from "react";

const Index = () => {
  const [backendData, setBackendData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminApi.get("/admin/metrics")
      .then(res => {
        console.log("Live Admin Backend Data:", res.data);
        setBackendData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin metrics error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Admin. Here's your platform overview.
          </p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`$${Number(backendData?.totalRevenue ?? 0).toLocaleString()}`}
            change="+12.5%"
            changeType="positive"
            icon={DollarSign}
            subtitle="vs last month"
          />
          <MetricCard
            title="Total Users"
            value={Number(backendData?.totalUsers ?? 0).toLocaleString()}
            change="+8.2%"
            changeType="positive"
            icon={Users}
            subtitle="this month"
          />
          <MetricCard
            title="Active Agents"
            value={Number(backendData?.activeAgents ?? 0).toLocaleString()}
            change="+3"
            changeType="positive"
            icon={UserCheck}
            subtitle="Current Active"
          />
          <MetricCard
            title="Bookings Count"
            value={Number(backendData?.bookingsCount ?? 0).toLocaleString()}
            change="+15.3%"
            changeType="positive"
            icon={CalendarCheck}
            subtitle="this month"
          />
          <MetricCard
            title="Conversion Rate"
            value={backendData?.conversionRate ?? "—"}
            change="-0.4%"
            changeType="negative"
            icon={TrendingUp}
            subtitle="vs last week"
          />
          <MetricCard
            title="Uptime"
            value={backendData?.uptime ?? "—"}
            change="0.00%"
            changeType="neutral"
            icon={Activity}
            subtitle="last 30 days"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <RevenueChart />
          <UserGrowthChart />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PendingApprovals />
          <SystemAlerts />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;