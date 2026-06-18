import { MapPin, Clock, User, ArrowRight } from "lucide-react";

interface Trip {
  id: string;
  destination: string;
  time: string;
  customer: string;
  price: number;
}

const UpcomingTripItem = ({ trip }: { trip: Trip }) => (
  <div className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm border border-border">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
      <MapPin className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-card-foreground truncate">{trip.destination}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trip.time}</span>
        <span className="flex items-center gap-1"><User className="h-3 w-3" />{trip.customer}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <p className="font-bold text-card-foreground">₹{trip.price}</p>
      <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
    </div>
  </div>
);

export default UpcomingTripItem;
export type { Trip };
