"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, FileText, Download, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const revenueData = [
  { month: 'Jan', revenue: 4500000, expenses: 3200000 },
  { month: 'Feb', revenue: 5200000, expenses: 3400000 },
  { month: 'Mar', revenue: 4800000, expenses: 3100000 },
  { month: 'Apr', revenue: 6100000, expenses: 3800000 },
  { month: 'May', revenue: 5900000, expenses: 3600000 },
  { month: 'Jun', revenue: 7200000, expenses: 4100000 },
];

const deptRevenue = [
  { name: 'Rooms', value: 8500000, color: '#3b82f6' },
  { name: 'F&B', value: 4200000, color: '#10b981' },
  { name: 'Laundry', value: 1200000, color: '#6366f1' },
  { name: 'Events', value: 2500000, color: '#f59e0b' },
];

const receivables = [
  { id: 'REC-001', guest: 'John Doe', amount: '150,000', dueDate: '2024-05-30', status: 'Pending' },
  { id: 'REC-002', guest: 'Sarah Smith', amount: '45,000', dueDate: '2024-05-28', status: 'Overdue' },
];

const payables = [
  { id: 'PAY-001', supplier: 'Fresh Foods Ltd', amount: '1,200,000', dueDate: '2024-06-05', status: 'Scheduled' },
  { id: 'PAY-002', supplier: 'CleanCo Services', amount: '450,000', dueDate: '2024-06-01', status: 'Pending' },
];

const Finance = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Financial Management</h2>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download size={18} className="mr-2" /> Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <DollarSign size={18} className="mr-2" /> Record Transaction
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-emerald-600 text-white">
              <CardContent className="p-6">
                <p className="text-emerald-100 text-sm">Total Revenue (MTD)</p>
                <h3 className="text-3xl font-bold mt-1">UGX 12.4M</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-rose-600 text-white">
              <CardContent className="p-6">
                <p className="text-rose-100 text-sm">Total Expenses (MTD)</p>
                <h3 className="text-3xl font-bold mt-1">UGX 4.8M</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-blue-600 text-white">
              <CardContent className="p-6">
                <p className="text-blue-100 text-sm">Net Profit (MTD)</p>
                <h3 className="text-3xl font-bold mt-1">UGX 7.6M</h3>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white border mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">Departmental Income</TabsTrigger>
              <TabsTrigger value="receivables">Receivables</TabsTrigger>
              <TabsTrigger value="payables">Payables</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className="text-lg">Revenue vs Expenses Trend</CardTitle></CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Income by Department</CardTitle></CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptRevenue} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                          {deptRevenue.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Departmental Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deptRevenue.map((dept) => (
                        <div key={dept.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <span className="font-bold">UGX {dept.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="receivables">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Amount (UGX)</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receivables.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-semibold">{item.guest}</TableCell>
                          <TableCell className="font-bold text-emerald-600">{item.amount}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell><Badge variant={item.status === 'Overdue' ? 'destructive' : 'secondary'}>{item.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payables">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Amount (UGX)</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payables.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className="font-semibold">{item.supplier}</TableCell>
                          <TableCell className="font-bold text-rose-600">{item.amount}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
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

export default Finance;