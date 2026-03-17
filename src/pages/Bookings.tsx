"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  guest: string;
  room: string;
  status: string;
  amount: string;
  check_in?: string;
  check_out?: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) showError(error.message);
    else setBookings(data as Booking[]);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, roomId: string, newStatus: string) => {
    try {
      // 1. Update Booking Status
      const { error: bError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (bError) throw bError;

      // 2. Update Room Status based on Booking Status
      let roomStatus = "Available";
      if (newStatus === "Checked In") roomStatus = "Occupied";
      if (newStatus === "Checked Out") roomStatus = "Cleaning";

      const { error: rError } = await supabase
        .from("rooms")
        .update({ status: roomStatus })
        .eq("id", roomId);

      if (rError) throw rError;

      showSuccess(`Guest ${newStatus} successfully.`);
      fetchBookings();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const { error } = await supabase.from("bookings").delete().eq("id", selectedId);
    if (error) showError(error.message);
    else {
      showSuccess("Reservation deleted.");
      fetchBookings();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Reservations & Front Desk</h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> New Reservation
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Guest Name</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Amount</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-semibold">{booking.guest}</TableCell>
                      <TableCell>Room {booking.room}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "px-2 py-0.5 font-medium rounded-full",
                          booking.status === "Confirmed" ? "bg-blue-100 text-blue-700" :
                          booking.status === "Checked In" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">{booking.amount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "Confirmed" && (
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusUpdate(booking.id, booking.room, "Checked In")}>
                              <CheckCircle2 size={14} className="mr-1" /> Check In
                            </Button>
                          )}
                          {booking.status === "Checked In" && (
                            <Button size="sm" variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => handleStatusUpdate(booking.id, booking.room, "Checked Out")}>
                              <LogOut size={14} className="mr-1" /> Check Out
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(booking.id); setIsDeleteModalOpen(true); }}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
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

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setBookings={setBookings} />
      <DeleteDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
    </div>
  );
};

export default Bookings;