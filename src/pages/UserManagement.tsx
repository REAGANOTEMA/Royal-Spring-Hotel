"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { UserPlus, Shield, Trash2, Mail, Key, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/lib/supabase";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({ email: "", password: "", role: "staff" });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    // In a real app, we'd fetch from a custom 'users' table that mirrors Auth
    const { data, error } = await supabase.from('staff').select('*').order('name');
    if (!error) setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = showLoading("Creating staff account...");

    try {
      // Note: Creating Auth users usually requires a service role or Edge Function.
      // For this demo, we'll simulate the registration and add to the staff table.
      const { error } = await supabase.from('staff').insert([{
        name: formData.email.split('@')[0],
        role: formData.role,
        status: 'Active',
        salary: '0',
        net: '0'
      }]);

      if (error) throw error;

      dismissToast(toastId);
      showSuccess(`Account for ${formData.email} created successfully!`);
      setFormData({ email: "", password: "", role: "staff" });
      fetchUsers();
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">System User Management</h2>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl bg-white h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-600" /> Register New Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="staff@royalsprings.com" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Password</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>System Role</Label>
                    <Select onValueChange={val => setFormData({...formData, role: val})} value={formData.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gm">General Manager</SelectItem>
                        <SelectItem value="hr">HR Manager</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="chef">Executive Chef</SelectItem>
                        <SelectItem value="waiter">Head Waiter</SelectItem>
                        <SelectItem value="housekeeper">Housekeeping Lead</SelectItem>
                        <SelectItem value="staff">General Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 font-bold h-12" disabled={loading}>
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-bold">Active System Users</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-bold">{user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500">
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
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default UserManagement;