"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { Calendar as CalendarIcon, Search, Plus, Filter, MoreVertical, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const bookingsData = [
  { id: 'BK-1001', guest: 'John Doe', room: '204', type: 'Deluxe', checkIn: '2024-05-20', checkOut: '2024-05-23', status: 'Confirmed', amount: '750,000' },
  { id: 'BK-1002', guest: 'Sarah Smith', room: '105', type: 'Standard', checkIn: '2024-05-21', checkOut: '2024-05-22', status: 'Checked In', amount: '150,000' },
  { id: 'BK-1003', guest: 'Michael Brown', room: '301', type: 'Suite', checkIn: '2024-05-22', checkOut: '2024-05-25', status: 'Pending', amount: '1,350,000' },
  { id: 'BK-1004', guest: 'Emma Wilson', room: '208', type: 'Deluxe', checkIn: '2024-05-23', checkOut: '2024-05-24', status: 'Cancelled', amount: '250,000' },
  { id: 'BK-1005', guest: 'David Miller', room: '102', type: 'Standard', checkIn: '2024-05-24', checkOut: '2024-05-27', status: 'Confirmed', amount: '450,000' },
];

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Reservations & Bookings</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> New Reservation
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CalendarIcon size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Total Bookings</p>
                  <p className="text-lg font-bold">124</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Confirmed</p>
                  <p className="text-lg font-bold">86</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Pending</p>
                  <p className="text-lg font-bold">12</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><XCircle size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Cancelled</p>
                  <p className="text-lg font-bold">5</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-lg">Booking List</CardTitle>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input className="pl-9 h-9" placeholder="Search guest or ID..." />
                  </div>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter size={16} className="mr-2" /> Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Booking ID</TableHead>
                    <TableHead className="font-bold">Guest Name</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Check In</TableHead>
                    <TableHead className="font-bold">Check Out</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Amount (UGX)</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingsData.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-600">{booking.id}</TableCell>
                      <TableCell className="font-semibold">{booking.guest}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">Room {booking.room}</span>
                          <span className="text-xs text-slate-500">{booking.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.checkIn}</TableCell>
                      <TableCell>{booking.checkOut}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-2 py-0.5",
                          booking.status === 'Confirmed' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                          booking.status === 'Checked In' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                          booking.status === 'Pending' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                          "bg-red-100 text-red-700 hover:bg-red-100"
                        )}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">{booking.amount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
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
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Bookings;