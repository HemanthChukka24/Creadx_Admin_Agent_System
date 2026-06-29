import { DashboardLayout } from "@/components/DashboardLayout";
import { Package, Plus, DollarSign, MapPin, Loader2, Pencil, Trash2,
         X, Upload, ChevronLeft, ChevronRight, Users, Calendar } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
  images: string[] | string;
}

// Parse images — backend returns JSON string or array
function parseImages(raw: string[] | string): string[] {
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw) || []; } catch { return []; }
}

// ─── Detail Modal ────────────────────────────────────────────
function PackageDetailModal({ pkg, onClose, onEdit }: {
  pkg: TourPackage;
  onClose: () => void;
  onEdit: () => void;
}) {
  const images = parseImages(pkg.images);
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[hsl(216,45%,12%)] border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Image carousel */}
        <div className="relative h-56 bg-secondary/40 rounded-t-2xl overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[imgIndex]}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">{pkg.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {pkg.destination}
              </div>
            </div>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${pkg.is_active ? "status-active" : "bg-secondary text-secondary-foreground"}`}>
              {pkg.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {pkg.description && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{pkg.description}</p>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: DollarSign, label: "Price", value: `$${Number(pkg.price).toLocaleString()}` },
              { icon: Calendar, label: "Duration", value: `${pkg.duration_days} days` },
              { icon: Users, label: "Capacity", value: `${pkg.max_capacity} guests` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-secondary/30 rounded-xl p-3 text-center border border-border/50">
                <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? "border-primary" : "border-transparent opacity-60"}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={onEdit}
              className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90">
              <Pencil className="h-4 w-4" /> Edit Package
            </button>
            <button onClick={onClose}
              className="h-10 px-5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Modal ─────────────────────────────────────
function PackageFormModal({ pkg, onClose, onSaved }: {
  pkg: TourPackage | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!pkg;
  const [form, setForm] = useState({
    name:          pkg?.name          ?? "",
    destination:   pkg?.destination   ?? "",
    description:   pkg?.description   ?? "",
    price:         pkg?.price         ?? "",
    duration_days: pkg?.duration_days ?? "",
    max_capacity:  pkg?.max_capacity  ?? "",
    is_active:     pkg?.is_active     ?? true,
  });
  const [images, setImages]   = useState<string[]>(pkg ? parseImages(pkg.images) : []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await adminApi.post('/admin/packages/upload-image', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        urls.push(res.data.url);
      }
      setImages(prev => [...prev, ...urls]);
    } catch {
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.destination || !form.price || !form.duration_days) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price),
        duration_days: Number(form.duration_days),
        max_capacity: Number(form.max_capacity), images };
      if (isEdit) {
        await adminApi.put(`/admin/packages/${pkg.id}`, payload);
      } else {
        await adminApi.post('/admin/packages', payload);
      }
      onSaved();
    } catch {
      setError("Failed to save package. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[hsl(216,45%,12%)] border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="text-base font-bold text-foreground">
            {isEdit ? "Edit Package" : "New Package"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Package Photos
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((url, i) => (
                <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-border group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                    className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                {uploading
                  ? <Loader2 className="h-5 w-5 animate-spin" />
                  : <><Upload className="h-4 w-4" /><span className="text-[10px] mt-1">Add</span></>
                }
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP · Max 5MB each</p>
          </div>

          {/* Form fields */}
          {[
            { key: "name",        label: "Package Name *",  type: "text",   placeholder: "e.g. Kerala Backwaters Tour" },
            { key: "destination", label: "Destination *",   type: "text",   placeholder: "e.g. Alleppey, Kerala" },
            { key: "price",       label: "Price (USD) *",   type: "number", placeholder: "e.g. 24999" },
            { key: "duration_days", label: "Duration (days) *", type: "number", placeholder: "e.g. 5" },
            { key: "max_capacity",  label: "Max Capacity",  type: "number", placeholder: "e.g. 20" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full h-9 px-3 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe this package..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => set("is_active", !form.is_active)}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.is_active ? "bg-primary" : "bg-secondary"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm text-foreground">
              {form.is_active ? "Active — visible to agents" : "Inactive — hidden from agents"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEdit ? "Save Changes" : "Create Package")}
          </button>
          <button onClick={onClose}
            className="h-10 px-5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
const PackagesPage = () => {
  const [packages, setPackages]       = useState<TourPackage[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [detailPkg, setDetailPkg]     = useState<TourPackage | null>(null);
  const [editPkg, setEditPkg]         = useState<TourPackage | null>(null);
  const [showCreate, setShowCreate]   = useState(false);

  const fetchPackages = () => {
    setLoading(true);
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

  const handleSaved = () => {
    setShowCreate(false);
    setEditPkg(null);
    setDetailPkg(null);
    fetchPackages();
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
            onClick={() => setShowCreate(true)}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> New Package
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
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
            ) : packages.map(pkg => {
              const imgs = parseImages(pkg.images);
              return (
                <div key={pkg.id} className="glass-panel rounded-xl overflow-hidden metric-card-hover">
                  {/* Card image */}
                  <div
                    className="h-36 bg-secondary/40 cursor-pointer relative overflow-hidden"
                    onClick={() => setDetailPkg(pkg)}
                  >
                    {imgs.length > 0 ? (
                      <img src={imgs[0]} alt={pkg.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                    {imgs.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                        +{imgs.length - 1} photos
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setDetailPkg(pkg)}
                      >
                        {pkg.name}
                      </h3>
                      <button
                        onClick={() => {
                          adminApi.put(`/admin/packages/${pkg.id}`, { ...pkg, images: parseImages(pkg.images), is_active: !pkg.is_active })
                            .then(() => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_active: !p.is_active } : p)))
                            .catch(() => alert("Failed to update status."));
                        }}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0 ml-2 ${
                          pkg.is_active ? "status-active hover:opacity-70" : "bg-secondary text-secondary-foreground hover:opacity-70"
                        }`}
                      >
                        {pkg.is_active ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {pkg.destination} · {pkg.duration_days} days
                    </div>

                    {pkg.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{pkg.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                        {Number(pkg.price ?? 0).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditPkg(pkg); setDetailPkg(null); }}
                          className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id, pkg.name)}
                          disabled={deleting === pkg.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === pkg.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailPkg && (
        <PackageDetailModal
          pkg={detailPkg}
          onClose={() => setDetailPkg(null)}
          onEdit={() => { setEditPkg(detailPkg); setDetailPkg(null); }}
        />
      )}

      {/* Create modal */}
      {showCreate && (
        <PackageFormModal
          pkg={null}
          onClose={() => setShowCreate(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Edit modal */}
      {editPkg && (
        <PackageFormModal
          pkg={editPkg}
          onClose={() => setEditPkg(null)}
          onSaved={handleSaved}
        />
      )}
    </DashboardLayout>
  );
};

export default PackagesPage;