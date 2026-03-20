"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  User, Mail, Briefcase, Calendar, Banknote, Camera, ShieldCheck, Lock, Wallet, TrendingDown, Phone, MapPin, Clock, Save, Building2, Eye, EyeOff, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase, auth, db } from "@/lib/supabase";

const Profile: React.FC = () => {
  const [staff, setStaff] = useState<any>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "password" | "email" | "attendance">("general");
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "", confirmEmail: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [currentHours, setCurrentHours] = useState<number>(0);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchProfile = async () => {
    const name = localStorage.getItem("userName") || "Staff Member";
    try {
      const staffData = await db.fetch('staff', {
        where: `name.eq.${name}`,
        single: true
      });
      
      if (staffData && staffData.length > 0) {
        setStaff(staffData[0]);
        setFormData(staffData[0]);
        
        const attendData = await db.fetch('check_in_logs', {
          where: `staff_id.eq.${staffData[0].id}`,
          orderBy: { column: 'check_in', ascending: false }
        });
        setAttendance(attendData || []);

        const { data: recognitionData } = await supabase
          .from('employee_recognition')
          .select('*')
          .eq('staff_id', staffData[0].id)
          .eq('recognition_type', 'employee_of_month')
          .order('effective_date', { ascending: false })
          .limit(1);
        setRecognition(recognitionData?.[0] || null);
        
        // Check if currently checked in
        if (attendData && attendData.length > 0) {
          const latestLog = attendData[0];
          if (!latestLog.check_out) {
            setIsCheckedIn(true);
            // Calculate current hours
            const checkInTime = new Date(latestLog.check_in).getTime();
            const now = new Date().getTime();
            const hours = (now - checkInTime) / (1000 * 60 * 60);
            setCurrentHours(Math.round(hours * 100) / 100);
          } else {
            setIsCheckedIn(false);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!isCheckedIn || !attendance || attendance.length === 0) return;
    
    const latestLog = attendance[0];
    if (latestLog.check_out) return;

    const interval = setInterval(() => {
      const checkInTime = new Date(latestLog.check_in).getTime();
      const now = new Date().getTime();
      const hours = (now - checkInTime) / (1000 * 60 * 60);
      setCurrentHours(Math.round(hours * 100) / 100);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isCheckedIn, attendance]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !staff) return;

    const toastId = showLoading("Uploading profile image...");
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const { error } = await supabase.from('staff').update({ avatar_url: base64 }).eq('id', staff.id);
      if (error) showError(error.message);
      else {
        setStaff({ ...staff, avatar_url: base64 });
        showSuccess("Profile picture updated!");
      }
      dismissToast(toastId);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const toastId = showLoading("Saving profile changes...");
    const { error } = await supabase.from('staff').update({
      phone: formData.phone,
      address: formData.address,
      bio: formData.bio
    }).eq('id', staff.id);

    dismissToast(toastId);
    if (error) showError(error.message);
    else {
      showSuccess("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    }
  };

  const validatePasswordChange = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordChange()) return;

    setLoading(true);
    const toastId = showLoading("Updating password...");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      dismissToast(toastId);
      showSuccess("Password updated successfully!");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const validateEmailChange = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!emailForm.newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) {
      newErrors.newEmail = "Valid email is required";
    }

    if (emailForm.newEmail !== emailForm.confirmEmail) {
      newErrors.confirmEmail = "Emails do not match";
    }

    if (emailForm.newEmail === staff.email) {
      newErrors.newEmail = "New email must be different from current email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailChange()) return;

    setLoading(true);
    const toastId = showLoading("Updating email...");

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail,
      });

      if (error) throw error;

      // Update staff record with new email
      await supabase
        .from("staff")
        .update({ email: emailForm.newEmail, auth_email: emailForm.newEmail })
        .eq("id", staff.id);

      dismissToast(toastId);
      showSuccess("Email update initiated! Check your new email for verification.");

      setEmailForm({
        newEmail: "",
        confirmEmail: "",
      });

      setStaff({ ...staff, email: emailForm.newEmail });
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleClockAction = async () => {
    if (!staff) return;

    const toastId = showLoading(isCheckedIn ? "Clocking out..." : "Clocking in...");

    try {
      if (isCheckedIn) {
        // Check out
        const checkOutTime = new Date();
        const latestLog = attendance[0];
        const checkInTime = new Date(latestLog.check_in).getTime();
        const checkOutTimeMs = checkOutTime.getTime();
        const hoursWorked = Math.round(((checkOutTimeMs - checkInTime) / (1000 * 60 * 60)) * 100) / 100;

        await supabase
          .from('check_in_logs')
          .update({
            check_out: checkOutTime.toISOString(),
            total_hours: hoursWorked
          })
          .eq('id', latestLog.id);

        setIsCheckedIn(false);
        setCurrentHours(0);
        dismissToast(toastId);
        showSuccess(`Checked out! You worked ${hoursWorked} hours.`);
      } else {
        // Check in
        const checkInTime = new Date();
        const attendData = await db.fetch('check_in_logs', {
          where: `staff_id.eq.${staff.id}`,
          orderBy: { column: 'check_in', ascending: false }
        });

        if (attendData.length > 0 && !attendData[0].check_out) {
          throw new Error("You are already checked in.");
        }

        const result = await db.insert('check_in_logs', [{
          staff_id: staff.id,
          staff_name: staff.name,
          check_in: checkInTime.toISOString(),
          check_out: null,
          total_hours: 0
        }]);

        if (result.error) throw result.error;

        setIsCheckedIn(true);
        setCurrentHours(0);
        dismissToast(toastId);
        showSuccess("Checked in successfully!");
      }

      fetchProfile();
    } catch (err: any) {
      dismissToast(toastId);
      showError(err.message || "Failed to update clock status");
    }
  };

  if (!staff) return <div className="h-screen flex items-center justify-center font-black text-blue-600">Loading Profile...</div>;

  const totalHours = attendance.reduce((acc, log) => acc + (parseFloat(log.total_hours) || 0), 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">My Profile</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Manage Your Account</p>
            </div>
          </div>
          <img src="/logo.png" alt="Royal Springs" className="h-12 object-contain" />
        </header>

        {recognition && (
          <div className="p-6 max-w-6xl mx-auto">
            <Alert variant="default" className="rounded-2xl border-emerald-200 bg-emerald-50">
              <div className="flex flex-col gap-2">
                <p className="font-black text-sm text-emerald-800">Congratulations!</p>
                <p className="text-sm text-emerald-700">You are recognized as <strong>Employee of the Month</strong> for {new Date(recognition.effective_date).toLocaleDateString()}.</p>
                <p className="text-xs text-emerald-600">{recognition.notes}</p>
              </div>
            </Alert>
          </div>
        )}

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Tabs */}
          <div className="flex gap-4 border-b flex-wrap">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "general"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <User size={18} className="inline mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "password"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Lock size={18} className="inline mr-2" />
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "email"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Mail size={18} className="inline mr-2" />
              Change Email
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "attendance"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Clock size={18} className="inline mr-2" />
              Attendance & Clock
            </button>
          </div>

          {/* General Info Tab */}
          {activeTab === "general" && (
            <>
              <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[2.5rem]">
                <div className="h-40 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900" />
                <CardContent className="relative pt-0 pb-10 px-10">
                  <div className="flex flex-col md:flex-row items-end gap-8 -mt-16 mb-8">
                    <div className="relative group">
                      <Avatar className="h-40 w-40 border-8 border-white shadow-2xl rounded-[2.5rem]">
                        <AvatarImage src={staff.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-slate-100 text-blue-600 text-5xl font-black">
                          {staff.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all cursor-pointer hover:scale-110">
                        <Camera size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <div className="flex-1 pb-4 w-full">
                      <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{staff.name}</h1>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Badge className="bg-blue-700 text-white font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                          {staff.position}
                        </Badge>
                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                          {staff.department}
                        </Badge>
                        <span className="text-slate-400 font-bold text-sm flex items-center gap-1">
                          <Calendar size={14} /> Joined {staff.joined_at}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="font-bold text-slate-700">{staff.email || 'Not set'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                      {isEditing ? (
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-10 rounded-xl" />
                      ) : (
                        <p className="font-bold text-slate-700">{staff.phone || 'Not set'}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
                      <p className="font-bold text-slate-700">{staff.date_of_birth || 'Not set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="bg-slate-900 text-white p-8">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Clock size={20} className="text-blue-400" /> Attendance & Work Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total Hours Worked</p>
                        <h3 className="text-3xl font-black text-slate-900">{parseFloat(staff.total_hours || 0).toFixed(1)} hrs</h3>
                      </div>
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Shift Count</p>
                        <h3 className="text-3xl font-black text-slate-900">{attendance.length} Shifts</h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Shift Logs</h4>
                      <div className="space-y-3">
                        {attendance.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                              <p className="font-bold text-slate-700">{new Date(log.check_in).toLocaleDateString()}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {new Date(log.check_in).toLocaleTimeString()} - {log.check_out ? new Date(log.check_out).toLocaleTimeString() : 'Active'}
                              </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 font-black">{log.total_hours || '0'}h</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-8">
                      <CardTitle className="text-lg font-bold">Professional Bio</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      {isEditing ? (
                        <Textarea 
                          value={formData.bio} 
                          onChange={e => setFormData({...formData, bio: e.target.value})} 
                          placeholder="Tell us about your professional background..." 
                          className="min-h-[150px] rounded-2xl"
                        />
                      ) : (
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {staff.bio || "No bio provided yet. Click edit to add your professional summary."}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-blue-700 text-white rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl"><Wallet size={24} /></div>
                        <div>
                          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Net Payable</p>
                          <h3 className="text-2xl font-black">UGX {parseFloat(staff.net || 0).toLocaleString()}</h3>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="opacity-60">Base Salary</span>
                          <span>UGX {parseFloat(staff.salary || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-red-300">
                          <span>Deductions</span>
                          <span>-UGX {parseFloat(staff.deduction || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-xl">
                      <Save size={18} className="mr-2" /> SAVE CHANGES
                    </Button>
                    <Button onClick={() => setIsEditing(false)} className="bg-slate-600 hover:bg-slate-700 font-black rounded-xl">
                      CANCEL
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 font-black rounded-xl">
                    EDIT PROFILE
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden max-w-md">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Lock size={20} className="text-blue-400" /> Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Please fix the errors below</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter your current password"
                        className="h-12 rounded-xl bg-slate-50 border-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            current: !showPassword.current,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <span className="text-xs text-red-500">{errors.currentPassword}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password (min 8 characters)"
                        className="h-12 rounded-xl bg-slate-50 border-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            new: !showPassword.new,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <span className="text-xs text-red-500">{errors.newPassword}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm your new password"
                        className="h-12 rounded-xl bg-slate-50 border-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirm: !showPassword.confirm,
                          })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-xs text-red-500">{errors.confirmPassword}</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-semibold"
                  >
                    <Lock size={18} className="mr-2" /> Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Change Email Tab */}
          {activeTab === "email" && (
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden max-w-md">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Mail size={20} className="text-blue-400" /> Change Email Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleEmailChange} className="space-y-6">
                  {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Please fix the errors below</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Current Email</Label>
                    <Input
                      value={staff.email}
                      disabled
                      className="h-12 rounded-xl bg-slate-50 border-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">New Email Address</Label>
                    <Input
                      type="email"
                      value={emailForm.newEmail}
                      onChange={(e) =>
                        setEmailForm({
                          ...emailForm,
                          newEmail: e.target.value,
                        })
                      }
                      placeholder="Enter new email address"
                      className="h-12 rounded-xl bg-slate-50 border-none"
                    />
                    {errors.newEmail && (
                      <span className="text-xs text-red-500">{errors.newEmail}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Confirm New Email Address</Label>
                    <Input
                      type="email"
                      value={emailForm.confirmEmail}
                      onChange={(e) =>
                        setEmailForm({
                          ...emailForm,
                          confirmEmail: e.target.value,
                        })
                      }
                      placeholder="Re-enter new email address"
                      className="h-12 rounded-xl bg-slate-50 border-none"
                    />
                    {errors.confirmEmail && (
                      <span className="text-xs text-red-500">{errors.confirmEmail}</span>
                    )}
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                    <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                      You'll receive a verification email at your new address. Please verify to complete the change.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-semibold"
                  >
                    <Mail size={18} className="mr-2" /> Update Email Address
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              {/* Clock Control Card */}
              <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Clock size={20} /> Clock In / Clock Out
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center gap-6">
                    {/* Status Display */}
                    <div className="text-center">
                      <div className={`inline-block px-6 py-2 rounded-full font-bold text-white mb-4 ${
                        isCheckedIn ? "bg-emerald-600" : "bg-slate-400"
                      }`}>
                        Status: {isCheckedIn ? "CLOCKED IN" : "CLOCKED OUT"}
                      </div>
                      
                      {isCheckedIn && attendance && attendance.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600">
                            Checked in: {new Date(attendance[0].check_in).toLocaleTimeString()}
                          </p>
                          <p className="text-4xl font-black text-blue-600">
                            {currentHours.toFixed(2)} Hours
                          </p>
                          <p className="text-xs text-slate-500">Time elapsed today</p>
                        </div>
                      )}
                    </div>

                    {/* Clock Button */}
                    <Button
                      onClick={handleClockAction}
                      disabled={loading}
                      className={`w-full h-16 text-lg font-black rounded-2xl transition-all ${
                        isCheckedIn
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <Clock size={24} className="mr-2" />
                      {isCheckedIn ? "CLOCK OUT" : "CLOCK IN"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Attendance Records */}
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Calendar size={20} /> Recent Attendance Records
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {attendance && attendance.length > 0 ? (
                    <div className="space-y-3">
                      {attendance.slice(0, 10).map((log, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {new Date(log.check_in).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-600">
                              {new Date(log.check_in).toLocaleTimeString()} to{" "}
                              {log.check_out ? new Date(log.check_out).toLocaleTimeString() : "Still working..."}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-blue-600 text-lg">
                              {log.total_hours || (isCheckedIn && index === 0 ? currentHours.toFixed(2) : "0")} hrs
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-6">No attendance records yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Summary Statistics */}
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingDown size={20} /> Monthly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <p className="text-xs text-slate-600 font-bold uppercase mb-2">Total Hours</p>
                      <p className="text-3xl font-black text-blue-600">{totalHours.toFixed(1)}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl text-center">
                      <p className="text-xs text-slate-600 font-bold uppercase mb-2">Days Worked</p>
                      <p className="text-3xl font-black text-emerald-600">{attendance ? attendance.filter(a => a.check_out).length : 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                      <p className="text-xs text-slate-600 font-bold uppercase mb-2">Avg Per Day</p>
                      <p className="text-3xl font-black text-purple-600">
                        {attendance && attendance.filter(a => a.check_out).length > 0
                          ? (totalHours / attendance.filter(a => a.check_out).length).toFixed(1)
                          : "0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Profile;