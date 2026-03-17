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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Users, Bed, DollarSign } from "lucide-react";
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
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Executive Reporting Suite</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold" onClick={() => window.print()}>
              <Download size={18} className="mr-2" /> Export PDF
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
              <Card key={i} className="border-none shadow-lg bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl bg-slate-50", kpi.color)}>
                    {React.createElement(kpi.icon, { size: 24 })}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                    <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl bg-white rounded-2xl">
              <CardHeader><CardTitle className="text-lg font-bold">Monthly Revenue Growth</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-2xl">
              <CardHeader><CardTitle className="text-lg font-bold">Occupancy by Room Category (%)</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Reports;