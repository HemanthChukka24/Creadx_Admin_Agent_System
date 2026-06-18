import { useState } from "react";
import { MapPin, Calendar, User, DollarSign } from "lucide-react";

interface Offer {
  id: string;
  destination: string;
  dates: string;
  price: string;
  customer: string;
  details: string;
}

const initialOffers: Offer[] = [
  { id: "OF-101", destination: "Bali, Indonesia", dates: "Mar 15 – Mar 22", price: "$2,400", customer: "Sarah Chen", details: "Family trip, 4 guests" },
  { id: "OF-102", destination: "Santorini, Greece", dates: "Apr 3 – Apr 10", price: "$3,100", customer: "James Wilson", details: "Honeymoon, 2 guests" },
  { id: "OF-103", destination: "Kyoto, Japan", dates: "Apr 18 – Apr 25", price: "$2,800", customer: "Emma Davis", details: "Cultural tour, 3 guests" },
  { id: "OF-104", destination: "Marrakech, Morocco", dates: "May 1 – May 7", price: "$1,950", customer: "Raj Patel", details: "Solo adventure, 1 guest" },
];

export function OffersTab() {
  const [offers, setOffers] = useState(initialOffers);
  const [refreshing, setRefreshing] = useState(false);

  const handleAccept = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleDecline = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-bold text-slate-900 mb-1">Trip Offers</h1>
      <p className="text-sm text-slate-500 mb-5">{offers.length} pending offers</p>

      <button
        onClick={handleRefresh}
        className="w-full text-center text-sm text-teal-600 font-medium mb-4 active:opacity-60"
      >
        {refreshing ? "Refreshing..." : "↓ Pull to refresh"}
      </button>

      <div className="space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-slate-900">{offer.destination}</span>
                </div>
                <p className="text-xs text-slate-500">{offer.details}</p>
              </div>
              <span className="text-lg font-bold text-slate-900">{offer.price}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {offer.dates}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {offer.customer}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDecline(offer.id)}
                className="flex-1 h-10 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium active:bg-red-100 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => handleAccept(offer.id)}
                className="flex-1 h-10 rounded-xl bg-teal-600 text-white text-sm font-medium active:bg-teal-700 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        ))}

        {offers.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No pending offers</p>
            <p className="text-slate-400 text-xs mt-1">New offers will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
