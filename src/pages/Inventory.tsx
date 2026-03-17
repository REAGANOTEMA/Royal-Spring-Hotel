"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Package, AlertTriangle, Plus, Search, Edit3, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

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
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Inventory & Supplies</h2>
          </div>
          <Button className="bg-blue-700 font-bold" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Add New Item
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Package size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Items</p>
                  <h3 className="text-2xl font-bold">{items.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Low Stock Alert</p>
                  <h3 className="text-2xl font-bold text-red-600">
                    {items.filter(i => i.stock < 10).length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

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
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span className="font-mono font-bold">{item.stock}</span> {item.unit}
                      </TableCell>
                      <TableCell>
                        <Badge className={item.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                          {item.stock < 10 ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsUpdateModalOpen(true); }}>
                          <Edit3 size={16} className="text-blue-600" />
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
          <DialogContent>
            <DialogHeader><DialogTitle>Update Stock: {selectedItem?.name}</DialogTitle></DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label>New Stock Level ({selectedItem?.unit})</Label>
                <Input 
                  type="number" 
                  value={newStock} 
                  onChange={(e) => setNewStock(e.target.value)} 
                  placeholder="Enter current count" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateStock} className="w-full bg-blue-700">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add New Item Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Inventory Item</DialogTitle></DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Bed Sheets" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="w-full h-10 border rounded-md px-2 bg-white"
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
                  <Label>Unit</Label>
                  <Input value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} placeholder="pcs, kg, ltr" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Initial Stock</Label>
                <Input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} placeholder="0" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-700">Add to Inventory</Button>
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