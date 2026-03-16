"use client";

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import DeleteDialog from '@/components/DeleteDialog';
import { Bed, Search, Plus, Trash2, Camera, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const initialRooms = [
  { id: '101', type: 'Standard', price: '150,000', status: 'Available', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=400' },
  { id: '102', type: 'Standard', price: '150,000', status: 'Occupied', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=400' },
  { id: '201', type: 'Deluxe', price: '250,000', status: 'Cleaning', floor: '2nd Floor', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=400' },
];

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState({ id: '', type: 'Standard', price: '', floor: '1st Floor' });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const roomToAdd = {
      ...newRoom,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400'
    };
    setRooms([...rooms, roomToAdd]);
    setIsAddModalOpen(false);
    showSuccess(`Room ${newRoom.id} added successfully!`);
    setNewRoom({ id: '', type: 'Standard', price: '', floor: '1st Floor' });
  };

  const handleDeleteRoom = () => {
    setRooms(rooms.filter(r => r.id !== selectedRoomId));
    setIsDeleteModalOpen(false);
    showSuccess(`Room ${selectedRoomId} deleted successfully.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bed className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Room Management</h2>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Add New Room
          </Button>
        </header>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all bg-white group">
              <div className="relative h-40 overflow-hidden">
                <img src={room.image} alt={room.id} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => { setSelectedRoomId(room.id); setIsDeleteModalOpen(true); }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">Room {room.id}</h3>
                  <Badge className={cn(
                    "text-[10px] uppercase",
                    room.status === 'Available' ? "bg-green-500" : "bg-blue-500"
                  )}>{room.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-4">{room.type} • {room.floor}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">UGX {room.price}</span>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                    <Edit3 size={14} className="mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Room Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Room</DialogTitle></DialogHeader>
            <form onSubmit={handleAddRoom} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Input value={newRoom.id} onChange={e => setNewRoom({...newRoom, id: e.target.value})} placeholder="e.g. 104" required />
                </div>
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Select onValueChange={val => setNewRoom({...newRoom, floor: val})}>
                    <SelectTrigger><SelectValue placeholder="Select Floor" /></SelectTrigger>
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
                  <Label>Room Type</Label>
                  <Select onValueChange={val => setNewRoom({...newRoom, type: val})}>
                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (UGX)</Label>
                  <Input value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} placeholder="150,000" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600">Save Room</Button>
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