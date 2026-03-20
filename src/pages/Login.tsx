"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserCheck, Briefcase, Users, Lock, Mail, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { supabase, auth, supabaseConfig } from "@/lib/supabase";
import { EnhancedSignUpForm } from "@/components/EnhancedSignUpForm";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleDemoLogin = () => {
    const normalizedDemoRole = role === 'gm' ? 'manager' : role;
    localStorage.setItem("userRole", normalizedDemoRole);
    localStorage.setItem("userName", "Royal Executive");
    localStorage.setItem("userDepartment", "Executive Board");
    localStorage.setItem("demoMode", "true");
    showSuccess(`Welcome to Royal Springs (Demo Mode: ${normalizedDemoRole.toUpperCase()})`);
    navigate("/dashboard");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // Sign up new user
        const { data } = await auth.signUp(email, password, {
          full_name: `${firstName} ${lastName}`,
          staff_level: selectedRole,
          department: selectedDepartment,
        });

        if (data.user) {
          // Create staff record after successful signup
          await supabase.from('staff').insert([{
            id: data.user.id,
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            auth_email: email,
            department: selectedDepartment,
            position: selectedRole === 'director' ? 'Director' : selectedRole === 'gm' ? 'General Manager' : selectedRole === 'hr' ? 'HR Manager' : 'Staff Member',
            staff_level: selectedRole,
            role: selectedRole,
            status: 'Active',
            is_active: true,
          }]);

          showSuccess(`Account created! Welcome to Royal Springs, ${firstName}!`);
          navigate('/dashboard');
        }
      } else {
        // Sign in existing user
        const { data } = await auth.signIn(email, password);

        let userDepartment = '';
        let userRole = selectedRole;

        // Read from staff table for stronger RBAC and department assignment
        try {
          const { data: staffRecord } = await supabase
            .from('staff')
            .select('department, staff_level')
            .or(`auth_email.eq.${email},email.eq.${email}`)
            .single();

          if (staffRecord) {
            userDepartment = staffRecord.department || '';
            userRole = staffRecord.staff_level || userRole;
          }
        } catch (err) {
          console.warn("Could not fetch staff record:", err);
        }

        const userName = data.user?.user_metadata?.full_name || email.split('@')[0];

        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userDepartment", userDepartment || '');

        showSuccess(`Welcome back, ${userName}!`);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      showError(err.message || "Authentication failed. Please try again.");
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

      <Card className="w-full max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl relative z-10 rounded-[2.5rem] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
        
        {!isSignup ? (
          <>
            <CardHeader className="text-center space-y-4 pt-10">
              <div className="flex justify-center mb-2">
                <img src="/logo.png" alt="Royal Springs Logo" className="h-24 object-contain drop-shadow-xl" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Royal Springs ERP</CardTitle>
                <CardDescription className="text-slate-500 font-medium mt-1">
                  Secure Executive Portal
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-10">
              <form onSubmit={handleAuth} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      type="email"
                      placeholder="your@email.com"
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
                    {loading ? "Connecting..." : "Sign In"}
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
                  Need an account? Sign Up
                </button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="px-8 py-10 max-h-[85vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
                  <p className="text-sm text-slate-500 mt-1">Join Royal Springs Hotel Management</p>
                </div>
                <button
                  onClick={() => setIsSignup(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>
              
              <EnhancedSignUpForm 
                onSuccess={() => {
                  showSuccess("Account created! Signing you in...");
                  setIsSignup(false);
                  setEmail("");
                  setPassword("");
                }}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;