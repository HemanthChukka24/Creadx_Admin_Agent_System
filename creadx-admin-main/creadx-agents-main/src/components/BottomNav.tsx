import { Home, Tag, CalendarCheck, IndianRupee, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/offers", label: "Offers", icon: Tag },
  { path: "/bookings", label: "Bookings", icon: CalendarCheck },
  { path: "/earnings", label: "Earnings", icon: IndianRupee },
  { path: "/profile", label: "Profile", icon: User },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border h-[var(--nav-height)] safe-area-bottom">
      <div className="flex h-full max-w-lg mx-auto">
        {tabs.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-all duration-200 ${
                active ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </div>
              <span className={active ? "font-semibold" : ""}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
