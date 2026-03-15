"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Package, Search, AlertTriangle, ArrowDown, ArrowUp, Filter, Box, ShieldCheck, Plus, History, Wine, UtensilsCrossed, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const inventoryData = [
  { id: 'INV-001', name: 'Bed Linens (King)', category: 'Housekeeping', stock: 45, minStock: 20, unit: 'pcs', status: 'In Stock' },
  { id: 'INV-002', name: 'Bath Towels', category: 'Housekeeping', stock: 12, minStock: 30, unit: 'pcs', status: 'Low Stock' },
  { id: 'INV-003', name: 'Uganda Waragi (750ml)', category: 'Bar', stock: 24, minStock: 12, unit: 'bottles', status: 'In Stock' },
  { id: 'INV-004', name: 'Mineral Water (500ml)', category: 'F&B', stock: 8, minStock: 24, unit: 'cases', status: 'Critical' },
  { id: 'INV-005', name: 'Cooking Oil (20L)', category: 'Kitchen', stock: 5, minStock: 3, unit: 'jerrycans', status: 'In Stock' },
  { id: 'INV-006', name: 'Basmati Rice (50kg)', category: 'Kitchen', stock: 2, minStock: 5, unit: 'bags', status: 'Low Stock' },
];

const Inventory = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Inventory & Assets</h2>
          <div className="flex gap-2">
            <Button variant="outline">
              <ArrowDown size={18} className="mr-2" /> Stock In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} className="mr-2" /> Add New Item
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-none shadow-sm bg-white flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Home size={20} /></div>
              <div><p className="text-xs text-slate-500">Housekeeping</p><p className="font-bold">420 Items</p></div>
            </Card>
            <Card className="p-4 border-none shadow-sm bg-white flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Wine size={20} /></div>
              <div><p className="text-xs text-slate-500">Bar Stock</p><p className="font-bold">156 Items</p></div>
            </Card>
            <Card className="p-4 border-none shadow-sm bg-white flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><UtensilsCrossed size={20} /></div>
              <div><p className="text-xs text-slate-500">Kitchen Store</p><p className="font-bold">84 Items</p></div>
            </Card>
            <Card className="p-4 border-none shadow-sm bg-white flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertTriangle size={20} /></div>
              <div><p className="text-xs text-slate-500">Critical Stock</p><p className="font-bold text-red-600">12 Alerts</p></div>
            </Card>
          </div>

          <Tabs defaultValue="stock" className="w-full">
            <TabsList className="bg-white border mb-6">
              <TabsTrigger value="stock">Stock Inventory</TabsTrigger>
              <TabsTrigger value="usage">Usage Log</TabsTrigger>
              <TabsTrigger value="assets">Asset Register</TabsTrigger>
            </TabsList>

            <TabsContent value="stock">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b px-6 py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Current Stock</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input className="pl-9 h-9" placeholder="Search stock..." />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-slate-500">{item.id}</TableCell>
                          <TableCell className="font-semibold">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={cn(
                              item.category === 'Bar' ? "bg-purple-50 text-purple-700" :
                              item.category === 'Kitchen' ? "bg-orange-50 text-orange-700" :
                              "bg-blue-50 text-blue-700"
                            )}>
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold">{item.stock} {item.unit}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "px-2 py-0.5",
                              item.status === 'In Stock' ? "bg-green-100 text-green-700" :
                              item.status === 'Low Stock' ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {/* ... other tabs remain functional */}
          </Tabs>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Inventory;