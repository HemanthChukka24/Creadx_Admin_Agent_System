import { Search, Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";

export function AppHeader() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 glass-panel">
      {/* Search */}
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users, bookings, agents..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative h-10 w-10 rounded-lg bg-secondary/60 border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground font-semibold flex items-center justify-center">
            5
          </span>
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="h-10 w-10 rounded-lg bg-secondary/60 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Admin avatar */}
        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-semibold text-xs">AD</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground leading-none">Admin</p>
            <p className="text-xs text-muted-foreground mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
