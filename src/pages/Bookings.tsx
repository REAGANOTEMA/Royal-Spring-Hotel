"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Make sure the path is correct
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Filter,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  guest: string;
  room: string;
  status: string;
  amount: string;
  checkIn?: string;
  checkOut?: string;
  type?: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch bookings from Supabase on mount
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings") // replace with your Supabase table name
        .select("*")
        .order("checkIn", { ascending: false });

      if (error) console.error("Error fetching bookings:", error);
      else setBookings(data as Booking[]);
    };

    fetchBookings();
  }, []);

  // Delete booking from Supabase
  const handleDelete = async () => {
    if (!selectedId) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", selectedId);

    if (error) console.error("Error deleting booking:", error);
    else {
      setBookings(bookings.filter((b) => b.id !== selectedId));
      setIsDeleteModalOpen(false);
      showSuccess("Reservation deleted.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Reservations & Bookings</h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} className="mr-2" /> New Reservation
          </Button>
        </header>

        <div className="p-8 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Booking ID</TableHead>
                    <TableHead className="font-bold">Guest Name</TableHead>
                    <TableHead className="font-bold">Room</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Amount (UGX)</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-600">{booking.id}</TableCell>
                      <TableCell className="font-semibold">{booking.guest}</TableCell>
                      <TableCell>Room {booking.room}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-2 py-0.5 font-medium rounded-full",
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "Checked In"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">{booking.amount}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => {
                            setSelectedId(booking.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setBookings={setBookings}
        bookings={bookings}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Bookings;