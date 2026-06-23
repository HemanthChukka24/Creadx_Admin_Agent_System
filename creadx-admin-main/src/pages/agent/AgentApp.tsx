import { useState } from "react";
import { Home, Briefcase, CalendarCheck, Wallet, UserCircle } from "lucide-react";
import { HomeTab } from "./HomeTab";
import { OffersTab } from "./OffersTab";
import { BookingsTab } from "./BookingsTab";
import { EarningsTab } from "./EarningsTab";
import { ProfileTab } from "./ProfileTab";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "offers", label: "Offers", icon: Briefcase },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "profile", label: "Profile", icon: UserCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AgentApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Status bar spacer */}
      <div className="h-12 bg-white border-b border-slate-100 flex items-center justify-center">
        <span className="text-sm font-bold text-teal-700 tracking-wide">TravEase Agent</span>
      </div>

      {/* Tab content */}
      <div className="max-w-md mx-auto">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "offers" && <OffersTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "earnings" && <EarningsTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="max-w-md mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? "text-teal-600" : "text-slate-400"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
