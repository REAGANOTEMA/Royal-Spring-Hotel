"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DeleteDialog from '@/components/DeleteDialog';
import { UserCog, Plus, Trash2, Camera, FileText, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const initialStaff = [
  { id: 'ST-001', name: 'Alice Johnson', role: 'Reception', salary: '1,200,000', advance: '100,000', deduction: '50,000', net: '1,050,000', status: 'Active' },
  { id: 'ST-002', name: 'Bob Williams', role: 'Chef', salary: '2,500,000', advance: '0', deduction: '120,000', net: '2,380,000', status: 'Active' },
];

const HR = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', salary: '' });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffToAdd = {
      id: `ST-00${staff.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      salary: newStaff.salary,
      advance: '0',
      deduction: '0',
      net: newStaff.salary,
      status: 'Active'
    };
    setStaff([...staff, staffToAdd]);
    setIsAddModalOpen(false);
    showSuccess(`${newStaff.name} registered as staff.`);
    setNewStaff({ name: '', role: '', salary: '' });
  };

  const handleDelete = () => {
    setStaff(staff.filter(s => s.id !== selectedId));
    setIsDeleteModalOpen(false);
    showSuccess("Staff record deleted.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <UserCog className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">HR & Payroll</h2>
          </div>
          <Button className="bg-blue-700" onClick={() => setIsAddModalOpen(true)}><Plus size={18} className="mr-2" /> Register Staff</Button>
        </header>

        <div className="p-8">
          <Tabs defaultValue="directory" className="w-full">
            <TabsList className="bg-white border mb-6">
              <TabsTrigger value="directory">Staff Directory</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="directory">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-bold">{s.name}</TableCell>
                          <TableCell>{s.role}</TableCell>
                          <TableCell><Badge className="bg-green-100 text-green-700">{s.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(s.id); setIsDeleteModalOpen(true); }}>
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payroll">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Staff Name</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Advances</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead className="text-right">Net Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-bold">{s.name}</TableCell>
                          <TableCell>{s.salary}</TableCell>
                          <TableCell className="text-red-500">-{s.advance}</TableCell>
                          <TableCell className="text-red-500">-{s.deduction}</TableCell>
                          <TableCell className="text-right font-black text-blue-700">{s.net}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Register New Staff</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Role / Department</Label>
                <Input value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} placeholder="e.g. Front Desk" required />
              </div>
              <div className="space-y-2">
                <Label>Base Salary (UGX)</Label>
                <Input value={newStaff.salary} onChange={e => setNewStaff({...newStaff, salary: e.target.value})} required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-700">Register Staff</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
        <Footer />
      </main>
    </div>
  );
};

export default HR;