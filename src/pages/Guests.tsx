"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import DeleteDialog from "@/components/DeleteDialog";
import { Users, Search, Mail, Phone, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchGuests = async () => {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) showError(error.message);
    else {
      // Group by guest name to show unique guests
      const uniqueGuests = Array.from(new Set((data || []).map(b => b.guest))).map(name => {
        const guestBookings = data!.filter(b => b.guest === name);
        return {
          name,
          visits: guestBookings.length,
          lastStay: guestBookings[0].check_in,
          status: guestBookings.length > 3 ? 'VIP' : 'Regular',
          email: `${name.toLowerCase().replace(' ', '.')}@example.com`
        };
      });
      setGuests(uniqueGuests);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleDelete = () => {
    setGuests(guests.filter((g) => g.name !== selectedId));
    setIsDeleteModalOpen(false);
    showSuccess("Guest record removed.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Guest Management</h2>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input className="pl-10 bg-white" placeholder="Search guests..." />
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
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.name} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                              {guest.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{guest.name}</p>
                            <p className="text-xs text-slate-500">Last Stay: {guest.lastStay}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600"><Mail size={12} /> {guest.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">{guest.visits}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          guest.status === "VIP" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {guest.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(guest.name); setIsDeleteModalOpen(true); }}>
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

        <DeleteDialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
        <Footer />
      </main>
    </div>
  );
};

export default Guests;