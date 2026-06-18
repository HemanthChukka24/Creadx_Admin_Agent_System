import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Navigation, Star, ShieldCheck, IndianRupee, CalendarCheck,
  Tag, Bell, Clock, ChevronRight, Wifi, WifiOff, AlertTriangle
} from "lucide-react";

const HomePage = () => {
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    { label: "Today's Earnings", value: "₹1,620", icon: IndianRupee, color: "bg-accent/10 text-accent" },
    { label: "Active Bookings", value: "3", icon: CalendarCheck, color: "bg-info/10 text-info" },
    { label: "Pending Offers", value: "2", icon: Tag, color: "bg-warning/10 text-warning" },
  ];

  const upcomingTrips = [
    { id: "1", destination: "Electronic City Drop", time: "2:30 PM", customer: "Rahul M.", price: 350, countdown: "1h 20m" },
    { id: "2", destination: "Airport Terminal 2", time: "5:00 PM", customer: "Anita K.", price: 800, countdown: "3h 50m" },
    { id: "3", destination: "Whitefield, Bangalore", time: "7:15 PM", customer: "Deepak S.", price: 450, countdown: "6h 05m" },
  ];

  const alerts = [
    { text: "Insurance expires in 5 days", type: "warning" as const },
    { text: "Payout of ₹8,400 processed", type: "success" as const },
  ];

  return (
    <div className="min-h-screen bg-background pb-[calc(var(--nav-height)+1rem)]">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-7 rounded-b-[1.5rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
              RK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-primary-foreground">Rajesh Kumar</h1>
                <ShieldCheck className="h-4 w-4 text-accent" />
              </div>
              <div className="flex items-center gap-1 text-primary-foreground/60 text-xs">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>4.7 · 342 trips</span>
              </div>
            </div>
          </div>
          <button className="relative p-2.5 rounded-xl bg-primary-foreground/10">
            <Bell className="h-5 w-5 text-primary-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>

        {/* Online toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            isOnline
              ? "bg-accent text-accent-foreground"
              : "bg-primary-foreground/10 text-primary-foreground/70"
          }`}
        >
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {isOnline ? "Online — Receiving Offers" : "Offline — Tap to Go Online"}
        </button>
      </div>

      <div className="px-4 -mt-4 space-y-5">
        {/* Notification banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-accent/10 border border-accent/20 p-3.5 flex items-center gap-3"
        >
          <div className="relative shrink-0">
            <Tag className="h-5 w-5 text-accent" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent animate-pulse-ring" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">New high-priority offer!</p>
            <p className="text-xs text-muted-foreground">Mysore Palace · ₹2,450 · 4 passengers</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-card border border-border p-3.5 text-center"
            >
              <div className={`mx-auto h-9 w-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-lg font-extrabold text-card-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-foreground">Upcoming Trips</h2>
            <span className="text-xs text-accent font-semibold">View All</span>
          </div>
          <div className="space-y-2.5">
            {upcomingTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-card-foreground truncate">{trip.destination}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{trip.time}</span>
                    <span>· {trip.customer}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-card-foreground">₹{trip.price}</p>
                  <span className="text-[10px] font-medium text-accent bg-accent/10 rounded-full px-2 py-0.5">
                    {trip.countdown}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div>
          <h2 className="font-bold text-base text-foreground mb-3">Alerts</h2>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-3.5 border ${
                  a.type === "warning"
                    ? "bg-warning/5 border-warning/20"
                    : "bg-success/5 border-success/20"
                }`}
              >
                <AlertTriangle className={`h-4 w-4 shrink-0 ${
                  a.type === "warning" ? "text-warning" : "text-success"
                }`} />
                <p className="text-sm text-foreground">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
