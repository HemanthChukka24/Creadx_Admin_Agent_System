import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const transactions = [
  { id: 1, label: "Lisbon trip commission", amount: "+$288", date: "Mar 2", type: "credit" as const },
  { id: 2, label: "Withdrawal to bank", amount: "-$500", date: "Feb 28", type: "debit" as const },
  { id: 3, label: "Dubai trip commission", amount: "+$480", date: "Feb 22", type: "credit" as const },
  { id: 4, label: "Tokyo trip commission", amount: "+$336", date: "Feb 15", type: "credit" as const },
  { id: 5, label: "Withdrawal to bank", amount: "-$400", date: "Feb 10", type: "debit" as const },
];

export function EarningsTab() {
  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-bold text-slate-900 mb-5">Earnings</h1>

      {/* Balance card */}
      <div className="bg-teal-600 rounded-2xl p-5 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Available Balance</span>
        </div>
        <p className="text-3xl font-bold mb-4">$1,204.00</p>
        <button className="w-full h-11 rounded-xl bg-white text-teal-700 text-sm font-semibold active:bg-teal-50 transition-colors">
          Withdraw to Bank
        </button>
      </div>

      {/* Transactions */}
      <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent Activity</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
              t.type === "credit" ? "bg-teal-50" : "bg-slate-100"
            }`}>
              {t.type === "credit" ? (
                <ArrowDownLeft className="h-4 w-4 text-teal-600" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{t.label}</p>
              <p className="text-xs text-slate-400">{t.date}</p>
            </div>
            <span className={`text-sm font-semibold ${
              t.type === "credit" ? "text-teal-600" : "text-slate-700"
            }`}>
              {t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
