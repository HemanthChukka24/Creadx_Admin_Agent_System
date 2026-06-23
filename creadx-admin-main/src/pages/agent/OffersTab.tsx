import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, DollarSign, Loader2, RefreshCw } from "lucide-react";
import { adminApi } from "../../lib/api";

interface Package {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration_days: number;
  max_capacity: number;
  description: string;
}

export function OffersTab() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());

  const fetchOffers = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");
      const res = await adminApi.get("/agent/offers");
      setPackages(res.data.packages || res.data || []);
    } catch (err: any) {
      setError("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleBook = async (pkg: Package) => {
    const customerName = prompt(`Book "${pkg.name}" — Enter customer name:`);
    if (!customerName?.trim()) return;
    const customerEmail = prompt("Customer email:") || "";
    const travelDate = prompt("Travel date (YYYY-MM-DD):") || "";

    try {
      await adminApi.post("/agent/bookings", {
        package_id: pkg.id,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: "",
        travel_date: travelDate,
        num_travellers: 1,
        total_price: pkg.price,
      });
      setBookedIds((prev) => new Set([...prev, pkg.id]));
      alert("Booking created successfully!");
    } catch {
      alert("Failed to create booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-slate-900">Available Packages</h1>
        <button
          onClick={() => fetchOffers(true)}
          disabled={refreshing}
          className="p-2 rounded-xl text-teal-600 active:bg-teal-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-5">{packages.length} packages available</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-slate-900">{pkg.name}</span>
                </div>
                <p className="text-xs text-slate-500">{pkg.destination}</p>
              </div>
              <span className="text-lg font-bold text-slate-900">${Number(pkg.price).toLocaleString()}</span>
            </div>

            {pkg.description && (
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{pkg.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {pkg.duration_days} days
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                Up to {pkg.max_capacity} guests
              </span>
            </div>

            <button
              onClick={() => handleBook(pkg)}
              disabled={bookedIds.has(pkg.id)}
              className="w-full h-10 rounded-xl bg-teal-600 text-white text-sm font-medium 
                         active:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookedIds.has(pkg.id) ? "✓ Booked" : "Book for Customer"}
            </button>
          </div>
        ))}

        {!loading && packages.length === 0 && !error && (
          <div className="text-center py-16">
            <DollarSign className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No packages available</p>
            <p className="text-slate-400 text-xs mt-1">Check back soon</p>
          </div>
        )}
      </div>
    </div>
  );
}