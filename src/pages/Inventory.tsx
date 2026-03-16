"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Package, Search, AlertTriangle, ArrowDown, Plus, Wine, UtensilsCrossed, Home, History, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const initialInventory = [
  { id: 'INV-001', name: 'Bed Linens (King)', category: 'Housekeeping', stock: 45, minStock: 20, unit: 'pcs', status: 'In Stock' },
  { id: 'INV-002', name: 'Bath Towels', category: 'Housekeeping', stock: 12, minStock: 30, unit: 'pcs', status: 'Low Stock' },
  { id: 'INV-003', name: 'Uganda Waragi (750ml)', category: 'Bar', stock: 24, minStock: 12, unit: 'bottles', status: 'In Stock' },
  { id: 'INV-004', name: 'Mineral Water (500ml)', category: 'F&B', stock: 8, minStock: 24, unit: 'cases', status: 'Critical' },
  { id: 'INV-005', name: 'Cooking Oil (20L)', category: 'Kitchen', stock: 5, minStock: 3, unit: 'jerrycans', status: 'In Stock' },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(initialInventory);

  const handleAutoCalculate = () => {
    showSuccess("Recalculating stock based on daily usage logs...");
    // Simulate automatic calculation logic
    setInventory(prev => prev.map(item => {
      const usage = Math.floor(Math.random() * 3);
      const newStock = Math.max(0, item.stock - usage);
      let newStatus = 'In Stock';
      if (newStock <= item.minStock / 2) newStatus = 'Critical';
      else if (newStock <= item.minStock) newStatus = 'Low Stock';
      
      return { ...item, stock: newStock, status: newStatus };
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Inventory & Assets</h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleAutoCalculate} className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold">
              <RefreshCw size={18} className="mr-2" /> Auto-Calculate Usage
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold">
              <Plus size={18} className="mr-2" /> Add New Item
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-none shadow-lg bg-white flex items-center gap-4 rounded-2xl">
              <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl"><Home size={28} /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Housekeeping</p><p className="text-2xl font-black">420 Items</p></div>
            </Card>
            <Card className="p-6 border-none shadow-lg bg-white flex items-center gap-4 rounded-2xl">
              <div className="p-4 bg-purple-50 text-purple-700 rounded-2xl"><Wine size={28} /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bar Stock</p><p className="text-2xl font-black">156 Items</p></div>
            </Card>
            <Card className="p-6 border-none shadow-lg bg-white flex items-center gap-4 rounded-2xl">
              <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl"><UtensilsCrossed size={28} /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kitchen Store</p><p className="text-2xl font-black">84 Items</p></div>
            </Card>
            <Card className="p-6 border-none shadow-lg bg-white flex items-center gap-4 rounded-2xl">
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl"><AlertTriangle size={28} /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Stock</p><p className="text-2xl font-black text-red-600">12 Alerts</p></div>
            </Card>
          </div>

          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-2xl">
            <CardHeader className="border-b px-8 py-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Current Stock Inventory</CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input className="pl-10 h-11 bg-slate-50 border-none" placeholder="Search items..." />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold">Item ID</TableHead>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="text-right font-bold">Current Stock</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right px-8 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-slate-500 font-bold px-8">{item.id}</TableCell>
                      <TableCell className="font-bold text-slate-900">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(
                          "font-bold",
                          item.category === 'Bar' ? "bg-purple-50 text-purple-700" :
                          item.category === 'Kitchen' ? "bg-orange-50 text-orange-700" :
                          "bg-blue-50 text-blue-700"
                        )}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-900">{item.stock} {item.unit}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-3 py-1 font-bold rounded-full",
                          item.status === 'In Stock' ? "bg-green-100 text-green-700" :
                          item.status === 'Low Stock' ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Button variant="ghost" size="sm" className="text-blue-700 font-bold hover:bg-blue-50">Update</Button>
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

export default Inventory;