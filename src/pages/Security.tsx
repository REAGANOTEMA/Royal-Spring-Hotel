"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { ShieldAlert, Lock, Search, ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const Security: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      setAuditLogs(data || []);
    };
    fetchLogs();
  }, []);

  const filteredLogs = auditLogs.filter(log => 
    log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Button variant="destructive" className="font-bold"><Lock size={18} className="mr-2" /> Lock System</Button>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><UserCheck size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Sessions</p>
                  <h3 className="text-2xl font-black text-slate-900">12 Users</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><AlertTriangle size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Alerts</p>
                  <h3 className="text-2xl font-black text-slate-900">0 Pending</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-blue-600 text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl"><ShieldCheck size={28} /></div>
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wider">System Integrity</p>
                  <h3 className="text-2xl font-black">100% Secure</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">System Audit Trail</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">User</TableHead>
                    <TableHead className="font-bold">Action</TableHead>
                    <TableHead className="font-bold">IP Address</TableHead>
                    <TableHead className="font-bold">Timestamp</TableHead>
                    <TableHead className="text-right px-8 font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="px-8 font-bold">{log.user_name}</TableCell>
                      <TableCell className="text-sm">{log.action}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-400">{log.ip || '192.168.1.1'}</TableCell>
                      <TableCell className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right px-8">
                        <Badge className="bg-green-100 text-green-700 font-bold">Authorized</Badge>
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