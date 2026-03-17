"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import DeleteDialog from "@/components/DeleteDialog";
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ income: 0, expenses: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTrx, setNewTrx] = useState({ type: "Income", category: "", amount: "" });

  const fetchFinanceData = async () => {
    const { data, error } = await supabase.from('billing').select('*').order('date', { ascending: false });
    if (error) showError(error.message);
    else {
      const formatted = (data || []).map(item => ({
        id: item.id,
        type: item.status === 'Expense' ? 'Expense' : 'Income',
        category: item.status === 'Expense' ? item.room : 'Room Payment',
        amount: item.amount,
        date: item.date,
        status: item.status
      }));
      setTransactions(formatted);

      const income = (data || []).filter(t => t.status === 'Paid').reduce((acc, t) => acc + parseFloat(t.amount.replace(/,/g, '') || '0'), 0);
      const expenses = (data || []).filter(t => t.status === 'Expense').reduce((acc, t) => acc + parseFloat(t.amount.replace(/,/g, '') || '0'), 0);
      setStats({ income, expenses });
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleAddTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    const trxData = {
      guest: newTrx.type === 'Income' ? 'Walk-in' : 'System Expense',
      room: newTrx.category,
      amount: newTrx.amount,
      status: newTrx.type === 'Income' ? 'Paid' : 'Expense',
      date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('billing').insert([trxData]);
    if (error) showError(error.message);
    else {
      showSuccess("Transaction recorded.");
      setIsAddModalOpen(false);
      setNewTrx({ type: "Income", category: "", amount: "" });
      fetchFinanceData();
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const { error } = await supabase.from('billing').delete().eq('id', selectedId);
    if (error) showError(error.message);
    else {
      setIsDeleteModalOpen(false);
      showSuccess("Transaction record deleted.");
      fetchFinanceData();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <DollarSign className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Finance & Accounts</h2>
          </div>
          <Button className="bg-blue-600 flex items-center" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Record Transaction
          </Button>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><TrendingUp size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Income</p>
                  <h3 className="text-2xl font-black text-slate-900">UGX {stats.income.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><TrendingDown size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</p>
                  <h3 className="text-2xl font-black text-slate-900">UGX {stats.expenses.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-blue-600 text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl"><DollarSign size={28} /></div>
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Net Balance</p>
                  <h3 className="text-2xl font-black">UGX {(stats.income - stats.expenses).toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount (UGX)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Badge className={t.type === "Income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">{t.category}</TableCell>
                      <TableCell className="font-black text-blue-700">{t.amount}</TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(t.id); setIsDeleteModalOpen(true); }}>
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Transaction</DialogTitle></DialogHeader>
            <form onSubmit={handleAddTrx} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select onValueChange={(val) => setNewTrx({ ...newTrx, type: val })} value={newTrx.type}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={newTrx.category} onChange={(e) => setNewTrx({ ...newTrx, category: e.target.value })} placeholder="e.g. Room Payment, Food Supply" required />
              </div>
              <div className="space-y-2">
                <Label>Amount (UGX)</Label>
                <Input value={newTrx.amount} onChange={(e) => setNewTrx({ ...newTrx, amount: e.target.value })} placeholder="0" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-600">Save Transaction</Button>
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

export default Finance;