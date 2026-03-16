"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { ShieldAlert, Lock, Eye, Search, Filter, UserCheck, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  ip: string;
  time: string;
  status: 'Authorized' | 'Blocked';
}

const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-8821', user: 'Joseph Byabazaire', action: 'Accessed Financial Reports', ip: '192.168.1.1', time: '2 mins ago', status: 'Authorized' },
  { id: 'LOG-8820', user: 'Alice Johnson', action: 'Updated Room 204 Status', ip: '192.168.1.45', time: '15 mins ago', status: 'Authorized' },
  { id: 'LOG-8819', user: 'Unknown', action: 'Failed Login Attempt', ip: '45.12.88.12', time: '1 hour ago', status: 'Blocked' },
  { id: 'LOG-8818', user: 'Bob Williams', action: 'Deleted Inventory Item #INV-005', ip: '192.168.1.12', time: '3 hours ago', status: 'Authorized' },
  { id: 'LOG-8817', user: 'HR Manager', action: 'Modified Payroll for May', ip: '192.168.1.5', time: '5 hours ago', status: 'Authorized' },
];

const Security: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logs by search term
  const filteredLogs = auditLogs.filter(log =>
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Security & Audit Logs</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold">
              <Lock size={18} className="mr-2" /> Lock System
            </Button>
            <Button className="bg-slate-900 hover:bg-black font-bold">
              <ShieldCheck size={18} className="mr-2" /> Security Scan
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <div className="h-1 bg-green-500 w-full" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><UserCheck size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Sessions</p>
                  <h3 className="text-2xl font-black text-slate-900">12 Users</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <div className="h-1 bg-amber-500 w-full" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><AlertTriangle size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Alerts</p>
                  <h3 className="text-2xl font-black text-slate-900">2 Pending</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <div className="h-1 bg-blue-500 w-full" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Lock size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Integrity</p>
                  <h3 className="text-2xl font-black text-slate-900">100% Secure</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log Table */}
          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">System Audit Trail</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    className="pl-10 h-11 bg-slate-50 border-none"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Log ID</TableHead>
                    <TableHead className="font-bold">User</TableHead>
                    <TableHead className="font-bold">Action Performed</TableHead>
                    <TableHead className="font-bold">IP Address</TableHead>
                    <TableHead className="font-bold">Timestamp</TableHead>
                    <TableHead className="text-right px-8 font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 font-mono text-xs text-slate-500">{log.id}</TableCell>
                      <TableCell className="font-bold text-slate-900">{log.user}</TableCell>
                      <TableCell className="text-sm text-slate-600">{log.action}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-400">{log.ip}</TableCell>
                      <TableCell className="text-xs text-slate-500">{log.time}</TableCell>
                      <TableCell className="text-right px-8">
                        <Badge className={cn(
                          "px-3 py-1 font-bold rounded-full",
                          log.status === 'Authorized' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {log.status}
                        </Badge>
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
    </div>
  );
};

export default Security;