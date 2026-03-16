"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { UserCog, Plus, Search, FileText, CheckCircle, Camera, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const HR = () => {
  const [staff, setStaff] = useState<any[]>([
    { id: 'ST-001', name: 'Alice Johnson', role: 'Front Desk Manager', department: 'Reception', status: 'Active', salary: '1,200,000', image: null },
    { id: 'ST-002', name: 'Bob Williams', role: 'Head Chef', department: 'Kitchen', status: 'Active', salary: '2,500,000', image: null },
    { id: 'ST-010', name: 'Joseph Byabazaire', role: 'Director', department: 'Management', status: 'Active', salary: 'N/A', image: null },
  ]);

  const handleImageUpload = (id: string) => {
    showSuccess("Profile image uploaded successfully!");
    // In a real app, this would handle file input and Supabase storage
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">HR Control Center</h2>
          <div className="flex gap-3">
            <Button variant="outline" className="font-bold border-slate-200">
              <FileText size={18} className="mr-2" /> Export Payroll
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold">
              <Plus size={18} className="mr-2" /> Add New Staff
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="bg-white border p-1 rounded-xl mb-8">
              <TabsTrigger value="staff" className="rounded-lg font-bold">Staff Directory</TabsTrigger>
              <TabsTrigger value="approvals" className="rounded-lg font-bold">Pending Approvals</TabsTrigger>
              <TabsTrigger value="disciplinary" className="rounded-lg font-bold">Disciplinary</TabsTrigger>
            </TabsList>

            <TabsContent value="staff">
              <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
                <CardHeader className="border-b px-8 py-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">Active Staff Members</CardTitle>
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input className="pl-10 h-11 bg-slate-50 border-none" placeholder="Search staff..." />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="px-8 font-bold">Staff Member</TableHead>
                        <TableHead className="font-bold">Department</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="text-right font-bold">Salary (UGX)</TableHead>
                        <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((s) => (
                        <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="px-8">
                            <div className="flex items-center gap-4">
                              <div className="relative group">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                  <AvatarImage src={s.image} />
                                  <AvatarFallback className="bg-blue-700 text-white font-bold">
                                    {s.name.split(' ').map((n: any) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <button 
                                  onClick={() => handleImageUpload(s.id)}
                                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Camera size={16} className="text-white" />
                                </button>
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{s.name}</p>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{s.role}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold">{s.department}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 font-bold rounded-full px-3 py-1">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right font-black text-slate-900">{s.salary}</TableCell>
                          <TableCell className="text-right px-8">
                            <Button variant="ghost" size="sm" className="text-blue-700 font-bold hover:bg-blue-50">Edit Profile</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
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