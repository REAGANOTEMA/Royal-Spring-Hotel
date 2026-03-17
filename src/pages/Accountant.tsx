"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Banknote, Receipt, TrendingUp, Wallet, Plus, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const Accountant = () => {
  const [stats, setStats] = useState({ revenue: '0', expenses: '0', balance: '0' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Utilities' });

  const fetchFinanceData = async () => {
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      const rev = data.filter(t => t.status === 'Paid').reduce((acc, t) => acc + parseFloat(t.amount.replace(/,/g, '') || '0'), 0);
      const exp = data.filter(t => t.status === 'Expense').reduce((acc, t) => acc + parseFloat(t.amount.replace(/,/g, '') || '0'), 0);
      
      setStats({
        revenue: rev.toLocaleString(),
        expenses: exp.toLocaleString(),
        balance: (rev - exp).toLocaleString()
      });
      setTransactions(data.slice(0, 10));
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      guest: 'System Expense',
      room: newExpense.category,
      amount: newExpense.amount,
      status: 'Expense',
      date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('billing').insert([expenseData]);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Expense recorded successfully.");
      setIsExpenseModalOpen(false);
      setNewExpense({ description: '', amount: '', category: 'Utilities' });
      fetchFinanceData();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Banknote className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Accountant Portal</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold" onClick={() => window.print()}>
              <Download size={16} className="mr-2" /> Export Ledger
            </Button>
            <Button className="bg-blue-700 font-bold" onClick={() => setIsExpenseModalOpen(true)}>
              <Plus size={16} className="mr-2" /> Record Expense
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><TrendingUp size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-2xl font-black text-slate-900">UGX {stats.revenue}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><Wallet size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</p>
                  <h3 className="text-2xl font-black text-slate-900">UGX {stats.expenses}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-blue-600 text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl"><Banknote size={28} /></div>
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Net Balance</p>
                  <h3 className="text-2xl font-black">UGX {stats.balance}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-lg font-bold">Recent Financial Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount (UGX)</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="text-sm text-slate-500">{trx.date}</TableCell>
                      <TableCell className="font-bold">
                        {trx.status === 'Expense' ? trx.room : `Invoice for ${trx.guest}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{trx.status === 'Expense' ? 'Operational' : 'Room Revenue'}</Badge>
                      </TableCell>
                      <TableCell className={cn("text-right font-black", trx.status === 'Expense' ? "text-red-600" : "text-blue-700")}>
                        {trx.status === 'Expense' ? `-${trx.amount}` : trx.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          trx.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          trx.status === 'Expense' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'
                        }>
                          {trx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Record New Expense</DialogTitle></DialogHeader>
            <form onSubmit={handleRecordExpense} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Expense Category</Label>
                <Select onValueChange={val => setNewExpense({...newExpense, category: val})} value={newExpense.category}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities (Water/Power)</SelectItem>
                    <SelectItem value="Kitchen">Kitchen Supplies</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Salaries">Staff Salaries</SelectItem>
                    <SelectItem value="Other">Other Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (UGX)</Label>
                <Input 
                  type="text" 
                  placeholder="e.g. 50,000" 
                  value={newExpense.amount} 
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})} 
                  required 
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-700">Save Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default Accountant;