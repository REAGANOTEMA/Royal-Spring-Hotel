"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import ReportIncidentModal from '@/components/ReportIncidentModal';
import { AlertCircle, Search, Plus, Filter, MessageSquare, Wrench, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const incidentsData = [
  { id: 'INC-001', type: 'Damage', description: 'Broken TV screen in Room 204', reportedBy: 'Housekeeping', date: '2024-05-24', priority: 'High', status: 'Open' },
  { id: 'INC-002', type: 'Maintenance', description: 'AC leaking in Room 105', reportedBy: 'Guest', date: '2024-05-23', priority: 'Medium', status: 'In Progress' },
  { id: 'INC-003', type: 'Security', description: 'Lost key card reported', reportedBy: 'Front Desk', date: '2024-05-22', priority: 'Low', status: 'Resolved' },
  { id: 'INC-004', type: 'Damage', description: 'Stained carpet in Suite 301', reportedBy: 'Housekeeping', date: '2024-05-21', priority: 'Medium', status: 'Open' },
];

const Incidents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Incident & Damage Reports</h2>
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Report Incident
          </Button>
        </header>

        <div className="p-8 space-y-6">
          {/* Incident Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl"><ShieldAlert size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500">Open Incidents</p>
                  <h3 className="text-2xl font-bold">8</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Wrench size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500">In Maintenance</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl"><MessageSquare size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500">Resolved Today</p>
                  <h3 className="text-2xl font-bold">5</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-lg">Incident Log</CardTitle>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input className="pl-9 h-9" placeholder="Search incidents..." />
                  </div>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter size={16} className="mr-2" /> Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">Type</TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">Reported By</TableHead>
                    <TableHead className="font-bold">Priority</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidentsData.map((inc) => (
                    <TableRow key={inc.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-500">{inc.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold">
                          {inc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-medium">{inc.description}</TableCell>
                      <TableCell className="text-sm text-slate-600">{inc.reportedBy}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                          inc.priority === 'High' ? "bg-red-100 text-red-700" :
                          inc.priority === 'Medium' ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {inc.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-2 py-0.5",
                          inc.status === 'Open' ? "bg-red-100 text-red-700 hover:bg-red-100" :
                          inc.status === 'In Progress' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                          "bg-green-100 text-green-700 hover:bg-green-100"
                        )}>
                          {inc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">Update</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
      <ReportIncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Incidents;