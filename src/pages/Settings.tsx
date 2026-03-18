"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Settings as SettingsIcon, Save, Globe, Mail, Phone, MapPin, DollarSign, Percent, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    hotel_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    currency: "UGX",
    tax_rate: "18"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (data) setConfig(data);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = showLoading("Updating system configuration...");

    try {
      const { error } = await supabase
        .from('settings')
        .update(config)
        .eq('id', 'hotel_config');

      if (error) throw error;

      dismissToast(toastId);
      showSuccess("Hotel settings updated successfully!");
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">System Settings</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Global Configuration</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800 font-black h-12 px-8 rounded-xl shadow-lg shadow-blue-900/20" disabled={loading}>
            <Save size={18} className="mr-2" /> SAVE CHANGES
          </Button>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Info */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Globe size={20} className="text-blue-400" /> General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Hotel Name</Label>
                  <Input value={config.hotel_name} onChange={e => setConfig({...config, hotel_name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Contact Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input value={config.contact_email} onChange={e => setConfig({...config, contact_email: e.target.value})} className="pl-12 h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Contact Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input value={config.contact_phone} onChange={e => setConfig({...config, contact_phone: e.target.value})} className="pl-12 h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial & Location */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <DollarSign size={20} className="text-blue-400" /> Financial & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Physical Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="pl-12 h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Currency</Label>
                    <Input value={config.currency} onChange={e => setConfig({...config, currency: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Tax Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input type="number" value={config.tax_rate} onChange={e => setConfig({...config, tax_rate: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">These settings affect all invoices, reports, and public-facing documents generated by the system.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Settings;