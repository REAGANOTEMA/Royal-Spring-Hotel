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
import { supabase } from "@/lib/supabaseClient";

const allowedRoles = ["director", "gm", "hr", "staff"];

const roles = [
  { id: "director", label: "Director", icon: Shield },
  { id: "gm", label: "GM", icon: UserCheck },
  { id: "hr", label: "HR", icon: Briefcase },
  { id: "staff", label: "Staff", icon: Users },
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
        if (!allowedRoles.includes(role)) {
          showError("This role is not allowed!");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });

        if (error) throw error;

        showSuccess(`Account created for ${role.toUpperCase()}! Check your email to confirm.`);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const userRole = data.user?.user_metadata?.role;
        if (userRole && allowedRoles.includes(userRole)) {
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userEmail", email);
          showSuccess(`Logged in as ${userRole.toUpperCase()}`);
          navigate("/dashboard");
        } else {
          showError("Unauthorized role. Access denied.");
        }
      }
    } catch (err: any) {
      showError(err.message || "Authentication failed.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Royal Springs Logo" className="h-20 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Royal Springs ERP</CardTitle>
          <CardDescription>{isSignup ? "Create your account" : "Secure Access Portal"}</CardDescription>
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

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
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
              <Label>Password</Label>
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
              {loading ? (isSignup ? "Creating..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            {isSignup ? (
              <button className="text-blue-600 font-bold" onClick={() => setIsSignup(false)}>
                Already have an account? Login
              </button>
            ) : (
              <button className="text-blue-600 font-bold" onClick={() => setIsSignup(true)}>
                Create an account
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;