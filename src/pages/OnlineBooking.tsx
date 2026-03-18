"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hotel,
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import { showSuccess, showLoading, dismissToast, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const OnlineBooking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "Standard Room - UGX 150,000",
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      const loadingId = showLoading("Processing secure payment...");

      try {
        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Save to Supabase
        const { error } = await supabase.from('bookings').insert([{
          guest: `${formData.firstName} ${formData.lastName}`,
          room: formData.roomType.split(' - ')[0],
          status: 'Confirmed',
          amount: formData.roomType.split('UGX ')[1],
          check_in: formData.checkIn,
          check_out: formData.checkOut
        }]);

        if (error) throw error;

        dismissToast(loadingId);
        showSuccess(
          `Booking Confirmed! We look forward to seeing you, ${formData.firstName}.`
        );
        navigate("/");
      } catch (err: any) {
        dismissToast(loadingId);
        showError(err.message || "Failed to complete booking.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="h-20 border-b bg-white px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Royal Springs Logo" className="h-12 object-contain" />
          <span className="font-bold text-slate-900 hidden sm:inline">Royal Springs Resort</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", step >= i ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500")}>
                {i}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Button variant="ghost" className="mb-6 text-slate-500 hover:text-slate-900" onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))} disabled={isProcessing}>
          <ChevronLeft size={18} className="mr-1" /> Back
        </Button>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-blue-700 text-white p-8">
            <CardTitle className="text-2xl font-bold">
              {step === 1 && "Select Your Stay"}
              {step === 2 && "Guest Information"}
              {step === 3 && "Secure Payment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleBooking} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Check-in Date</Label>
                      <Input type="date" className="h-12 rounded-xl" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Check-out Date</Label>
                      <Input type="date" className="h-12 rounded-xl" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Room Type</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {["Standard Room - UGX 150,000", "Deluxe Suite - UGX 250,000", "Presidential Suite - UGX 450,000"].map((room) => (
                        <label key={room} className="flex items-center p-4 border rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors border-slate-200 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                          <input type="radio" name="room" className="w-4 h-4 text-blue-600" checked={formData.roomType === room} onChange={() => setFormData({...formData, roomType: room})} required />
                          <span className="ml-3 font-bold text-slate-700">{room}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">First Name</Label>
                      <Input placeholder="John" className="h-12 rounded-xl" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Last Name</Label>
                      <Input placeholder="Doe" className="h-12 rounded-xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Email Address</Label>
                    <Input type="email" placeholder="john@example.com" className="h-12 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Phone Number</Label>
                    <Input placeholder="+256 700 000 000" className="h-12 rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                      <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Merchant</span>
                      <span className="font-bold text-blue-400">Royal Springs Resort</span>
                    </div>
                    <div className="pt-2 flex justify-between text-2xl font-black text-blue-400">
                      <span>Total to Pay</span>
                      <span>{formData.roomType.split(' - ')[1]}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                      <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
                      <p className="text-xs text-blue-800 leading-relaxed font-medium">Your payment is encrypted and processed directly to the Royal Springs Resort merchant account.</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Card Number</Label>
                      <Input placeholder="0000 0000 0000 0000" className="h-12 rounded-xl" required />
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-16 text-xl font-black bg-blue-700 hover:bg-blue-800 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20" disabled={isProcessing}>
                {isProcessing ? "Processing..." : step === 3 ? "Pay & Confirm Booking" : "Continue to Next Step"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OnlineBooking;