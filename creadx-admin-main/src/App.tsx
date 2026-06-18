import { useEffect } from "react"; 
import { adminApi } from "./lib/api";
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

// 🛡️ Safe Security Guard in src/App.tsx
const ProtectedRoute = ({ allowedRole }: { allowedRole?: string }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // If token OR user object is missing, kick them out immediately
  if (!token || !userString) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (allowedRole && user.role !== allowedRole) {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Smart homepage distributor
const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  
  if (!token || !userString) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (user.role === "agent") {
      return <Navigate to="/agent/dashboard" replace />;
    }
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Index />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Entry Portals */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomeRedirect />} />

            {/* 🛡️ Secure Admin Area: Protected by our guard layer */}
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

            {/* 💼 Secure Agent Area */}
            <Route element={<ProtectedRoute allowedRole="agent" />}>
              <Route path="/agent/dashboard" element={<AgentApp />} />
            </Route>

            {/* 🛑 Fallback Error Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;