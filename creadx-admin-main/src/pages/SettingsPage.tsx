import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings as SettingsIcon, User, Shield, Bell, Globe, Palette, Database } from "lucide-react";

const sections = [
  { icon: User, title: "Profile", description: "Manage your admin profile and preferences" },
  { icon: Shield, title: "Security", description: "Two-factor authentication and sessions" },
  { icon: Bell, title: "Notifications", description: "Configure alert preferences and channels" },
  { icon: Globe, title: "Platform", description: "General platform settings and branding" },
  { icon: Palette, title: "Appearance", description: "Theme, colors, and display options" },
  { icon: Database, title: "Data & API", description: "API keys, webhooks, and integrations" },
];

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform configuration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sections.map((s) => (
            <div key={s.title} className="glass-panel rounded-xl p-5 metric-card-hover cursor-pointer">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1.5">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
