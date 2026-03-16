// src/pages/Profile.tsx
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  Banknote,
  Camera,
  ShieldCheck,
  Target,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
import { changeUserEmail, changeUserPassword } from "@/lib/supabaseClient";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "staff";
    const name = localStorage.getItem("userName") || "Staff Member";
    setUser({
      name,
      role: role.replace("_", " ").toUpperCase(),
      email: `${name.toLowerCase().replace(" ", ".")}@royalsprings.com`,
      dept: role === "director" ? "Management" : "Operations",
      joined: "Jan 2024",
    });
  }, []);

  // Handle selecting a new profile picture from device
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image locally
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target?.result as string);
    reader.readAsDataURL(file);

    showSuccess("Profile picture updated successfully!");
  };

  // Update email and/or password
  const handleUpdateProfile = async () => {
    try {
      if (newEmail) await changeUserEmail(newEmail);
      if (newPassword) await changeUserPassword(newPassword);
      showSuccess("Profile updated successfully!");
      setUser((prev: any) => ({ ...prev, email: newEmail || prev.email }));
      setNewEmail("");
      setNewPassword("");
    } catch (err: any) {
      showError(err.message || "Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">My Royal Profile</h2>
          <Badge className="bg-blue-100 text-blue-700 font-bold">Active Session</Badge>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Profile Card */}
          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-3xl">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
            <CardContent className="relative pt-0 pb-8 px-8">
              <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                    {profileImage ? (
                      <AvatarImage src={profileImage} />
                    ) : (
                      <AvatarFallback className="bg-slate-100 text-blue-600 text-4xl font-black">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Upload button */}
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Camera size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>

                <div className="flex-1 pb-2">
                  <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
                  <p className="text-blue-600 font-bold tracking-widest uppercase text-sm">{user.role}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                    <p className="font-bold text-slate-700">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
                    <p className="font-bold text-slate-700">{user.dept}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Member Since</p>
                    <p className="font-bold text-slate-700">{user.joined}</p>
                  </div>
                </div>
              </div>

              {/* Update Email & Password */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button className="mt-4 bg-blue-700 hover:bg-blue-800 font-bold" onClick={handleUpdateProfile}>
                <Lock size={18} className="mr-2" /> Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Profile;