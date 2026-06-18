import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, User, Star, Clock, Check, X, Filter,
  Map, List, Tag, AlertCircle, ChevronDown
} from "lucide-react";

interface Offer {
  id: string;
  destination: string;
  pickup: string;
  tripDates: string;
  duration: string;
  price: number;
  commission: number;
  customer: string;
  customerRating: number;
  customerTrips: number;
  passengers: number;
  distance: string;
  specialRequests?: string;
  expiresIn: string;
}

const offers: Offer[] = [
  {
    id: "o1", destination: "Mysore Palace, Mysore", pickup: "JP Nagar 5th Phase",
    tripDates: "Mar 3-4", duration: "2 days", price: 4800, commission: 720,
    customer: "Priya Sharma", customerRating: 4.9, customerTrips: 12, passengers: 4,
    distance: "143 km", specialRequests: "Child seat needed", expiresIn: "2:30",
  },
  {
    id: "o2", destination: "Ooty Hill Station", pickup: "Koramangala",
    tripDates: "Mar 5-7", duration: "3 days", price: 8500, commission: 1275,
    customer: "Vikram Patel", customerRating: 4.6, customerTrips: 5, passengers: 2,
    distance: "270 km", expiresIn: "5:15",
  },
  {
    id: "o3", destination: "Hampi Heritage Tour", pickup: "Whitefield",
    tripDates: "Mar 8-9", duration: "2 days", price: 5200, commission: 780,
    customer: "Meera Iyer", customerRating: 4.8, customerTrips: 8, passengers: 3,
    distance: "340 km", specialRequests: "Early pickup 5 AM", expiresIn: "8:00",
  },
];

const OffersPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "distance" | "date">("price");
  const [showSort, setShowSort] = useState(false);

  const activeOffers = offers.filter((o) => !dismissed.includes(o.id) && !accepted.includes(o.id));

  return (
    <div className="min-h-screen bg-background pb-[calc(var(--nav-height)+1rem)]">
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trip Offers</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{activeOffers.length} active offers</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center"
            >
              {viewMode === "list" ? <Map className="h-4 w-4 text-foreground" /> : <List className="h-4 w-4 text-foreground" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="h-9 px-3 rounded-lg bg-secondary flex items-center gap-1.5 text-xs font-medium text-foreground"
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="capitalize">{sortBy}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-11 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden min-w-[120px]">
                  {(["price", "distance", "date"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSortBy(s); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm capitalize ${
                        sortBy === s ? "bg-accent/10 text-accent font-semibold" : "text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {viewMode === "map" ? (
        <div className="mx-4 rounded-2xl bg-secondary h-64 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <Map className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Map View</p>
            <p className="text-xs">Geographical offer view coming soon</p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          <AnimatePresence>
            {activeOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-card shadow-sm border border-border overflow-hidden"
              >
                {/* Expiry header */}
                <div className="bg-warning/10 px-4 py-2 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-warning" />
                    <span className="text-xs font-semibold text-warning">{offer.tripDates} · {offer.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-destructive">
                    <Clock className="h-3 w-3" />
                    <span>{offer.expiresIn}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Route */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{offer.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="font-bold text-base text-card-foreground truncate">{offer.destination}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xl font-extrabold text-card-foreground">₹{offer.price.toLocaleString()}</p>
                      <p className="text-xs text-accent font-semibold">+₹{offer.commission} comm.</p>
                      <p className="text-[10px] text-muted-foreground">{offer.distance}</p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-3 bg-secondary rounded-lg p-2.5">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-secondary-foreground">{offer.customer}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" />{offer.customerRating}</span>
                        <span>· {offer.customerTrips} trips</span>
                        <span>· {offer.passengers} pax</span>
                      </div>
                    </div>
                  </div>

                  {/* Special requests */}
                  {offer.specialRequests && (
                    <div className="flex items-center gap-2 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 text-info shrink-0" />
                      <span className="text-info font-medium">{offer.specialRequests}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setDismissed([...dismissed, offer.id])}
                      className="flex items-center justify-center gap-2 rounded-xl bg-destructive/10 py-3.5 text-destructive font-bold text-sm active:scale-95 transition-transform"
                    >
                      <X className="h-4 w-4" /> Decline
                    </button>
                    <button
                      onClick={() => setAccepted([...accepted, offer.id])}
                      className="flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-accent-foreground font-bold text-sm active:scale-95 transition-transform"
                    >
                      <Check className="h-4 w-4" /> Accept
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeOffers.length === 0 && (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-semibold text-foreground">No active offers</p>
              <p className="text-sm text-muted-foreground mt-1">New offers will appear here in real-time</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
