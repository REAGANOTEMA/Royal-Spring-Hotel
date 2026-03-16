"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { 
  TrendingUp, 
  Users, 
  Bed, 
  DollarSign,
  Clock,
  Briefcase,
  LogIn,
  LogOut,
  Timer,
  Brush,
  CheckCircle2,
  UserCheck,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";

// Sample data for charts and activities
const data = [
  { name: "Mon", revenue: 4000, bookings: 24 },
  { name: "Tue", revenue: 3000, bookings: 18 },
  { name: "Wed", revenue: 2000, bookings: 15 },
  { name: "Thu", revenue: 2780, bookings: 20 },
  { name: "Fri", revenue: 1890, bookings: 12 },
  { name: "Sat", revenue: 2390, bookings: 22 },
  { name: "Sun", revenue: 3490, bookings: 28 }
];

const activities = [
  { id: 1, user: "Alice J.", action: "Checked in Guest #BK-1005", time: "2 mins ago", type: "booking" },
  { id: 2, user: "System", action: "Inventory Alert: Mineral Water Low", time: "15 mins ago", type: "alert" },
  { id: 3, user: "Bob W.", action: "Recorded Expense: UGX 120,000", time: "1 hour ago", type: "finance" },
  { id: 4, user: "Joseph B.", action: "Approved Leave for Sarah S.", time: "3 hours ago", type: "hr" }
];

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") || "staff";
    setRole(savedRole);
    const savedClockIn = localStorage.getItem("clockInTime");
    if (savedClockIn) {
      setClockInTime(savedClockIn);
      setIsClockedIn(true);
    }
  }, []);

  const handleClockAction = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    if (!isClockedIn) {
      setClockInTime(timeString);
      setIsClockedIn(true);
      localStorage.setItem("clockInTime", timeString);
      showSuccess(`Clocked in successfully at ${timeString}`);
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem("clockInTime");
      showSuccess(`Clocked out successfully at ${timeString}. Work session recorded.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {role === "director" ? "Director Control Panel" : role === "hr" ? "HR Management Hub" : "Staff Portal"}
          </h2>
          <div className="flex items-center gap-4">
            {role === "staff" && (
              <Button
                onClick={handleClockAction}
                variant={isClockedIn ? "destructive" : "default"}
                className={cn("h-9", !isClockedIn && "bg-green-600 hover:bg-green-700")}
              >
                {isClockedIn ? <LogOut size={16} className="mr-2" /> : <LogIn size={16} className="mr-2" />}
                {isClockedIn ? "Clock Out" : "Clock In"}
              </Button>
            )}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {role?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-none shadow-md bg-emerald-500 text-white">
              <p className="text-sm opacity-80">Total Revenue</p>
              <h3 className="text-2xl font-bold">UGX 12.4M</h3>
            </Card>
            <Card className="p-6 border-none shadow-md bg-indigo-500 text-white">
              <p className="text-sm opacity-80">Net Profit</p>
              <h3 className="text-2xl font-bold">UGX 7.6M</h3>
            </Card>
            <Card className="p-6 border-none shadow-md bg-blue-500 text-white">
              <p className="text-sm opacity-80">Active Staff</p>
              <h3 className="text-2xl font-bold">38 / 42</h3>
            </Card>
            <Card className="p-6 border-none shadow-md bg-slate-800 text-white">
              <p className="text-sm opacity-80">Security Status</p>
              <h3 className="text-2xl font-bold">Secure</h3>
            </Card>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 shadow-md border-none">
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Activity className="text-blue-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.map((act) => (
                    <div key={act.id} className="flex gap-3 relative">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          act.type === "booking"
                            ? "bg-green-500"
                            : act.type === "alert"
                            ? "bg-red-500"
                            : act.type === "finance"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                        )}
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{act.user}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{act.action}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-blue-600 font-bold text-xs">
                  View All Activity
                </Button>
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