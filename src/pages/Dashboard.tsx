"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import AdvancedVoiceConcierge, { useAdvancedVoice } from "@/components/AdvancedVoiceConcierge";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  MessageSquare,
  Receipt,
  ArrowUpRight,
  Activity,
  Clock,
  Mic
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [userName, setUserName] = useState("Executive");
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStaff: 0,
    pendingIncidents: 0,
    dailyRevenue: 0,
    occupancyRate: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [employeeOfMonth, setEmployeeOfMonth] = useState<any>(null);
  const [recentPromotions, setRecentPromotions] = useState<any[]>([]);
  const { speak } = useAdvancedVoice();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Executive';
    setUserName(name);
    
    const fetchDashboardData = async () => {
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch Stats
      const { count: roomsCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
      const { count: occupiedCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('status', 'Occupied');
      const { count: staffCount } = await supabase.from('staff').select('*', { count: 'exact', head: true });
      const { count: incidentCount } = await supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'Open');
      
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
        dailyRevenue: revenue,
        occupancyRate: roomsCount ? Math.round((occupiedCount! / roomsCount!) * 100) : 0
      });

      // 2. Fetch Recent Activity (Audit Logs)
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentLogs(logs || []);

      // 3. Fetch Employee Recognition (Employee of the Month + Promotions)
      const { data: eom } = await supabase
        .from('employee_recognition')
        .select('*')
        .eq('recognition_type', 'employee_of_month')
        .order('effective_date', { ascending: false })
        .limit(1);

      if (eom && eom.length > 0) {
        const winner = eom[0];
        const { data: winnerStaff } = await supabase
          .from('staff')
          .select('name, department, avatar_url')
          .eq('id', winner.staff_id)
          .single();

        setEmployeeOfMonth({ ...winner, staff: winnerStaff });
      } else {
        setEmployeeOfMonth(null);
      }

      const { data: promotionData } = await supabase
        .from('employee_recognition')
        .select('*')
        .eq('recognition_type', 'promotion')
        .order('effective_date', { ascending: false })
        .limit(5);

      const promotedStaffIds = (promotionData || []).map((item) => item.staff_id);
      const { data: promotedStaff } = await supabase
        .from('staff')
        .select('id, name, department, avatar_url')
        .in('id', promotedStaffIds);

      const promotionsWithStaff = (promotionData || []).map((item) => ({
        ...item,
        staff: (promotedStaff || []).find((staff) => staff.id === item.staff_id) || null,
      }));
      setRecentPromotions(promotionsWithStaff);
    };

    fetchDashboardData();
  }, []);

  const handleBriefing = () => {
    const briefingText = `Good day, ${userName}. Here is your executive briefing. Our current occupancy rate is ${stats.occupancyRate} percent, with ${stats.occupiedRooms} rooms occupied. Daily revenue has reached ${stats.dailyRevenue.toLocaleString()} shillings. There are ${stats.pendingIncidents} pending incidents requiring your attention. All ${stats.totalStaff} staff members are currently on duty.`;
    speak(briefingText);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/20">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Executive Command Center</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">Welcome back, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleBriefing}
              className="bg-slate-900 hover:bg-blue-700 text-white font-black rounded-xl h-12 px-6 flex items-center gap-2 shadow-xl"
            >
              <Mic size={18} className="text-blue-400" /> DIRECTOR'S BRIEFING
            </Button>
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">System Live</p>
              </div>
            </div>
          </div>
          <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <BedDouble size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Occupancy</p>
                  <h3 className="text-3xl font-black text-slate-900">{stats.occupancyRate}%</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{stats.occupiedRooms}/{stats.totalRooms} Rooms</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Staff Active</p>
                  <h3 className="text-3xl font-black text-slate-900">{stats.totalStaff}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 mt-1">All On-Duty</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="p-5 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Incidents</p>
                  <h3 className="text-3xl font-black text-slate-900">{stats.pendingIncidents}</h3>
                  <p className="text-[10px] font-bold text-amber-600 mt-1">Requires Attention</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-blue-700 text-white rounded-[2rem] overflow-hidden relative hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <TrendingUp size={100} />
              </div>
              <CardContent className="p-8 flex items-center gap-6 relative z-10">
                <div className="p-5 bg-white/10 rounded-2xl">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Daily Revenue</p>
                  <h3 className="text-2xl font-black">UGX {stats.dailyRevenue.toLocaleString()}</h3>
                  <p className="text-[10px] font-bold text-blue-300 mt-1">Today's Earnings</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recognition highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-blue-50 px-6 py-4">
                <CardTitle className="text-sm uppercase tracking-widest text-blue-500">Employee of the Month</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {employeeOfMonth ? (
                  <div className="space-y-4">
                    <p className="text-lg font-black text-slate-900">{employeeOfMonth.title}</p>
                    <p className="text-sm text-slate-500">{new Date(employeeOfMonth.effective_date).toLocaleDateString()}</p>
                    <div className="flex items-center gap-3">
                      <img src={employeeOfMonth.staff?.avatar_url || '/profile-placeholder.png'} alt={employeeOfMonth.staff?.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{employeeOfMonth.staff?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{employeeOfMonth.staff?.department || 'Department'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{employeeOfMonth.notes || 'Outstanding performance, teamwork, and leadership in the current month.'}</p>
                  </div>
                ) : (
                  <p className="text-slate-500">No employee of the month assigned yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-blue-50 px-6 py-4">
                <CardTitle className="text-sm uppercase tracking-widest text-blue-500">Recent Promotions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {recentPromotions.length > 0 ? (
                  recentPromotions.map((promo) => (
                    <div key={promo.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={promo.staff?.avatar_url || '/profile-placeholder.png'} alt={promo.staff?.name} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{promo.staff?.name || 'TBD'}</p>
                          <p className="text-xs text-slate-500">{promo.staff?.department || 'Department'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{promo.title}</p>
                      <p className="text-xs text-slate-500">Effective: {new Date(promo.effective_date).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-600 mt-1">{promo.notes || 'Recognition for consistent productivity and excellent conduct.'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No promotions recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 px-8 py-6">
                <CardTitle className="text-lg font-black text-slate-900">Executive Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-1 gap-4">
                <Link to="/bookings">
                  <Button className="w-full justify-between h-16 bg-slate-900 hover:bg-blue-700 text-white rounded-2xl font-black transition-all group px-6">
                    <div className="flex items-center gap-4">
                      <Plus size={24} />
                      <span className="text-sm tracking-widest">NEW RESERVATION</span>
                    </div>
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/billing">
                  <Button variant="outline" className="w-full justify-between h-16 border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-2xl font-black transition-all group px-6">
                    <div className="flex items-center gap-4">
                      <Receipt size={24} />
                      <span className="text-sm tracking-widest">GENERATE INVOICE</span>
                    </div>
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="outline" className="w-full justify-between h-16 border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-2xl font-black transition-all group px-6">
                    <div className="flex items-center gap-4">
                      <Activity size={24} />
                      <span className="text-sm tracking-widest">VIEW ANALYTICS</span>
                    </div>
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Live Activity Feed */}
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between px-8 py-6">
                <CardTitle className="text-lg font-black text-slate-900">Live Activity Feed</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time Updates</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentLogs.length > 0 ? (
                  <div className="divide-y">
                    {recentLogs.map((log) => (
                      <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                          <Clock size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-slate-900">{log.action}</p>
                            <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(log.created_at).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Performed by <span className="font-bold text-blue-600">{log.user_name}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-slate-200" />
                    </div>
                    <h4 className="text-slate-900 font-black mb-2">All Systems Operational</h4>
                    <p className="text-slate-500 text-sm max-w-xs font-medium">Your resort is running smoothly. New activities will appear here as they happen.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
      <AdvancedVoiceConcierge context="staff" userName={userName} />
    </div>
  );
};

export default Dashboard;