"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Receipt, Search, Printer, Download, CreditCard, Plus, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { showSuccess } from '@/utils/toast';

const billingData = [
  { id: 'INV-2024-001', guest: 'John Doe', room: '204', amount: '850,000', status: 'Paid', date: '2024-05-24' },
  { id: 'INV-2024-002', guest: 'Sarah Smith', room: '105', amount: '150,000', status: 'Pending', date: '2024-05-24' },
  { id: 'INV-2024-003', guest: 'Michael Brown', room: '301', amount: '1,450,000', status: 'Paid', date: '2024-05-23' },
  { id: 'INV-2024-004', guest: 'Emma Wilson', room: '208', amount: '320,000', status: 'Overdue', date: '2024-05-20' },
];

const Billing = () => {
  const handlePrint = (id: string) => {
    showSuccess(`Generating print-friendly receipt for ${id}...`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Guest Billing & Invoices</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus size={18} className="mr-2" /> Create New Invoice
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl"><CreditCard size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500">Total Collected (Today)</p>
                  <h3 className="text-2xl font-bold">UGX 2.4M</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Receipt size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500">Pending Invoices</p>
                  <h3 className="text-2xl font-bold">14</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl"><User size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500">Outstanding Balance</p>
                  <h3 className="text-2xl font-bold">UGX 1.8M</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-lg">Invoice History</CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input className="pl-9 h-9" placeholder="Search invoice or guest..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Invoice ID</TableHead>
                    <TableHead className="font-bold">Guest</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Amount (UGX)</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingData.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-600">{invoice.id}</TableCell>
                      <TableCell className="font-semibold">{invoice.guest}</TableCell>
                      <TableCell>Room {invoice.room}</TableCell>
                      <TableCell className="text-slate-500">{invoice.date}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-2 py-0.5",
                          invoice.status === 'Paid' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                          invoice.status === 'Pending' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                          "bg-red-100 text-red-700 hover:bg-red-100"
                        )}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">{invoice.amount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice.id)}>
                            <Printer size={16} className="text-slate-600" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download size={16} className="text-slate-600" />
                          </Button>
                        </div>
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

import { cn } from '@/lib/utils';
export default Billing;