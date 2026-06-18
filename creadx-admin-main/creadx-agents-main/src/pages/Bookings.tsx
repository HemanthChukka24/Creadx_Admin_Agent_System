import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, User, Phone, MessageCircle, Navigation, ChevronDown,
  ChevronUp, Play, CheckCircle2, AlertTriangle, ExternalLink
} from "lucide-react";

type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface Booking {
  id: string;
  title: string;
  destination: string;
  dates: string;
  time: string;
  customer: string;
  phone: string;
  status: BookingStatus;
  price: number;
  paymentStatus: "paid" | "pending" | "partial";
  itinerary: string[];
  specialRequirements?: string;
}

const bookings: Booking[] = [
  {
    id: "b1", title: "Mysore Heritage Tour", destination: "Mysore Palace, Mysore",
    dates: "Mar 3-4", time: "8:00 AM", customer: "Priya Sharma", phone: "+91 98765 43210",
    status: "upcoming", price: 4800, paymentStatus: "paid",
    itinerary: ["Pickup from JP Nagar", "Mysore Palace visit", "Brindavan Gardens", "Drop back"],
    specialRequirements: "Child seat needed",
  },
  {
    id: "b2", title: "Airport Transfer", destination: "Airport Terminal 2",
    dates: "Today", time: "5:00 PM", customer: "Anita K.", phone: "+91 91234 56789",
    status: "ongoing", price: 800, paymentStatus: "pending",
    itinerary: ["Pickup from Electronic City", "Drop at Terminal 2"],
  },
  {
    id: "b3", title: "City Tour", destination: "Whitefield, Bangalore",
    dates: "Today", time: "7:15 PM", customer: "Deepak S.", phone: "+91 87654 32100",
    status: "upcoming", price: 450, paymentStatus: "partial",
    itinerary: ["Pickup from MG Road", "Whitefield office complex", "Return drop"],
  },
  {
    id: "b4", title: "Weekend Getaway", destination: "Ooty Hill Station",
    dates: "Feb 28 - Mar 1", time: "6:00 AM", customer: "Vikram P.", phone: "+91 99887 76655",
    status: "completed", price: 7200, paymentStatus: "paid",
    itinerary: ["Bangalore to Ooty", "Local sightseeing", "Return trip"],
  },
  {
    id: "b5", title: "Office Commute", destination: "HSR Layout", dates: "Feb 27",
    time: "9:00 AM", customer: "Sneha R.", phone: "+91 77665 54433",
    status: "cancelled", price: 320, paymentStatus: "pending",
    itinerary: ["Pickup from Jayanagar", "Drop at HSR Layout"],
  },
];

const tabs: BookingStatus[] = ["upcoming", "ongoing", "completed", "cancelled"];

const statusColors: Record<BookingStatus, string> = {
  upcoming: "bg-info/10 text-info",
  ongoing: "bg-accent/10 text-accent",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const paymentColors: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  partial: "bg-info/10 text-info",
};

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState<BookingStatus>("upcoming");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = bookings.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-background pb-[calc(var(--nav-height)+1rem)]">
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your trips</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-secondary rounded-xl p-1 gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold capitalize rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3">
        <AnimatePresence mode="wait">
          {filtered.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-card-foreground truncate">{b.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{b.destination}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${paymentColors[b.paymentStatus]}`}>
                      {b.paymentStatus}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.dates}, {b.time}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{b.customer}</span>
                  </div>
                  <span className="font-bold text-card-foreground">₹{b.price.toLocaleString()}</span>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-accent/10 py-2 text-xs font-semibold text-accent">
                    <MessageCircle className="h-3.5 w-3.5" /> Chat
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-2 text-xs font-semibold text-secondary-foreground">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </button>
                  {b.status === "upcoming" && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-xs font-semibold text-accent-foreground">
                      <Play className="h-3.5 w-3.5" /> Start
                    </button>
                  )}
                  {b.status === "ongoing" && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-success py-2 text-xs font-semibold text-success-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                    </button>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                    className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"
                  >
                    {expanded === b.id ? <ChevronUp className="h-4 w-4 text-foreground" /> : <ChevronDown className="h-4 w-4 text-foreground" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expanded === b.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Itinerary</p>
                        <div className="space-y-1.5">
                          {b.itinerary.map((stop, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-card-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                              {stop}
                            </div>
                          ))}
                        </div>
                      </div>
                      {b.specialRequirements && (
                        <div className="flex items-center gap-2 bg-warning/5 rounded-lg p-2.5 text-xs">
                          <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                          <span className="text-foreground">{b.specialRequirements}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-2.5 text-xs font-semibold text-secondary-foreground">
                          <Navigation className="h-3.5 w-3.5" /> Navigate
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-2.5 text-xs font-semibold text-secondary-foreground">
                          <AlertTriangle className="h-3.5 w-3.5" /> Report Issue
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold text-foreground">No {activeTab} bookings</p>
            <p className="text-sm text-muted-foreground mt-1">Check other tabs or wait for new trips</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
