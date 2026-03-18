"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Users, UserPlus, Clock, Award, Search, MoreVertical, Briefcase, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const HR = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  const fetchData = async () => {
    const { data: staffData } = await supabase.from('staff').select('*');
    const { data: attendData } = await supabase
      .from('check_in_logs')
      .select('*')
      .order('check_in', { ascending: false })
      .limit(10);

    setStaff(staffData || []);
    setAttendance(attendData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Human Resources</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Talent Management</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold rounded-xl shadow-lg shadow-blue-900/20">
            <UserPlus size={18} className="mr-2" /> Add Staff Member
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Users size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Staff</p>
                  <h3 className="text-2xl font-black text-slate-900">{staff.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Duty</p>
                  <h3 className="text-2xl font-black text-emerald-600">
                    {staff.filter(s => s.status === 'Active').length}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Briefcase size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Departments</p>
                  <h3 className="text-2xl font-black text-slate-900">6 Units</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl"><Award size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Performance</p>
                  <h3 className="text-2xl font-black">94% Avg</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-bold">Staff Directory</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">Staff Member</TableHead>
                      <TableHead className="font-bold">Role</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right px-8 font-bold">Salary (UGX)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-black text-xs">
                                {s.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-slate-900">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold rounded-lg">{s.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-lg",
                            s.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8 font-black text-slate-900">{s.salary}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" /> Live Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {attendance.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div>
                        <p className="font-black text-slate-900 text-sm">{log.staff_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(log.check_in).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 bg-white">Check In</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HR;