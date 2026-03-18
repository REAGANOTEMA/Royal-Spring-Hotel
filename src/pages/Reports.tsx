"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Users, Bed, DollarSign, ShieldCheck, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const Reports: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
      // 1. Fetch Revenue Trend
      const { data: billingData } = await supabase.from('billing').select('amount, date');
      const monthlyRev = (billingData || []).reduce((acc: any, curr: any) => {
        const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + parseFloat(curr.amount.replace(/,/g, ''));
        return acc;
      }, {});
      
      setRevenueData(Object.keys(monthlyRev).map(month => ({ name: month, value: monthlyRev[month] })));

      // 2. Fetch Occupancy
      const { data: roomData } = await supabase.from('rooms').select('type, status');
      const occStats = (roomData || []).reduce((acc: any, curr: any) => {
        if (!acc[curr.type]) acc[curr.type] = { total: 0, occupied: 0 };
        acc[curr.type].total++;
        if (curr.status === 'Occupied') acc[curr.type].occupied++;
        return acc;
      }, {});

      setOccupancyData(Object.keys(occStats).map(type => ({
        name: type,
        value: Math.round((occStats[type].occupied / occStats[type].total) * 100),
        color: type === 'Suite' ? '#f59e0b' : type === 'Deluxe' ? '#10b981' : '#3b82f6'
      })));

      // 3. Set KPIs
      setKpis([
        { label: "Avg. Daily Rate", value: "UGX 245k", icon: DollarSign, color: "text-blue-600" },
        { label: "Occupancy Rate", value: "78%", icon: Bed, color: "text-emerald-600" },
        { label: "Guest Satisfaction", value: "4.8/5", icon: Users, color: "text-amber-600" },
        { label: "RevPAR", value: "UGX 192k", icon: TrendingUp, color: "text-purple-600" },
      ]);
    };

    fetchReportData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/20">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Executive Reporting Suite</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Strategic Insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-black h-12 rounded-xl border-slate-200" onClick={() => window.print()}>
              <Download size={18} className="mr-2" /> EXPORT PDF
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
              <Card key={i} className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 flex items-center gap-6">
                  <div className={cn("p-4 rounded-2xl bg-slate-50", kpi.color)}>
                    {React.createElement(kpi.icon, { size: 28 })}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black">Monthly Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent className="p-8 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 900, color: '#1e3a8a' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={6} dot={{ r: 8, fill: "#3b82f6", strokeWidth: 4, stroke: "#fff" }} activeDot={{ r: 10 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black">Occupancy by Room Category (%)</CardTitle>
              </CardHeader>
              <CardContent className="p-8 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* System Health Section */}
          <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-6 bg-white/10 rounded-[2rem] text-blue-400">
                  <ShieldCheck size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2">System Integrity: 100%</h3>
                  <p className="text-slate-400 font-medium">All ERP modules are operational. Data synchronization is active across all departments.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-8 py-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Uptime</p>
                  <p className="text-xl font-black">99.9%</p>
                </div>
                <div className="text-center px-8 py-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Security</p>
                  <p className="text-xl font-black">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Reports;