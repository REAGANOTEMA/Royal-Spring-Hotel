"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DeleteDialog from '@/components/DeleteDialog';
import { Bed, Plus, Trash2, Edit3, Layers, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface RoomType {
  id: string;
  type: string;
  price: number;
  status: string;
  floor: string;
  image: string;
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<RoomType>>({ id: '', type: 'Standard', price: 0, floor: '1st Floor', image: '' });

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('rooms').select('*').order('id');
    if (error) showError(error.message);
    else setRooms(data as RoomType[]);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.id || !newRoom.price || !newRoom.type || !newRoom.floor) return;
    
    const roomToAdd = {
      id: newRoom.id,
      type: newRoom.type,
      price: Number(newRoom.price),
      floor: newRoom.floor,
      status: 'Available',
      image: newRoom.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    };

    const { error } = await supabase.from('rooms').insert([roomToAdd]);
    
    if (error) {
      showError(error.message);
    } else {
      setIsAddModalOpen(false);
      showSuccess(`Room ${newRoom.id} added successfully!`);
      setNewRoom({ id: '', type: 'Standard', price: 0, floor: '1st Floor', image: '' });
      fetchRooms();
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;
    const { error } = await supabase.from('rooms').delete().eq('id', selectedRoomId);
    
    if (error) {
      showError(error.message);
    } else {
      setIsDeleteModalOpen(false);
      showSuccess(`Room ${selectedRoomId} deleted successfully.`);
      fetchRooms();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Bed size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Room Inventory</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Manage Accommodations</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold rounded-xl shadow-lg shadow-blue-900/20" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Add New Room
          </Button>
        </header>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rooms.map(room => (
            <Card key={room.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group rounded-[2.5rem]">
              <div className="relative h-64 overflow-hidden">
                <img src={room.image} alt={room.id} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="destructive" className="h-10 w-10 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedRoomId(room.id); setIsDeleteModalOpen(true); }}>
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <Badge className={cn("px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-lg shadow-lg border-none",
                    room.status === 'Available' ? "bg-emerald-500 text-white" :
                    room.status === 'Occupied' ? "bg-red-500 text-white" :
                    "bg-amber-500 text-white"
                  )}>{room.status}</Badge>
                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900">Room {room.id}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                      <Layers size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{room.floor}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold rounded-lg px-3 py-1">{room.type}</Badge>
                </div>
                
                <div className="pt-6 border-t flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nightly Rate</span>
                    <span className="font-black text-blue-600 text-xl">UGX {room.price.toLocaleString()}</span>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600">
                    <Edit3 size={14} className="mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="rounded-[2.5rem] max-w-lg">
            <DialogHeader><DialogTitle className="text-2xl font-black">Add New Room</DialogTitle></DialogHeader>
            <form onSubmit={handleAddRoom} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Room Number</Label>
                  <Input value={newRoom.id} onChange={e => setNewRoom({...newRoom, id: e.target.value})} placeholder="e.g. 104" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Floor</Label>
                  <Select onValueChange={val => setNewRoom({...newRoom, floor: val})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Floor" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Floor">1st Floor</SelectItem>
                      <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                      <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Room Type</Label>
                  <Select onValueChange={val => setNewRoom({...newRoom, type: val})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Price (UGX)</Label>
                  <Input type="number" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: Number(e.target.value)})} placeholder="150000" className="h-12 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Room Image URL</Label>
                <Input value={newRoom.image} onChange={e => setNewRoom({...newRoom, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="h-12 rounded-xl" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="h-12 rounded-xl font-bold">Cancel</Button>
                <Button type="submit" className="bg-blue-600 h-12 rounded-xl font-bold px-8">Save Room</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteRoom} />
        <Footer />
      </main>
    </div>
  );
};

export default Rooms;