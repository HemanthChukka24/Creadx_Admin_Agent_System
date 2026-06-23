import { useEffect, useState } from "react";
import { User, MapPin, Briefcase, Star, Loader2, Check, Pencil } from "lucide-react";
import { adminApi } from "../../lib/api";

interface Profile {
  business_name: string;
  city: string;
  service_type: string;
  average_rating: number;
  status: string;
  email?: string;
  full_name?: string;
}

const statusStyle: Record<string, string> = {
  approved:  "bg-teal-50 text-teal-700",
  pending:   "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-600",
  rejected:  "bg-red-50 text-red-600",
};

export function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");

  useEffect(() => {
    adminApi.get("/agent/profile")
      .then((res) => {
        const p = res.data.agent || res.data;
        setProfile(p);
        setBusinessName(p.business_name || "");
        setCity(p.city || "");
        setServiceType(p.service_type || "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.put("/agent/profile", {
        business_name: businessName,
        city,
        service_type: serviceType,
      });
      setProfile((prev) => prev ? { ...prev, business_name: businessName, city, service_type: serviceType } : prev);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="px-4 pt-4 pb-24">
        <h1 className="text-xl font-bold text-slate-900 mb-5">Profile</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-teal-600 font-medium active:opacity-60"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        ) : (
          <button
            onClick={() => setEditing(false)}
            className="text-sm text-slate-500 font-medium active:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Avatar + status */}
      <div className="flex flex-col items-center mb-6">
        <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center mb-3">
          <User className="h-10 w-10 text-teal-600" />
        </div>
        <p className="text-base font-bold text-slate-900">{profile.full_name || profile.business_name}</p>
        {profile.email && <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[profile.status] || "bg-slate-100 text-slate-500"}`}>
            {profile.status}
          </span>
          {profile.average_rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
              {Number(profile.average_rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 mb-4">
        {[
          { label: "Business Name", icon: Briefcase, value: businessName, setter: setBusinessName, field: "business_name" },
          { label: "City", icon: MapPin, value: city, setter: setCity, field: "city" },
          { label: "Service Type", icon: Briefcase, value: serviceType, setter: setServiceType, field: "service_type" },
        ].map(({ label, icon: Icon, value, setter }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3.5">
            <Icon className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              {editing ? (
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full text-sm text-slate-900 font-medium outline-none border-b border-teal-400 pb-0.5 bg-transparent"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-11 rounded-xl bg-teal-600 text-white text-sm font-semibold mb-3
                     active:bg-teal-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </button>
      )}

      {saved && (
        <div className="flex items-center justify-center gap-1.5 text-teal-600 text-sm font-medium mb-3">
          <Check className="h-4 w-4" /> Profile updated!
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full h-11 rounded-xl border border-red-200 text-red-500 text-sm font-semibold
                   active:bg-red-50 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}