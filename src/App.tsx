"use client";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast/Notification Providers */}
        <Toaster />
        <Sonner />

        {/* Browser Router */}
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book" element={<OnlineBooking />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/help" element={<Help />} />

            {/* Dashboard / App Pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/job-postings" element={<JobPostings />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/security" element={<Security />} />
            <Route path="/media" element={<Media />} />
            <Route path="/profile" element={<Profile />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;