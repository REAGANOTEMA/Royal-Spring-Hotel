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
import Unauthorized from "./pages/Unauthorized";
import RoomsDivision from "./pages/RoomsDivision";
import FoodAndBeverage from "./pages/FoodAndBeverage";
import Engineering from "./pages/Engineering";

// Supabase client
import { supabase } from "@/lib/supabase";
import { normalizeStaffLevel, canAccessPage, StaffLevel } from '@/utils/rbac';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo Mode
    const isDemo = localStorage.getItem("demoMode") === "true";
    if (isDemo) {
      setSession({ user: { email: 'demo@royalsprings.com' } });
      setLoading(false);
      return;
    }

    // Check current session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Supabase session error:", error);
        setSession(null);
      } else {
        setSession(data.session);
        if (data.session) {
          let role = data.session.user.user_metadata?.role || 'staff';
          const name = data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0];
          const email = data.session.user.email;

          if (role === 'gm') role = 'manager';
          localStorage.setItem("userRole", role);
          localStorage.setItem("userName", name || 'Staff');

          if (email) {
            const { data: staffRecord } = await supabase
              .from('staff')
              .select('department, staff_level')
              .eq('auth_email', email)
              .single();
            if (staffRecord) {
              localStorage.setItem('userDepartment', staffRecord.department || '');
              localStorage.setItem('userRole', staffRecord.staff_level || role);
            }
          }
        }
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const role = session.user.user_metadata?.role || 'staff';
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0];
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", name || 'Staff');
      } else {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
      }
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 font-bold text-blue-600">
        Loading Royal Springs...
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: StaffLevel[];
  department?: string;
}

const RoleProtectedRoute = ({ children, requiredRoles, department }: RoleProtectedRouteProps) => {
  const [checksDone, setChecksDone] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'staff';
    const userDepartment = localStorage.getItem('userDepartment') || '';
    const normalizedRole = normalizeStaffLevel(storedRole);

    const canAccess = canAccessPage(normalizedRole, requiredRoles, department, userDepartment);
    setAllowed(canAccess);
    setChecksDone(true);
  }, [requiredRoles, department]);

  if (!checksDone) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 font-bold text-blue-600">
        Verifying access rights...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

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

            {/* Private Pages */}
            <Route path="/dashboard" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff','hr','accountant']}><Dashboard /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/rooms" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff']}><Rooms /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','accountant']}><Inventory /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff']}><Bookings /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/guests" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff']}><Guests /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/finance" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','accountant']}><Finance /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/hr" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','hr','manager']}><HR /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/kitchen" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','chef']}><Kitchen /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/housekeeping" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor']}><Housekeeping /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/maintenance" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor']}><Maintenance /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/payroll" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','hr','accountant']}><Payroll /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director']}><Settings /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/job-postings" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','hr']}><JobPostings /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/incidents" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff']}><Incidents /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','accountant']}><Billing /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager']}><Reports /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff','hr','accountant']}><Messages /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/security" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director']}><Security /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/media" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager']}><Media /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor','staff','hr','accountant']}><Profile /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/accountant" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','accountant']}><Accountant /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director']}><UserManagement /></RoleProtectedRoute></PrivateRoute>} />

            {/* Department Pages */}
            <Route path="/departments/rooms" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor']} department="Rooms Division"><RoomsDivision /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/departments/food-beverage" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor']} department="Food & Beverage"><FoodAndBeverage /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/departments/engineering" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor']} department="Engineering"><Engineering /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/departments/housekeeping" element={<PrivateRoute><RoleProtectedRoute requiredRoles={['director','manager','supervisor']} department="Housekeeping"><Housekeeping /></RoleProtectedRoute></PrivateRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;