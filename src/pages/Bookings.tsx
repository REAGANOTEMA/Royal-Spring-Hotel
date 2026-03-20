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
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Edit,
  Eye,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { Booking } from "../types/index";

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) showError(error.message);
    else {
      setBookings(data as Booking[]);
      applyFilters(data as Booking[], searchTerm, statusFilter);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const applyFilters = (data: Booking[], search: string, status: string) => {
    let filtered = data;

    // Status filter
    if (status !== "All") {
      filtered = filtered.filter(b => b.status === status);
    }

    // Search filter
    if (search) {
      filtered = filtered.filter(b =>
        b.guest?.toLowerCase().includes(search.toLowerCase()) ||
        b.room?.toString().includes(search) ||
        (b.email && b.email.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setFilteredBookings(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(bookings, value, statusFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    applyFilters(bookings, searchTerm, status);
  };

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

  // Calculate statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    checkedIn: bookings.filter(b => b.status === "Checked In").length,
    checkedOut: bookings.filter(b => b.status === "Checked Out").length,
    totalRevenue: bookings.reduce((acc, b) => {
      const amount = typeof b.amount === 'string' ? parseFloat(b.amount.replace(/,/g, '')) : b.amount;
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0)
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Reservations & Front Desk</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Booking Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 font-black h-12 px-6 rounded-xl shadow-lg" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} className="mr-2" /> NEW RESERVATION
            </Button>
            <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Bookings</p>
                    <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CalendarIcon size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Confirmed</p>
                    <p className="text-3xl font-black text-blue-600">{stats.confirmed}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CheckCircle2 size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Checked In</p>
                    <p className="text-3xl font-black text-emerald-600">{stats.checkedIn}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <LogOut size={24} className="text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Checked Out</p>
                    <p className="text-3xl font-black text-slate-600">{stats.checkedOut}</p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Clock size={24} className="text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase mb-1">Total Revenue</p>
                    <p className="text-2xl font-black text-purple-600">{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign size={24} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  placeholder="Search by guest name, room, or email..."
                  className="pl-12 h-12 rounded-xl bg-slate-50 border-none"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["All", "Confirmed", "Checked In", "Checked Out"].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    <Filter size={14} className="inline mr-2" />
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Bookings Table */}
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-xl font-black">Reservations ({filteredBookings.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left font-bold">Guest Name</th>
                      <th className="py-4 text-left font-bold">Room</th>
                      <th className="py-4 text-left font-bold">Check-In</th>
                      <th className="py-4 text-left font-bold">Check-Out</th>
                      <th className="py-4 text-left font-bold">Status</th>
                      <th className="text-right px-8 py-4 font-bold">Amount</th>
                      <th className="text-right px-8 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors border-b">
                        <td className="px-8 py-4 font-semibold">
                          <div>
                            <p className="font-black text-slate-900">{booking.guest}</p>
                            <p className="text-xs text-slate-500">{booking.email}</p>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-blue-600">Room {booking.room}</td>
                        <td className="py-4 text-sm">
                          {booking.check_in ? new Date(booking.check_in).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 text-sm">
                          {booking.check_out ? new Date(booking.check_out).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4">
                          <Badge className={cn(
                            "px-2 py-0.5 font-black rounded-lg text-white",
                            booking.status === "Confirmed" ? "bg-blue-600" :
                            booking.status === "Checked In" ? "bg-emerald-600" :
                            booking.status === "Checked Out" ? "bg-slate-600" :
                            "bg-amber-600"
                          )}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="text-right px-8 py-4 font-black text-purple-600">{booking.amount}</td>
                        <td className="text-right px-8 py-4">
                          <div className="flex justify-end gap-2">
                            {booking.status === "Confirmed" && (
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg" onClick={() => handleStatusUpdate(booking.id, booking.room, "Checked In")}>
                                <CheckCircle2 size={14} className="mr-1" /> Check In
                              </Button>
                            )}
                            {booking.status === "Checked In" && (
                              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-black rounded-lg" onClick={() => handleStatusUpdate(booking.id, booking.room, "Checked Out")}>
                                <LogOut size={14} className="mr-1" /> Check Out
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700" title="View Details">
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => { setSelectedId(booking.id); setIsDeleteModalOpen(true); }}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                          No bookings found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchBookings} />
        <DeleteDialog
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Reservation"
          description="Are you sure you want to delete this reservation? This action cannot be undone."
        />

        <Footer />
      </main>
    </div>
  );
};

export default Bookings;