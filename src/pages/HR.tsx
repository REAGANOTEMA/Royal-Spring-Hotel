"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Users, UserPlus, Clock, Award, Search, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

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
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Human Resources</h2>
          </div>
          <Button className="bg-blue-700 font-bold">
            <UserPlus size={18} className="mr-2" /> Add Staff Member
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 font-medium">Total Staff</p>
                <h3 className="text-2xl font-bold">{staff.length}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 font-medium">On Duty</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {staff.filter(s => s.status === 'Active').length}
                </h3>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg font-bold">Staff Directory</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Salary (UGX)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-bold">{s.name}</TableCell>
                        <TableCell>{s.role}</TableCell>
                        <TableCell>
                          <Badge className={s.status === 'Active' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">{s.salary}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" /> Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {attendance.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-bold text-sm">{log.staff_name}</p>
                      <p className="text-xs text-slate-500">{new Date(log.check_in).toLocaleTimeString()}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">Check In</Badge>
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