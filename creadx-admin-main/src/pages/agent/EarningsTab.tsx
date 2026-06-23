import { useEffect, useState } from "react";
import { Wallet, ArrowDownLeft, Loader2 } from "lucide-react";
import { adminApi } from "../../lib/api";

interface Commission {
  id: string;
  booking_id: string;
  amount: number;
  is_paid: boolean;
  created_at: string;
  package_name?: string;
  customer_name?: string;
}

interface EarningsData {
  total: number;
  paid: number;
  unpaid: number;
  commissions: Commission[];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function EarningsTab() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.get("/agent/earnings")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load earnings."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading earnings...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 pt-4 pb-24">
        <h1 className="text-xl font-bold text-slate-900 mb-5">Earnings</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error || "No earnings data found."}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-bold text-slate-900 mb-5">Earnings</h1>

      {/* Balance card */}
      <div className="bg-teal-600 rounded-2xl p-5 text-white mb-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Total Earnings</span>
        </div>
        <p className="text-3xl font-bold mb-4">${Number(data.total).toLocaleString()}</p>
        <div className="flex gap-3 text-sm">
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <p className="opacity-80 text-xs mb-1">Paid Out</p>
            <p className="font-bold">${Number(data.paid).toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
            <p className="opacity-80 text-xs mb-1">Pending</p>
            <p className="font-bold">${Number(data.unpaid).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Commission list */}
      <h2 className="text-sm font-semibold text-slate-900 mb-3">Commission History</h2>

      {data.commissions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500 text-sm">No commissions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {data.commissions.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                c.is_paid ? "bg-teal-50" : "bg-amber-50"
              }`}>
                <ArrowDownLeft className={`h-4 w-4 ${c.is_paid ? "text-teal-600" : "text-amber-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {c.package_name || c.customer_name || `Booking #${c.booking_id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-slate-400">{formatDate(c.created_at)}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-teal-600">
                  +${Number(c.amount).toLocaleString()}
                </span>
                <p className={`text-xs mt-0.5 ${c.is_paid ? "text-slate-400" : "text-amber-500 font-medium"}`}>
                  {c.is_paid ? "Paid" : "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}