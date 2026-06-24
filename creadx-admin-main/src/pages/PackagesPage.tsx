import { DashboardLayout } from "@/components/DashboardLayout";
import { Package, Plus, DollarSign, MapPin, Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../lib/api";

interface TourPackage {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration_days: number;
  max_capacity: number;
  is_active: boolean;
  description: string;
}

const PackagesPage = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPackages = () => {
    adminApi.get("/admin/packages")
      .then(res => setPackages(res.data.packages || res.data || []))
      .catch(() => setError("Failed to load packages."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminApi.delete(`/admin/packages/${id}`);
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Failed to delete package.");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (pkg: TourPackage) => {
    try {
      await adminApi.put(`/admin/packages/${pkg.id}`, { ...pkg, is_active: !pkg.is_active });
      setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_active: !p.is_active } : p));
    } catch {
      alert("Failed to update package.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Content & Packages</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage travel packages and itineraries</p>
          </div>
          <button
            onClick={() => alert("Create package modal — coming soon!")}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" /> New Package
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading packages...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {packages.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-muted-foreground text-sm">
                No packages yet. Click "New Package" to create one.
              </div>
            ) : packages.map(pkg => (
              <div key={pkg.id} className="glass-panel rounded-xl p-5 metric-card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <button
                    onClick={() => handleToggleActive(pkg)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      pkg.is_active
                        ? "status-active hover:opacity-70"
                        : "bg-secondary text-secondary-foreground hover:opacity-70"
                    }`}
                  >
                    {pkg.is_active ? "Active" : "Inactive"}
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-foreground">{pkg.name}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {pkg.destination || "—"} · {pkg.duration_days} days
                </div>
                {pkg.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                    {Number(pkg.price ?? 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Edit "${pkg.name}" — modal coming soon!`)}
                      className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      disabled={deleting === pkg.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === pkg.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PackagesPage;