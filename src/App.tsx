"use client";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Inventory from "./pages/Inventory";
import Bookings from "./pages/Bookings";
import Guests from "./pages/Guests";
import Finance from "./pages/Finance";
import HR from "./pages/HR";
import Incidents from "./pages/Incidents";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import OnlineBooking from "./pages/OnlineBooking";
import Help from "./pages/Help";
import JobPostings from "./pages/JobPostings";
import Careers from "./pages/Careers";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import Security from "./pages/Security";
import Media from "./pages/Media";
import Profile from "./pages/Profile";
import Accountant from "./pages/Accountant";
import UserManagement from "./pages/UserManagement";
import Kitchen from "./pages/Kitchen";
import Housekeeping from "./pages/Housekeeping";
import Maintenance from "./pages/Maintenance";
import Payroll from "./pages/Payroll";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Supabase client
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Demo Mode first
    const isDemo = localStorage.getItem("demoMode") === "true";
    if (isDemo) {
      setSession({ user: { email: 'demo@royalsprings.com' } });
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const role = session.user.user_metadata?.role || 'staff';
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0];
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", name || 'Staff');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50 font-bold text-blue-600">Loading Royal Springs...</div>;
  if (!session) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book" element={<OnlineBooking />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<Help />} />

            {/* Private / App Pages */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
            <Route path="/guests" element={<PrivateRoute><Guests /></PrivateRoute>} />
            <Route path="/finance" element={<PrivateRoute><Finance /></PrivateRoute>} />
            <Route path="/hr" element={<PrivateRoute><HR /></PrivateRoute>} />
            <Route path="/kitchen" element={<PrivateRoute><Kitchen /></PrivateRoute>} />
            <Route path="/housekeeping" element={<PrivateRoute><Housekeeping /></PrivateRoute>} />
            <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
            <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/job-postings" element={<PrivateRoute><JobPostings /></PrivateRoute>} />
            <Route path="/incidents" element={<PrivateRoute><Incidents /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/security" element={<PrivateRoute><Security /></PrivateRoute>} />
            <Route path="/media" element={<PrivateRoute><Media /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/accountant" element={<PrivateRoute><Accountant /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;