"use client";

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Bed, Search, Filter, Plus, CheckCircle2, XCircle, Clock, Brush, LayoutGrid, List, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

// Exactly 20 rooms distributed across 3 floors
const initialRooms = [
  // 1st Floor - Standard Rooms (8)
  { id: '101', type: 'Standard', price: '150,000', status: 'Available', floor: '1st Floor' },
  { id: '102', type: 'Standard', price: '150,000', status: 'Occupied', floor: '1st Floor' },
  { id: '103', type: 'Standard', price: '150,000', status: 'Cleaning', floor: '1st Floor' },
  { id: '104', type: 'Standard', price: '150,000', status: 'Available', floor: '1st Floor' },
  { id: '105', type: 'Standard', price: '150,000', status: 'Available', floor: '1st Floor' },
  { id: '106', type: 'Standard', price: '150,000', status: 'Occupied', floor: '1st Floor' },
  { id: '107', type: 'Standard', price: '150,000', status: 'Maintenance', floor: '1st Floor' },
  { id: '108', type: 'Standard', price: '150,000', status: 'Available', floor: '1st Floor' },
  
  // 2nd Floor - Deluxe Rooms (8)
  { id: '201', type: 'Deluxe', price: '250,000', status: 'Cleaning', floor: '2nd Floor' },
  { id: '202', type: 'Deluxe', price: '250,000', status: 'Available', floor: '2nd Floor' },
  { id: '203', type: 'Deluxe', price: '250,000', status: 'Occupied', floor: '2nd Floor' },
  { id: '204', type: 'Deluxe', price: '250,000', status: 'Available', floor: '2nd Floor' },
  { id: '205', type: 'Deluxe', price: '250,000', status: 'Available', floor: '2nd Floor' },
  { id: '206', type: 'Deluxe', price: '250,000', status: 'Occupied', floor: '2nd Floor' },
  { id: '207', type: 'Deluxe', price: '250,000', status: 'Cleaning', floor: '2nd Floor' },
  { id: '208', type: 'Deluxe', price: '250,000', status: 'Available', floor: '2nd Floor' },

  // 3rd Floor - Suites (4)
  { id: '301', type: 'Suite', price: '450,000', status: 'Maintenance', floor: '3rd Floor' },
  { id: '302', type: 'Suite', price: '450,000', status: 'Occupied', floor: '3rd Floor' },
  { id: '303', type: 'Suite', price: '450,000', status: 'Available', floor: '3rd Floor' },
  { id: '304', type: 'Suite', price: '450,000', status: 'Available', floor: '3rd Floor' },
];

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => ({
    total: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length,
    cleaning: rooms.filter(r => r.status === 'Cleaning').length,
    maintenance: rooms.filter(r => r.status === 'Maintenance').length,
  }), [rooms]);

  const updateStatus = (roomId: string, newStatus: string) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    showSuccess(`Room ${roomId} status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cleaning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Maintenance': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesSearch = r.id.includes(searchQuery) || r.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bed className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Room Inventory</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
              Total Rooms: {stats.total}
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700 h-9">
              <Plus size={18} className="mr-2" /> Add Room
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle2 size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Available</p>
                  <h3 className="text-xl font-bold">{stats.available}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Occupied</p>
                  <h3 className="text-xl font-bold">{stats.occupied}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Brush size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Cleaning</p>
                  <h3 className="text-xl font-bold">{stats.cleaning}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><XCircle size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Maintenance</p>
                  <h3 className="text-xl font-bold">{stats.maintenance}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-blue-600" 
                placeholder="Search room number or type..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'].map((f) => (
                <Button 
                  key={f}
                  variant={filter === f ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full px-4",
                    filter === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group bg-white">
                <div className={cn(
                  "h-1.5 w-full",
                  room.status === 'Available' ? "bg-emerald-500" : 
                  room.status === 'Occupied' ? "bg-blue-500" : 
                  room.status === 'Cleaning' ? "bg-amber-500" : "bg-rose-500"
                )} />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-800">Room {room.id}</h3>
                        <Info size={14} className="text-slate-300 cursor-help" />
                      </div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{room.type}</p>
                    </div>
                    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight", getStatusColor(room.status))}>
                      {room.status === 'Cleaning' && <Brush size={10} />}
                      {room.status === 'Maintenance' && <Clock size={10} />}
                      {room.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Location</span>
                      <span className="font-semibold text-slate-700">{room.floor}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Rate</span>
                      <span className="font-bold text-blue-600">UGX {room.price}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <Select onValueChange={(val) => updateStatus(room.id, val)}>
                      <SelectTrigger className="h-8 text-[11px] font-semibold bg-slate-50 border-none">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <Bed className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-slate-800">No rooms found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Rooms;