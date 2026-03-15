"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Users, Search, UserPlus, Mail, Phone, History, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const guestsData = [
  { id: 'G-001', name: 'John Doe', email: 'john@example.com', phone: '+256 700 123456', visits: 5, lastStay: '2024-05-10', status: 'VIP' },
  { id: 'G-002', name: 'Sarah Smith', email: 'sarah@example.com', phone: '+256 700 654321', visits: 2, lastStay: '2024-05-21', status: 'Regular' },
  { id: 'G-003', name: 'Michael Brown', email: 'michael@example.com', phone: '+256 700 987654', visits: 1, lastStay: '2024-04-15', status: 'New' },
  { id: 'G-004', name: 'Emma Wilson', email: 'emma@example.com', phone: '+256 700 111222', visits: 8, lastStay: '2024-05-01', status: 'VIP' },
];

const Guests = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Guest Management</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus size={18} className="mr-2" /> Register Guest
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input className="pl-10 bg-white" placeholder="Search by name, email or phone..." />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users size={16} />
                <span>Total Guests: 1,240</span>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Guest</TableHead>
                    <TableHead className="font-bold">Contact Info</TableHead>
                    <TableHead className="font-bold text-center">Visits</TableHead>
                    <TableHead className="font-bold">Last Stay</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guestsData.map((guest) => (
                    <TableRow key={guest.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                              {guest.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{guest.name}</p>
                            <p className="text-xs text-slate-500">ID: {guest.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail size={12} /> {guest.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone size={12} /> {guest.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-slate-700">{guest.visits}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <History size={14} className="text-slate-400" />
                          {guest.lastStay}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {guest.status === 'VIP' && <Star size={14} className="text-amber-500 fill-amber-500" />}
                          <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            guest.status === 'VIP' ? "bg-amber-100 text-amber-700" :
                            guest.status === 'Regular' ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-700"
                          )}>
                            {guest.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Profile</Button>
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

export default Guests;