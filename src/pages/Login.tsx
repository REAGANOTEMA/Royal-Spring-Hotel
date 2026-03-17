"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserCheck, Briefcase, Users, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const roles = [
  { id: "director", label: "Director 👑", icon: Shield },
  { id: "gm", label: "GM 🛡️", icon: UserCheck },
  { id: "hr", label: "HR 💼", icon: Briefcase },
  { id: "staff", label: "Staff 👥", icon: Users },
];

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("staff");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, full_name: email.split('@')[0] },
          },
        });

        if (error) throw error;
        showSuccess("Account created! Please check your email for verification.");
        setIsSignup(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const userRole = data.user?.user_metadata?.role || 'staff';
        const userName = data.user?.user_metadata?.full_name || email.split('@')[0];
        
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userName", userName);
        
        showSuccess(`Welcome back, ${userName}!`);
        navigate("/dashboard");
      }
    } catch (err: any) {
      showError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full text-white opacity-5 text-[80px] grid grid-cols-6 gap-4 pointer-events-none">
        🌟💎👑💼🛡️✨👥🌙💰🧾
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-lg relative z-10">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Royal Springs Logo" className="h-20 object-contain" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-wide">Royal Springs ERP</CardTitle>
          <CardDescription className="text-slate-600">
            {isSignup ? "Create your staff account" : "Secure Access Portal"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center h-20 gap-1 p-2 rounded-xl border-2 transition-all",
                  role === r.id ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md" : "border-slate-100 text-slate-500"
                )}
                onClick={() => setRole(r.id)}
              >
                <r.icon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{r.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="email"
                  placeholder="name@royalsprings.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-bold h-12 shadow-lg"
            >
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button 
              className="text-blue-600 font-bold hover:underline" 
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;