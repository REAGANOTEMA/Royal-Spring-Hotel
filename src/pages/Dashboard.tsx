"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStaff: 0,
    pendingIncidents: 0,
    dailyRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];

      const { count: roomsCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
      const { count: occupiedCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('status', 'Occupied');
      const { count: staffCount } = await supabase.from('staff').select('*', { count: 'exact', head: true });
      const { count: incidentCount } = await supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'Open');
      
      // Calculate Daily Revenue
      const { data: billingData } = await supabase
        .from('billing')
        .select('amount')
        .eq('date', today)
        .eq('status', 'Paid');

      const revenue = (billingData || []).reduce((acc, curr) => {
        return acc + parseFloat(curr.amount.replace(/,/g, '') || '0');
      }, 0);

      setStats({
        totalRooms: roomsCount || 0,
        occupiedRooms: occupiedCount || 0,
        totalStaff: staffCount || 0,
        pendingIncidents: incidentCount || 0,
        dailyRevenue: revenue
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Executive Dashboard</h2>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><BedDouble size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy</p>
                  <h3 className="text-2xl font-black text-slate-900">{stats.occupiedRooms}/{stats.totalRooms}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><Users size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Active</p>
                  <h3 className="text-2xl font-black text-slate-900">{stats.totalStaff}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><AlertCircle size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Incidents</p>
                  <h3 className="text-2xl font-black text-slate-900">{stats.pendingIncidents}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-blue-600 text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl"><TrendingUp size={28} /></div>
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Daily Revenue</p>
                  <h3 className="text-2xl font-black">UGX {stats.dailyRevenue.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card className="border-none shadow-sm">
               <CardHeader><CardTitle className="text-lg font-bold">Recent Activity</CardTitle></CardHeader>
               <CardContent>
                 <p className="text-slate-500 text-sm italic">Real-time activity feed connected to Supabase...</p>
               </CardContent>
             </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;