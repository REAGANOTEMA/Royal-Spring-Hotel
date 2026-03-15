"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Shield, User, Users, Lock, UserCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<string>('staff');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, we use supabase.auth.signInWithPassword
    // For this demo, we simulate the role-based session
    localStorage.setItem('userRole', role);
    showSuccess(`Logged in as ${role.replace('_', ' ').toUpperCase()}`);
    navigate('/dashboard');
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showSuccess("Registration request sent to HR! You will be able to login once approved.");
    setIsRegistering(false);
    setLoading(false);
  };

  const roles = [
    { id: 'director', label: 'Director', icon: Shield },
    { id: 'general_manager', label: 'GM', icon: UserCheck },
    { id: 'hr', label: 'HR', icon: Briefcase },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white">
              <Hotel size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Royal Springs ERP</CardTitle>
          <CardDescription>
            {isRegistering ? "Create your staff account" : "Select your role to access the system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isRegistering ? (
            <>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {roles.map((r) => (
                  <button 
                    key={r.id}
                    type="button"
                    className={cn(
                      "flex flex-col items-center justify-center h-20 gap-1 p-1 rounded-lg border-2 transition-all",
                      role === r.id ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 hover:border-slate-200 text-slate-500"
                    )}
                    onClick={() => setRole(r.id)}
                  >
                    <r.icon size={18} />
                    <span className="text-[10px] font-bold">{r.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Access ID / Email</Label>
                  <Input placeholder="Enter your ID" required />
                </div>
                <div className="space-y-2">
                  <Label>Security Pin</Label>
                  <Input type="password" placeholder="••••" required />
                </div>
                <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-semibold">
                  {loading ? "Authenticating..." : "Secure Login"}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setIsRegistering(true)} className="text-sm text-blue-600 font-medium hover:underline">
                    New Staff? Register here
                  </button>
                </div>
              </form>
            </>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter your full name" required />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input placeholder="e.g. Housekeeping, Kitchen" required />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="yourname@royalsprings.com" required />
              </div>
              <div className="space-y-2">
                <Label>Desired Password</Label>
                <Input type="password" placeholder="••••••••" required />
              </div>
              <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg font-semibold">
                {loading ? "Processing..." : "Request Account"}
              </Button>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setIsRegistering(false)} className="text-sm text-slate-500 font-medium hover:underline">
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;