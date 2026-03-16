"use client";

import React from "react";
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
import { cn } from "@/lib/utils";

const revenueData = [
  { name: "Jan", value: 4500000 },
  { name: "Feb", value: 5200000 },
  { name: "Mar", value: 4800000 },
  { name: "Apr", value: 6100000 },
  { name: "May", value: 5900000 },
];

const occupancyData = [
  { name: "Standard", value: 85, color: "#3b82f6" },
  { name: "Deluxe", value: 72, color: "#10b981" },
  { name: "Suite", value: 45, color: "#f59e0b" },
];

const Reports: React.FC = () => {
  const kpis = [
    { label: "Avg. Daily Rate", value: "UGX 245k", icon: DollarSign, color: "text-blue-600" },
    { label: "Occupancy Rate", value: "78%", icon: Bed, color: "text-emerald-600" },
    { label: "Guest Satisfaction", value: "4.8/5", icon: Users, color: "text-amber-600" },
    { label: "RevPAR", value: "UGX 192k", icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Executive Reporting Suite</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold flex items-center">
              <Download size={18} className="mr-2" /> Export PDF
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold flex items-center">
              <FileText size={18} className="mr-2" /> Generate Custom Report
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* KPIs */}
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
            {/* Revenue Trend */}
            <Card className="border-none shadow-xl bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Monthly Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={{ r: 6, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Occupancy by Room Category */}
            <Card className="border-none shadow-xl bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Occupancy by Room Category (%)</CardTitle>
              </CardHeader>
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