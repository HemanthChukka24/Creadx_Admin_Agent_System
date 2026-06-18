import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star, ShieldCheck, FileText, Phone, Mail, LogOut, ChevronRight,
  Moon, Sun, Bell, Globe, HelpCircle, MessageSquare, Scale,
  Camera, Upload, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface Document {
  label: string;
  status: "verified" | "pending" | "expired";
  expiry?: string;
}

const documents: Document[] = [
  { label: "Driving License", status: "verified", expiry: "Dec 2026" },
  { label: "Vehicle Registration", status: "verified", expiry: "Mar 2025" },
  { label: "Insurance Certificate", status: "expired", expiry: "Feb 2025" },
  { label: "PAN Card", status: "pending" },
  { label: "Police Clearance", status: "verified" },
];

const docStatusConfig = {
  verified: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Verified" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  expired: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Expired" },
};

const ProfilePage = () => {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background pb-[calc(var(--nav-height)+1rem)]">
      {/* Profile header */}
      <div className="bg-primary px-5 pt-12 pb-8 rounded-b-[1.5rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-[72px] w-[72px] rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-accent-foreground">
              RK
            </div>
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border-2 border-primary flex items-center justify-center">
              <Camera className="h-3.5 w-3.5 text-foreground" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-primary-foreground">Rajesh Kumar</h1>
              <ShieldCheck className="h-5 w-5 text-accent" />
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/60 text-sm mt-0.5">
              <Phone className="h-3.5 w-3.5" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/60 text-sm">
              <Mail className="h-3.5 w-3.5" /> rajesh@email.com
            </div>
          </div>
        </div>

        {/* Rating + stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${s <= 4 ? "fill-warning text-warning" : s === 5 ? "text-primary-foreground/30" : ""}`}
              />
            ))}
            <span className="text-sm font-bold text-primary-foreground ml-1">4.7</span>
          </div>
          <span className="text-xs text-primary-foreground/50">342 trips · Member since 2023</span>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Trips", value: "342" },
            { label: "This Month", value: "28" },
            { label: "Completion", value: "96%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-card border border-border p-3.5 text-center"
            >
              <p className="text-xl font-extrabold text-card-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Documents */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>
            <button className="text-xs text-accent font-semibold flex items-center gap-1">
              <Upload className="h-3 w-3" /> Upload
            </button>
          </div>
          {documents.map((doc) => {
            const config = docStatusConfig[doc.status];
            const StatusIcon = config.icon;
            return (
              <div key={doc.label} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{doc.label}</p>
                    {doc.expiry && (
                      <p className="text-[10px] text-muted-foreground">Expires: {doc.expiry}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-[10px] font-semibold ${config.color} ${config.bg} rounded-full px-2 py-0.5`}>
                    <StatusIcon className="h-3 w-3" /> {config.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bank */}
        <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Scale className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">HDFC Bank ****4521</p>
            <p className="text-xs text-muted-foreground">Payout account</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Settings */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Settings</p>
          </div>
          {[
            {
              icon: theme === "dark" ? Sun : Moon,
              label: theme === "dark" ? "Light Mode" : "Dark Mode",
              action: toggle,
              trailing: (
                <div className={`h-6 w-11 rounded-full flex items-center px-0.5 transition-colors ${theme === "dark" ? "bg-accent" : "bg-border"}`}>
                  <div className={`h-5 w-5 rounded-full bg-card shadow transition-transform ${theme === "dark" ? "translate-x-5" : ""}`} />
                </div>
              ),
            },
            { icon: Bell, label: "Notifications", trailing: <ChevronRight className="h-4 w-4 text-muted-foreground" /> },
            { icon: Globe, label: "Language", extra: "English", trailing: <ChevronRight className="h-4 w-4 text-muted-foreground" /> },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 text-left"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-card-foreground">{item.label}</span>
              {item.extra && <span className="text-xs text-muted-foreground mr-1">{item.extra}</span>}
              {item.trailing}
            </button>
          ))}
        </div>

        {/* Support */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          {[
            { icon: HelpCircle, label: "Help Center" },
            { icon: MessageSquare, label: "Support Chat" },
            { icon: Star, label: "Rate App" },
            { icon: Scale, label: "Terms & Conditions" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 text-left">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-card-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-destructive/10 py-4 text-destructive font-bold text-base active:scale-[0.98] transition-transform">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
