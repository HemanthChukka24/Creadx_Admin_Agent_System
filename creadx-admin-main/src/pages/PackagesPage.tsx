import { DashboardLayout } from "@/components/DashboardLayout";
import { Package, Plus, Image, DollarSign, MapPin } from "lucide-react";

const packages = [
  { name: "Bali Explorer", region: "Southeast Asia", price: "$2,400", duration: "7 days", status: "Active", bookings: 142 },
  { name: "Golden Triangle", region: "South Asia", price: "$1,800", duration: "5 days", status: "Active", bookings: 98 },
  { name: "Irish Countryside", region: "Europe", price: "$3,200", duration: "10 days", status: "Draft", bookings: 0 },
  { name: "Rome Heritage", region: "Europe", price: "$2,100", duration: "6 days", status: "Active", bookings: 76 },
  { name: "Lisbon Coastal", region: "Europe", price: "$1,950", duration: "5 days", status: "Active", bookings: 54 },
  { name: "Kyoto Traditions", region: "East Asia", price: "$2,800", duration: "8 days", status: "Paused", bookings: 23 },
];

const PackagesPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Content & Packages</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage travel packages and itineraries</p>
          </div>
          <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="h-3.5 w-3.5" /> New Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.name} className="glass-panel rounded-xl p-5 metric-card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                  pkg.status === "Active" ? "status-active" : pkg.status === "Draft" ? "bg-secondary text-secondary-foreground" : "status-pending"
                }`}>
                  {pkg.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{pkg.name}</h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {pkg.region} · {pkg.duration}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-primary" /> {pkg.price}
                </div>
                <span className="text-xs text-muted-foreground">{pkg.bookings} bookings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PackagesPage;
