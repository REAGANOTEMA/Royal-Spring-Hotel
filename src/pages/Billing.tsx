"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Receipt, Search, Printer, Download, CreditCard, Plus, User, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const billingData = [
  { id: 'INV-2024-001', guest: 'John Doe', room: '204', amount: '850,000', status: 'Paid', date: '2024-05-24' },
  { id: 'INV-2024-002', guest: 'Sarah Smith', room: '105', amount: '150,000', status: 'Pending', date: '2024-05-24' },
  { id: 'INV-2024-003', guest: 'Michael Brown', room: '301', amount: '1,450,000', status: 'Paid', date: '2024-05-23' },
  { id: 'INV-2024-004', guest: 'Emma Wilson', room: '208', amount: '320,000', status: 'Overdue', date: '2024-05-20' },
];

const Billing = () => {
  const handlePrint = (invoice: any) => {
    showSuccess(`Preparing receipt for ${invoice.id}...`);
    
    // Create a hidden print frame or open a new window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${invoice.id}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { height: 80px; margin-bottom: 10px; }
              .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              .table th, .table td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
              .total { text-align: right; font-size: 24px; font-weight: bold; color: #1d4ed8; }
              .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="/logo.png" class="logo" />
              <h1>Royal Springs Resort</h1>
              <p>Official Payment Receipt</p>
            </div>
            <div class="details">
              <div>
                <p><strong>Guest:</strong> ${invoice.guest}</p>
                <p><strong>Room:</strong> ${invoice.room}</p>
              </div>
              <div>
                <p><strong>Invoice ID:</strong> ${invoice.id}</p>
                <p><strong>Date:</strong> ${invoice.date}</p>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount (UGX)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Accommodation & Services</td>
                  <td>${invoice.amount}</td>
                </tr>
              </tbody>
            </table>
            <div class="total">Total Paid: UGX ${invoice.amount}</div>
            <div class="footer">
              <p>Thank you for staying with Royal Springs Resort.</p>
              <p>This is a computer-generated receipt.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Guest Billing & Invoices</h2>
          <Button className="bg-blue-700 hover:bg-blue-800 font-bold">
            <Plus size={18} className="mr-2" /> Create New Invoice
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-white overflow-hidden group">
              <div className="h-1 bg-green-500 w-full" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform"><CreditCard size={28} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Collected</p>
                  <h3 className="text-3xl font-black text-slate-900">UGX 2.4M</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white overflow-hidden group">
              <div className="h-1 bg-blue-500 w-full" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Receipt size={28} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Invoices</p>
                  <h3 className="text-3xl font-black text-slate-900">14</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white overflow-hidden group">
              <div className="h-1 bg-red-500 w-full" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform"><User size={28} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Outstanding</p>
                  <h3 className="text-3xl font-black text-slate-900">UGX 1.8M</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-xl font-bold">Invoice History</CardTitle>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none" placeholder="Search guest or invoice ID..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold px-8">Invoice ID</TableHead>
                    <TableHead className="font-bold">Guest</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Amount (UGX)</TableHead>
                    <TableHead className="font-bold text-right px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingData.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-500 px-8">{invoice.id}</TableCell>
                      <TableCell className="font-bold text-slate-900">{invoice.guest}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 border-slate-200 font-bold">Room {invoice.room}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium">{invoice.date}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-3 py-1 font-bold rounded-full",
                          invoice.status === 'Paid' ? "bg-green-100 text-green-700" :
                          invoice.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-blue-700">{invoice.amount}</TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => handlePrint(invoice)}
                            title="Print Receipt"
                          >
                            <Printer size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100">
                            <Download size={18} />
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

export default Billing;