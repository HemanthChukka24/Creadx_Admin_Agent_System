import { 
  LayoutDashboard, Users, UserCheck, MessageSquare, CalendarCheck, 
  DollarSign, HeadphonesIcon, Package, BarChart3, Settings,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Agents", url: "/agents", icon: UserCheck },
  { title: "Community Posts", url: "/posts", icon: MessageSquare },
  { title: "Bookings", url: "/bookings", icon: CalendarCheck },
  { title: "Revenue", url: "/revenue", icon: DollarSign },
  { title: "Support", url: "/support", icon: HeadphonesIcon },
  { title: "Packages", url: "/packages", icon: Package },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 glow-teal-sm">
            <span className="text-primary-foreground font-bold text-sm">TF</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground text-sm whitespace-nowrap">
              TravEase Family
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm"
            activeClassName="bg-primary/10 text-primary font-medium neon-border border"
          >
            <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
