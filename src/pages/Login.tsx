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
        if (!allowedRoles.includes(role)) {
          showError("🚫 This role is not allowed!");
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

        showSuccess(`✨ Account created for ${role.toUpperCase()}! Check your email ✉️`);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const userRole = data.user?.user_metadata?.role;
        if (userRole && allowedRoles.includes(userRole)) {
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userEmail", email);
          showSuccess(`✅ Logged in as ${userRole.toUpperCase()}`);
          navigate("/dashboard");
        } else {
          showError("🚫 Unauthorized role. Access denied.");
        }
      }
    } catch (err: any) {
      showError(err.message || "❌ Authentication failed.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4 relative overflow-hidden">
      {/* Background emoji overlay */}
      <div className="absolute top-0 left-0 w-full h-full text-white opacity-10 text-[80px] grid grid-cols-6 gap-4 pointer-events-none animate-pulse">
        🌟💎👑💼🛡️✨👥🌙💰🧾
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-lg relative z-10 transform transition-transform hover:scale-105 duration-500">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Royal Springs Logo" className="h-20 object-contain animate-bounce" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-wide animate-fadeIn">Royal Springs ERP</CardTitle>
          <CardDescription className="text-slate-600">{isSignup ? "Create your luxurious account 💎" : "Secure Access Portal 🔐"}</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Role selection */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center h-20 gap-1 p-2 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                  role === r.id ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xl" : "border-slate-100 text-slate-500"
                )}
                onClick={() => setRole(r.id)}
              >
                <r.icon size={24} className="animate-bounce" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  type="email"
                  placeholder="name@royalsprings.com"
                  className="pl-12 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-600 text-lg font-extrabold h-12 shadow-xl transform transition-transform hover:scale-105"
            >
              {loading ? (isSignup ? "Creating..." : "Logging in...") : isSignup ? "Sign Up ✨" : "Login 🔐"}
            </Button>
          </form>

          {/* Switch mode */}
          <div className="mt-4 text-center text-sm text-slate-600">
            {isSignup ? (
              <button className="text-blue-600 font-bold hover:underline" onClick={() => setIsSignup(false)}>
                Already have an account? Login 🔑
              </button>
            ) : (
              <button className="text-blue-600 font-bold hover:underline" onClick={() => setIsSignup(true)}>
                Create an account ✨
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;