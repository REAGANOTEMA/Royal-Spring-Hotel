"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { UtensilsCrossed, Plus, Search, History, AlertTriangle, ArrowDownToLine, Trash2, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const Kitchen = () => {
  const [items, setItems] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [newItem, setNewItem] = useState({ item_name: '', category: 'Vegetables', stock_quantity: '', unit: 'kg' });
  const [logData, setLogData] = useState({ action_type: 'Used', quantity: '', notes: '' });

  const fetchData = async () => {
    const { data: invData } = await supabase.from('kitchen_inventory').select('*').order('item_name');
    const { data: logData } = await supabase.from('kitchen_logs').select('*, kitchen_inventory(item_name)').order('created_at', { ascending: false }).limit(10);
    
    setItems(invData || []);
    setLogs(logData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('kitchen_inventory').insert([newItem]);
    if (error) showError(error.message);
    else {
      showSuccess(`${newItem.item_name} added to kitchen store.`);
      setIsAddModalOpen(false);
      setNewItem({ item_name: '', category: 'Vegetables', stock_quantity: '', unit: 'kg' });
      fetchData();
    }
  };

  const handleLogAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qty = parseFloat(logData.quantity);
    let newStock = parseFloat(selectedItem.stock_quantity);

    if (logData.action_type === 'Used' || logData.action_type === 'Damaged') {
      newStock -= qty;
    } else {
      newStock += qty;
    }

    const { error: logError } = await supabase.from('kitchen_logs').insert([{
      item_id: selectedItem.id,
      action_type: logData.action_type,
      quantity: qty,
      notes: logData.notes,
      logged_by: localStorage.getItem('userName') || 'Chef'
    }]);

    if (logError) return showError(logError.message);

    const { error: invError } = await supabase.from('kitchen_inventory').update({ stock_quantity: newStock }).eq('id', selectedItem.id);
    
    if (invError) showError(invError.message);
    else {
      showSuccess(`Stock updated for ${selectedItem.item_name}`);
      setIsLogModalOpen(false);
      setLogData({ action_type: 'Used', quantity: '', notes: '' });
      fetchData();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Kitchen Store & Inventory</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Executive Chef Portal</p>
            </div>
          </div>
          <div className="flex gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 object-contain mr-4" />
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold rounded-xl shadow-lg" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} className="mr-2" /> Add New Stock
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Scale size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
                  <h3 className="text-2xl font-black text-slate-900">{items.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock Items</p>
                  <h3 className="text-2xl font-black text-red-600">{items.filter(i => i.stock_quantity <= i.min_stock_level).length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl"><History size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recent Actions</p>
                  <h3 className="text-2xl font-black">{logs.length} Today</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black">Kitchen Store Ledger</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input className="pl-9 h-10 bg-slate-50 border-none rounded-xl" placeholder="Search ingredients..." />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="px-8 font-bold">Ingredient</TableHead>
                      <TableHead className="font-bold">Category</TableHead>
                      <TableHead className="font-bold">Remaining</TableHead>
                      <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-bold text-slate-700">{item.item_name}</TableCell>
                        <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold">{item.category}</Badge></TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className={cn("font-black", item.stock_quantity <= item.min_stock_level ? "text-red-600" : "text-slate-900")}>
                              {item.stock_quantity} {item.unit}
                            </span>
                            {item.stock_quantity <= item.min_stock_level && <span className="text-[10px] text-red-500 font-bold uppercase">Low Stock</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600" onClick={() => { setSelectedItem(item); setIsLogModalOpen(true); }}>
                            Update Usage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b px-8 py-6">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <History size={20} className="text-blue-600" /> Usage & Damage Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="font-black text-slate-900 text-sm">{log.kitchen_inventory?.item_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {log.action_type} {log.quantity} {log.kitchen_inventory?.unit} • {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={cn(
                      "font-black text-[10px] uppercase",
                      log.action_type === 'Used' ? "bg-blue-100 text-blue-700" :
                      log.action_type === 'Damaged' ? "bg-red-100 text-red-700" :
                      "bg-emerald-100 text-emerald-700"
                    )}>{log.action_type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Item Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader><DialogTitle className="text-2xl font-black">Add New Kitchen Stock</DialogTitle></DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-bold">Item Name</Label>
                <Input value={newItem.item_name} onChange={e => setNewItem({...newItem, item_name: e.target.value})} placeholder="e.g. Fresh Tomatoes" className="h-12 rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Category</Label>
                  <Select onValueChange={val => setNewItem({...newItem, category: val})} value={newItem.category}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Meat & Poultry">Meat & Poultry</SelectItem>
                      <SelectItem value="Spices">Spices</SelectItem>
                      <SelectItem value="Dry Goods">Dry Goods</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Unit</Label>
                  <Select onValueChange={val => setNewItem({...newItem, unit: val})} value={newItem.unit}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="ltr">Liters (ltr)</SelectItem>
                      <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      <SelectItem value="tray">Tray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Initial Quantity</Label>
                <Input type="number" value={newItem.stock_quantity} onChange={e => setNewItem({...newItem, stock_quantity: e.target.value})} placeholder="0" className="h-12 rounded-xl" required />
              </div>
              <DialogFooter><Button type="submit" className="w-full bg-blue-600 h-12 rounded-xl font-bold">Add to Store</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Log Usage Modal */}
        <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader><DialogTitle className="text-2xl font-black">Update Usage: {selectedItem?.item_name}</DialogTitle></DialogHeader>
            <form onSubmit={handleLogAction} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-bold">Action Type</Label>
                <Select onValueChange={val => setLogData({...logData, action_type: val})} value={logData.action_type}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Used">Used in Kitchen</SelectItem>
                    <SelectItem value="Damaged">Damaged / Expired</SelectItem>
                    <SelectItem value="Restocked">Restocked / Purchased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Quantity ({selectedItem?.unit})</Label>
                <Input type="number" step="0.01" value={logData.quantity} onChange={e => setLogData({...logData, quantity: e.target.value})} placeholder="0.00" className="h-12 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Notes</Label>
                <Input value={logData.notes} onChange={e => setLogData({...logData, notes: e.target.value})} placeholder="e.g. Used for lunch buffet" className="h-12 rounded-xl" />
              </div>
              <DialogFooter><Button type="submit" className="w-full bg-blue-600 h-12 rounded-xl font-bold">Confirm Update</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default Kitchen;