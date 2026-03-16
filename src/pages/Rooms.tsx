"use client";

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Bed, Search, Filter, Plus, CheckCircle2, XCircle, Clock, Brush, Info, Camera, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const initialRooms = [
  { id: '101', type: 'Standard', price: '150,000', status: 'Available', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=400' },
  { id: '102', type: 'Standard', price: '150,000', status: 'Occupied', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=400' },
  { id: '103', type: 'Standard', price: '150,000', status: 'Cleaning', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400' },
  { id: '201', type: 'Deluxe', price: '250,000', status: 'Cleaning', floor: '2nd Floor', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=400' },
  { id: '301', type: 'Suite', price: '450,000', status: 'Maintenance', floor: '3rd Floor', image: 'https://images.unsplash.com/photo-1591088398332-8a77d399e80c?auto=format&fit=crop&q=80&w=400' },
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

  const handleImageUpload = (roomId: string) => {
    showSuccess(`Image upload triggered for Room ${roomId}. In a real system, this would open the camera or file picker.`);
  };

  const updateStatus = (roomId: string, newStatus: string) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    showSuccess(`Room ${roomId} status updated to ${newStatus}`);
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
          <Button className="bg-blue-600 hover:bg-blue-700 h-9">
            <Plus size={18} className="mr-2" /> Add Room
          </Button>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle2 size={20} /></div>
                <div><p className="text-xs text-slate-500 font-medium">Available</p><h3 className="text-xl font-bold">{stats.available}</h3></div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Bed size={20} /></div>
                <div><p className="text-xs text-slate-500 font-medium">Occupied</p><h3 className="text-xl font-bold">{stats.occupied}</h3></div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Brush size={20} /></div>
                <div><p className="text-xs text-slate-500 font-medium">Cleaning</p><h3 className="text-xl font-bold">{stats.cleaning}</h3></div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><XCircle size={20} /></div>
                <div><p className="text-xs text-slate-500 font-medium">Maintenance</p><h3 className="text-xl font-bold">{stats.maintenance}</h3></div>
              </CardContent>
            </Card>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
                <div className="relative h-48 overflow-hidden">
                  <img src={room.image} alt={`Room ${room.id}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 right-3">
                    <Badge className={cn(
                      "font-bold uppercase text-[10px]",
                      room.status === 'Available' ? "bg-emerald-500" : 
                      room.status === 'Occupied' ? "bg-blue-500" : 
                      room.status === 'Cleaning' ? "bg-amber-500" : "bg-rose-500"
                    )}>
                      {room.status}
                    </Badge>
                  </div>
                  <button 
                    onClick={() => handleImageUpload(room.id)}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:bg-white transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Room {room.id}</h3>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{room.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{room.floor}</p>
                      <p className="text-sm font-bold text-blue-600">UGX {room.price}</p>
                    </div>
                  </div>
                  <Select onValueChange={(val) => updateStatus(room.id, val)}>
                    <SelectTrigger className="h-9 text-xs font-semibold bg-slate-50 border-none">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Rooms;