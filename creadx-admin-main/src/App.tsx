import { useEffect } from "react";
import { LoginPage } from "./pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import UsersPage from "./pages/UsersPage";
import AgentsPage from "./pages/AgentsPage";
import CommunityPostsPage from "./pages/CommunityPostsPage";
import BookingsPage from "./pages/BookingsPage";
import RevenuePage from "./pages/RevenuePage";
import SupportPage from "./pages/SupportPage";
import PackagesPage from "./pages/PackagesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import AgentApp from "./pages/agent/AgentApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 🛡️ Security Guard: If token or user data is broken, BOUNCE THEM TO LOGIN!
const ProtectedRoute = ({ allowedRole }: { allowedRole?: string }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  console.log("🛡️ ProtectedRoute Check:", { token: !!token, userString });

  if (!token || !userString) {
    console.log("🚨 Missing auth credentials! Forcing redirect to /login");
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (allowedRole && user.role !== allowedRole) {
      console.log(`🚫 Role mismatch! Required: ${allowedRole}, Found: ${user.role}`);
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// 🏠 Smart Homepage Router
const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  console.log("🏠 Gatekeeper Checking LocalStorage Session:", { token: !!token, userString });

  // 🔥 FORCE REALIGNMENT: If anything is missing, force drop to login screen immediately
  if (!token || !userString) {
    console.log("🚨 No session found. Hard redirecting to /login...");
    window.location.href = "/login";
    return null; 
  }

  try {
    const user = JSON.parse(userString);
    if (user.role === "agent") {
      return <Navigate to="/agent/dashboard" replace />;
    }
  } catch (e) {
    window.location.href = "/login";
    return null;
  }

  return <Index />;
};

const App = () => {
  // 🛡️ Session Initialization Hook
  // Enforces a fresh login state ONLY when the browser window or tab is opened first time!
  useEffect(() => {
    const hasClearedThisSession = sessionStorage.getItem('session_initialized');
    
    if (!hasClearedThisSession) {
      localStorage.removeItem('token'); 
      localStorage.removeItem('user'); 
      localStorage.removeItem('userString'); // Clear residual old data keys
      
      // Lock the session state so internal route refreshes do not delete active logins
      sessionStorage.setItem('session_initialized', 'true');
      console.log("🧹 Initialized tab workspace: Active local state cleared securely.");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 🌐 1. Public Portal (Always accessible) */}
            <Route path="/login" element={<LoginPage />} />

            {/* 🏠 2. Root Gatekeeper (Redirects based on credentials) */}
            <Route path="/" element={<HomeRedirect />} />

            {/* 🔒 3. Protected Admin Group (ONLY accessible if token exists and role is admin) */}
            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/posts" element={<CommunityPostsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/revenue" element={<RevenuePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 🔒 4. Protected Agent Group */}
            <Route element={<ProtectedRoute allowedRole="agent" />}>
              <Route path="/agent/dashboard" element={<AgentApp />} />
            </Route>

            {/* 🛑 5. Fallback Error Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;