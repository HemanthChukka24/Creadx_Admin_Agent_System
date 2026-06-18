import { Star, ShieldCheck, LogOut, ChevronRight } from "lucide-react";

export function ProfileTab() {
  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-xl font-bold text-slate-900 mb-5">Profile</h1>

      {/* Agent card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4 text-center">
        <div className="w-20 h-20 rounded-full bg-teal-100 mx-auto mb-3 flex items-center justify-center">
          <span className="text-2xl font-bold text-teal-700">MS</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Marco Silva</h2>
        <p className="text-sm text-slate-500 mt-0.5">Travel Agent · Lisbon</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-slate-900">4.8</span>
          <span className="text-xs text-slate-400">(124 reviews)</span>
        </div>
      </div>

      {/* Verification */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Verification Status</p>
            <p className="text-xs text-teal-600 font-medium">Verified Agent</p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 divide-y divide-slate-100">
        {["Account Settings", "Documents", "Help & Support"].map((item) => (
          <button
            key={item}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-slate-700 active:bg-slate-50 transition-colors"
          >
            {item}
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium active:bg-red-100 transition-colors">
        <span className="flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </span>
      </button>
    </div>
  );
}
