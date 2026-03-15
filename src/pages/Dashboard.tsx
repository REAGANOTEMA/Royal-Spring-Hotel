"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { 
  TrendingUp, 
  Users, 
  Bed, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  Briefcase,
  LogIn,
  LogOut,
  Timer,
  Brush
} from 'lucide-react';
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
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 18 },
  { name: 'Wed', revenue: 2000, bookings: 15 },
  { name: 'Thu', revenue: 2780, bookings: 20 },
  { name: 'Fri', revenue: 1890, bookings: 12 },
  { name: 'Sat', revenue: 2390, bookings: 22 },
  { name: 'Sun', revenue: 3490, bookings: 28 },
];

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'staff';
    setRole(savedRole);
    const savedClockIn = localStorage.getItem('clockInTime');
    if (savedClockIn) {
      setClockInTime(savedClockIn);
      setIsClockedIn(true);
    }
  }, []);

  const handleClockAction = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    if (!isClockedIn) {
      setClockInTime(timeString);
      setIsClockedIn(true);
      localStorage.setItem('clockInTime', timeString);
      showSuccess(`Clocked in successfully at ${timeString}`);
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('clockInTime');
      showSuccess(`Clocked out successfully at ${timeString}. Work session recorded.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {role === 'director' ? 'Director Control Panel' : 
             role === 'hr' ? 'HR Management Hub' : 'Staff Portal'}
          </h2>
          <div className="flex items-center gap-4">
            {role === 'staff' && (
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
          {/* Staff Attendance Monitor */}
          {role === 'staff' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", isClockedIn ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400")}>
                    <Timer size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Current Status</p>
                    <h3 className="text-xl font-bold">{isClockedIn ? "On Duty" : "Off Duty"}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Clock size={24} /></div>
                  <div><p className="text-sm text-slate-500">Clocked In At</p><h3 className="text-xl font-bold">{clockInTime || "--:--"}</h3></div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Briefcase size={24} /></div>
                  <div><p className="text-sm text-slate-500">Total Hours (This Week)</p><h3 className="text-xl font-bold">38h 45m</h3></div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stats Grid for Management */}
          {(role === 'director' || role === 'general_manager') && (
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
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Housekeeping Tasks for Staff */}
            {role === 'staff' && (
              <Card className="shadow-md border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Rooms Needing Cleaning</CardTitle>
                  <Brush className="text-amber-500" size={20} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: '103', type: 'Standard', floor: '1st Floor' },
                      { id: '201', type: 'Deluxe', floor: '2nd Floor' },
                      { id: '205', type: 'Standard', floor: '2nd Floor' },
                    ].map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-100">
                        <div>
                          <p className="font-bold text-slate-800">Room {room.id}</p>
                          <p className="text-xs text-slate-500">{room.type} • {room.floor}</p>
                        </div>
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Mark Clean</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-md border-none">
              <CardHeader><CardTitle className="text-lg">Performance Overview</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
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
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;