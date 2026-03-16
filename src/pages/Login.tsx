"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck, Briefcase, Users, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('staff');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Specific Owner Credentials
    if (email === 'joseph.byabazaire@enable.be' && password === '123456') {
      localStorage.setItem('userRole', 'director');
      localStorage.setItem('userName', 'Joseph Byabazaire');
      showSuccess("Welcome back, Director Joseph.");
      navigate('/dashboard');
      setLoading(false);
      return;
    }

    // Mock logic for other roles (In production, this connects to Supabase Auth)
    if (password === '123456') {
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', email.split('@')[0]);
      showSuccess(`Logged in as ${role.toUpperCase()}`);
      navigate('/dashboard');
    } else {
      showError("Invalid credentials. Please check your email and password.");
    }
    setLoading(false);
  };

  const roles = [
    { id: 'director', label: 'Director', icon: Shield },
    { id: 'general_manager', label: 'GM', icon: UserCheck },
    { id: 'hr', label: 'HR', icon: Briefcase },
    { id: 'staff', label: 'Staff', icon: Users },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
      
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Royal Springs Logo" className="h-20 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Royal Springs ERP</CardTitle>
          <CardDescription>Secure Access Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {roles.map((r) => (
              <button 
                key={r.id}
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center h-20 gap-1 p-1 rounded-xl border-2 transition-all",
                  role === r.id ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 hover:border-slate-200 text-slate-500"
                )}
                onClick={() => setRole(r.id)}
              >
                <r.icon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  type="email" 
                  placeholder="name@royalsprings.com" 
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Security Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <Button disabled={loading} type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-12 text-lg font-bold shadow-lg shadow-blue-900/20">
              {loading ? "Verifying..." : "Secure Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;