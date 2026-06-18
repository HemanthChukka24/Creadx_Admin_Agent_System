import { useState } from "react";
import { MapPin, Calendar, User, ChevronRight, ArrowLeft, Phone, Mail, Clock } from "lucide-react";

interface Booking {
  id: string;
  destination: string;
  dates: string;
  customer: string;
  phone: string;
  email: string;
  status: "Upcoming" | "Completed";
  itinerary: string[];
}

const bookings: Booking[] = [
  { id: "BK-201", destination: "Lisbon, Portugal", dates: "Mar 5 – Mar 12", customer: "Yuki Tanaka", phone: "+1 555-0123", email: "yuki@email.com", status: "Upcoming", itinerary: ["Day 1: Alfama walking tour", "Day 2: Sintra day trip", "Day 3: Belém & pastéis", "Day 4-7: Free exploration"] },
  { id: "BK-202", destination: "Dubai, UAE", dates: "Feb 20 – Feb 26", customer: "Carlos Rodriguez", phone: "+1 555-0456", email: "carlos@email.com", status: "Upcoming", itinerary: ["Day 1: Desert safari", "Day 2: Burj Khalifa & Dubai Mall", "Day 3: Old Dubai & souks", "Day 4-6: Beach & leisure"] },
  { id: "BK-203", destination: "Tokyo, Japan", dates: "Jan 10 – Jan 18", customer: "Lisa Park", phone: "+1 555-0789", email: "lisa@email.com", status: "Completed", itinerary: ["Day 1: Shibuya & Harajuku", "Day 2: Asakusa & Senso-ji", "Day 3: Mt. Fuji day trip", "Day 4-8: Kyoto excursion"] },
];

export function BookingsTab() {
  const [selected, setSelected] = useState<Booking | null>(null);

  if (selected) {
    return (
      <div className="px-4 pt-4 pb-24">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-teal-600 text-sm font-medium mb-4 active:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-xl font-bold text-slate-900 mb-1">{selected.destination}</h1>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
          <Calendar className="h-3.5 w-3.5" />
          {selected.dates}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Customer</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              {selected.customer}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Phone className="h-4 w-4 text-slate-400" />
              {selected.phone}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" />
              {selected.email}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Itinerary</h3>
          <div className="space-y-2.5">
            {selected.itinerary.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-bold text-slate-900 mb-1">My Bookings</h1>
      <p className="text-sm text-slate-500 mb-5">{bookings.length} trips</p>

      <div className="space-y-3">
        {bookings.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelected(b)}
            className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-sm active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-slate-900">{b.destination}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {b.dates}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {b.customer}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  b.status === "Upcoming"
                    ? "bg-teal-50 text-teal-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {b.status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
