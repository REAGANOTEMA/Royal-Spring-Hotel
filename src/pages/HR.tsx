"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { UserCog, Users, Calendar, Briefcase, DollarSign, Plus, Search, AlertTriangle, FileText, CheckCircle, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const HR = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    // In a real app, we fetch from Supabase:
    // const { data } = await supabase.from('profiles').select('*');
    // For now, we simulate the state with the 10 initial staff
    const mockStaff = [
      { id: 'ST-001', name: 'Alice Johnson', role: 'Front Desk Manager', department: 'Reception', status: 'Active', salary: '1,200,000', warnings: 0, deductions: 0 },
      { id: 'ST-002', name: 'Bob Williams', role: 'Head Chef', department: 'Kitchen', status: 'Active', salary: '2,500,000', warnings: 1, deductions: 50000 },
      { id: 'ST-010', name: 'Jane Doe', role: 'General Manager', department: 'Management', status: 'Active', salary: '4,500,000', warnings: 0, deductions: 0 },
    ];
    setStaff(mockStaff);
    
    // Mock pending approvals
    setPendingApprovals([
      { id: 'temp-1', name: 'Mark Ssekandi', email: 'mark@example.com', department: 'Security' }
    ]);
    setLoading(false);
  };

  const handleApprove = (id: string, name: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    showSuccess(`Account for ${name} has been approved and activated.`);
  };

  const handleDisciplinary = (staffId: string, type: 'warning' | 'deduction') => {
    const amount = type === 'deduction' ? prompt("Enter deduction amount (UGX):") : null;
    if (type === 'deduction' && !amount) return;

    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          warnings: type === 'warning' ? s.warnings + 1 : s.warnings,
          deductions: type === 'deduction' ? s.deductions + parseInt(amount || '0') : s.deductions
        };
      }
      return s;
    }));

    showSuccess(type === 'warning' ? "Warning letter issued successfully." : `Deduction of UGX ${amount} recorded.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">HR Control Center</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <FileText size={16} className="mr-2" /> Export Payroll
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} className="mr-2" /> Add Staff
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="bg-white border mb-6">
              <TabsTrigger value="staff">Staff Directory</TabsTrigger>
              <TabsTrigger value="approvals">
                Pending Approvals 
                {pendingApprovals.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {pendingApprovals.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="disciplinary">Disciplinary</TabsTrigger>
              <TabsTrigger value="attendance">Attendance Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="staff">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Salary (UGX)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                                  {s.name.split(' ').map((n: any) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{s.name}</p>
                                <p className="text-xs text-slate-500">{s.role}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="secondary">{s.department}</Badge></TableCell>
                          <TableCell className="text-right font-bold">{s.salary}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-blue-600">Edit Profile</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals">
              {pendingApprovals.length > 0 ? (
                <Card className="border-none shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell>{p.department}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => setPendingApprovals(prev => prev.filter(x => x.id !== p.id))}>
                              Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(p.id, p.name)}>
                              Approve Account
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold">All caught up!</h3>
                  <p className="text-slate-500">No pending staff registrations to approve.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="disciplinary">
              <Card className="border-none shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead className="text-center">Warnings</TableHead>
                      <TableHead className="text-right">Total Deductions</TableHead>
                      <TableHead className="text-right">Quick Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={s.warnings > 0 ? "destructive" : "outline"}>
                            {s.warnings} Warnings
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-red-600">UGX {s.deductions.toLocaleString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" className="text-amber-600 border-amber-200" onClick={() => handleDisciplinary(s.id, 'warning')}>
                            <AlertTriangle size={14} className="mr-1" /> Issue Warning
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => handleDisciplinary(s.id, 'deduction')}>
                            <DollarSign size={14} className="mr-1" /> Deduct Salary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HR;