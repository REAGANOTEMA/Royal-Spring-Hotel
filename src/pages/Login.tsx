"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserCheck, Briefcase, Users, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { supabase, supabaseConfig } from "@/lib/supabase";

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
  const [role, setRole] = useState<string>("director");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleDemoLogin = () => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", "Royal Executive");
    localStorage.setItem("demoMode", "true");
    showSuccess(`Welcome to Royal Springs (Demo Mode: ${role.toUpperCase()})`);
    navigate("/dashboard");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              role, 
              full_name: email.split('@')[0] 
            },
          },
        });

        if (error) throw error;
        
        if (data.user && data.session) {
          // Create staff record automatically
          await supabase.from('staff').insert([{
            id: data.user.id,
            name: email.split('@')[0],
            email: email,
            role: role,
            status: 'Active'
          }]);

          showSuccess("Account created and logged in!");
          localStorage.setItem("userRole", role);
          localStorage.setItem("userName", email.split('@')[0]);
          navigate("/dashboard");
        } else {
          showSuccess("Account created! Please check your email for verification.");
          setIsSignup(false);
        }
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
      console.error("Auth Error:", err);
      console.warn(
        "Supabase config (for debugging):",
        supabaseConfig.url,
        "anon key length:",
        supabaseConfig.anonKeyLength
      );

      showError(
        (err?.message || "Authentication failed. Please try again.") +
          "\n(See console for Supabase config details.)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-xl relative z-10 rounded-[2.5rem] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Royal Springs Logo" className="h-24 object-contain drop-shadow-xl" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Royal Springs ERP</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">
              {isSignup ? "Create your executive account" : "Secure Executive Portal"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <div className="grid grid-cols-4 gap-3 mb-8">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center h-20 gap-1.5 p-2 rounded-2xl border-2 transition-all duration-300",
                  role === r.id 
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-inner scale-105" 
                    : "border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setRole(r.id)}
              >
                <r.icon size={22} />
                <span className="text-[10px] font-black uppercase tracking-widest">{r.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="email"
                  placeholder="executive@royalsprings.com"
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-black h-14 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                {loading ? "Connecting..." : isSignup ? "Create Account" : "Sign In"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full border-2 border-slate-100 text-slate-600 h-14 rounded-2xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} className="text-amber-500" />
                Demo Access (Review Only)
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button 
              className="text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors" 
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;