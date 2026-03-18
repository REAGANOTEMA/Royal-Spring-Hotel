"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Package, AlertTriangle, Plus, Search, Edit3, Trash2, Filter, ArrowDownToLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const Inventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newStock, setNewStock] = useState("");
  const [newItem, setNewItem] = useState({ name: '', category: 'Housekeeping', stock: '', unit: 'pcs' });

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) showError(error.message);
    else setItems(data || []);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async () => {
    if (!selectedItem || !newStock) return;

    const { error } = await supabase
      .from('inventory')
      .update({ stock: parseInt(newStock) })
      .eq('id', selectedItem.id);

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`${selectedItem.name} stock updated.`);
      setIsUpdateModalOpen(false);
      setNewStock("");
      fetchInventory();
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('inventory').insert([{
      name: newItem.name,
      category: newItem.category,
      stock: parseInt(newItem.stock),
      unit: newItem.unit
    }]);

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`${newItem.name} added to inventory.`);
      setIsAddModalOpen(false);
      setNewItem({ name: '', category: 'Housekeeping', stock: '', unit: 'pcs' });
      fetchInventory();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Supply Chain & Inventory</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Resource Management</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-bold h-12 rounded-xl border-slate-200">
              <ArrowDownToLine size={18} className="mr-2" /> Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold rounded-xl shadow-lg shadow-blue-900/20" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} className="mr-2" /> Add New Item
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Package size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total SKUs</p>
                  <h3 className="text-2xl font-black text-slate-900">{items.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock Alerts</p>
                  <h3 className="text-2xl font-black text-red-600">
                    {items.filter(i => i.stock < 10).length}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-white/10 rounded-2xl"><Filter size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Categories</p>
                  <h3 className="text-2xl font-black">4 Active</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[2rem]">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Inventory Ledger</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none rounded-xl" placeholder="Search items..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Item Name</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="font-bold">Stock Level</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 font-bold text-slate-700">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold rounded-lg">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-slate-900">{item.stock}</span> <span className="text-xs text-slate-400 font-bold uppercase">{item.unit}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-lg",
                          item.stock < 10 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {item.stock < 10 ? "Critical" : "Healthy"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 hover:text-blue-600" onClick={() => { setSelectedItem(item); setIsUpdateModalOpen(true); }}>
                          <Edit3 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Update Stock Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader><DialogTitle className="text-2xl font-black">Update Stock: {selectedItem?.name}</DialogTitle></DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">New Stock Level ({selectedItem?.unit})</Label>
                <Input 
                  type="number" 
                  value={newStock} 
                  onChange={(e) => setNewStock(e.target.value)} 
                  placeholder="Enter current count" 
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateStock} className="w-full bg-blue-600 h-12 rounded-xl font-bold">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add New Item Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader><DialogTitle className="text-2xl font-black">Add New Inventory Item</DialogTitle></DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="font-bold">Item Name</Label>
                <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Bed Sheets" className="h-12 rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Category</Label>
                  <select 
                    className="w-full h-12 border rounded-xl px-4 bg-slate-50 font-bold text-slate-700"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Unit</Label>
                  <Input value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} placeholder="pcs, kg, ltr" className="h-12 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Initial Stock</Label>
                <Input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} placeholder="0" className="h-12 rounded-xl" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-600 h-12 rounded-xl font-bold">Add to Inventory</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Footer />
      </main>
    </div>
  );
};

export default Inventory;