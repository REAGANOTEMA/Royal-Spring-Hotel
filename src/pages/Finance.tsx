"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DeleteDialog from '@/components/DeleteDialog';
import { DollarSign, Plus, Trash2, Download, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';

const initialTransactions = [
  { id: 'TRX-001', type: 'Income', category: 'Rooms', amount: '850,000', date: '2024-05-24', status: 'Completed' },
  { id: 'TRX-002', type: 'Expense', category: 'Supplies', amount: '120,000', date: '2024-05-24', status: 'Pending' },
];

const Finance = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTrx, setNewTrx] = useState({ type: 'Income', category: '', amount: '' });

  const handleAddTrx = (e: React.FormEvent) => {
    e.preventDefault();
    const trxToAdd = {
      id: `TRX-00${transactions.length + 1}`,
      ...newTrx,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    setTransactions([trxToAdd, ...transactions]);
    setIsAddModalOpen(false);
    showSuccess("Transaction recorded successfully.");
    setNewTrx({ type: 'Income', category: '', amount: '' });
  };

  const handleDelete = () => {
    setTransactions(transactions.filter(t => t.id !== selectedId));
    setIsDeleteModalOpen(false);
    showSuccess("Transaction record deleted.");
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
          <Button className="bg-blue-600" onClick={() => setIsAddModalOpen(true)}><Plus size={18} className="mr-2" /> Record Transaction</Button>
        </header>

        <div className="p-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b"><CardTitle className="text-lg">Recent Transactions</CardTitle></CardHeader>
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
                        <Badge className={t.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">{t.category}</TableCell>
                      <TableCell className="font-black">{t.amount}</TableCell>
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
                <Select onValueChange={val => setNewTrx({...newTrx, type: val})}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={newTrx.category} onChange={e => setNewTrx({...newTrx, category: e.target.value})} placeholder="e.g. Room Payment, Food Supply" required />
              </div>
              <div className="space-y-2">
                <Label>Amount (UGX)</Label>
                <Input value={newTrx.amount} onChange={e => setNewTrx({...newTrx, amount: e.target.value})} placeholder="0" required />
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