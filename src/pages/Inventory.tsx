"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DeleteDialog from '@/components/DeleteDialog';
import { Package, Plus, Trash2, RefreshCw, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { showSuccess } from '@/utils/toast';

const initialInventory = [
  { id: 'INV-001', name: 'Bed Linens', category: 'Housekeeping', stock: 45, unit: 'pcs', status: 'In Stock' },
  { id: 'INV-002', name: 'Mineral Water', category: 'F&B', stock: 8, unit: 'cases', status: 'Low Stock' },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', category: 'Housekeeping', stock: '', unit: 'pcs' });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const itemToAdd = {
      id: `INV-00${inventory.length + 1}`,
      name: newItem.name,
      category: newItem.category,
      stock: parseInt(newItem.stock),
      unit: newItem.unit,
      status: parseInt(newItem.stock) > 10 ? 'In Stock' : 'Low Stock'
    };
    setInventory([...inventory, itemToAdd]);
    setIsAddModalOpen(false);
    showSuccess(`${newItem.name} added to inventory.`);
    setNewItem({ name: '', category: 'Housekeeping', stock: '', unit: 'pcs' });
  };

  const handleDelete = () => {
    setInventory(inventory.filter(i => i.id !== selectedId));
    setIsDeleteModalOpen(false);
    showSuccess("Item removed from inventory.");
  };

  const handleAutoCalc = () => {
    showSuccess("Recalculating stock based on room usage...");
    setInventory(inventory.map(item => ({
      ...item,
      stock: Math.max(0, item.stock - Math.floor(Math.random() * 5)),
      status: item.stock < 10 ? 'Low Stock' : 'In Stock'
    })));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Inventory Store</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAutoCalc}><RefreshCw size={16} className="mr-2" /> Auto-Calc</Button>
            <Button className="bg-blue-600" onClick={() => setIsAddModalOpen(true)}><Plus size={16} className="mr-2" /> Add Item</Button>
          </div>
        </header>

        <div className="p-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.stock} {item.unit}</TableCell>
                      <TableCell>
                        <Badge className={item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(item.id); setIsDeleteModalOpen(true); }}>
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
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Soap Bars" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} placeholder="pcs, cases, etc." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-600">Add to Store</Button>
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

export default Inventory;