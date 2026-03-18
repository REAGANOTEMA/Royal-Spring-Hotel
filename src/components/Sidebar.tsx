"use client";

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck, Users, Package, BarChart3, UserCog, AlertCircle, LogOut, Receipt, Briefcase, FileBarChart, MessageSquare, ShieldAlert, ImageIcon, Menu, ShieldCheck, UtensilsCrossed, Sparkles, Wrench, Banknote, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const SidebarContent = ({ role, userName, location, onClose }: any) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', path: '/dashboard', roles: ['director', 'gm', 'hr', 'accountant', 'staff'] },
    { icon: MessageSquare, label: 'MESSAGES', path: '/messages', roles: ['director', 'gm', 'staff'] },
    { icon: BedDouble, label: 'ROOMS', path: '/rooms', roles: ['director', 'gm', 'staff'] },
    { icon: CalendarCheck, label: 'BOOKINGS', path: '/bookings', roles: ['director', 'gm', 'staff'] },
    { icon: Receipt, label: 'BILLING', path: '/billing', roles: ['director', 'gm', 'accountant', 'staff'] },
    { icon: UtensilsCrossed, label: 'KITCHEN', path: '/kitchen', roles: ['director', 'gm', 'chef'] },
    { icon: Sparkles, label: 'HOUSEKEEPING', path: '/housekeeping', roles: ['director', 'gm', 'staff'] },
    { icon: Wrench, label: 'MAINTENANCE', path: '/maintenance', roles: ['director', 'gm', 'staff'] },
    { icon: Users, label: 'GUESTS', path: '/guests', roles: ['director', 'gm', 'staff'] },
    { icon: Package, label: 'INVENTORY', path: '/inventory', roles: ['director', 'gm', 'accountant'] },
    { icon: BarChart3, label: 'FINANCE', path: '/finance', roles: ['director', 'gm', 'accountant'] },
    { icon: Banknote, label: 'PAYROLL', path: '/payroll', roles: ['director', 'gm', 'hr', 'accountant'] },
    { icon: FileBarChart, label: 'REPORTS', path: '/reports', roles: ['director', 'gm'] },
    { icon: UserCog, label: 'HR & STAFF', path: '/hr', roles: ['director', 'gm', 'hr'] },
    { icon: ShieldCheck, label: 'USERS', path: '/users', roles: ['director'] },
    { icon: Briefcase, label: 'CAREERS', path: '/job-postings', roles: ['director', 'hr'] },
    { icon: ImageIcon, label: 'MEDIA', path: '/media', roles: ['director', 'gm'] },
    { icon: ShieldAlert, label: 'SECURITY', path: '/security', roles: ['director'] },
    { icon: AlertCircle, label: 'INCIDENTS', path: '/incidents', roles: ['director', 'gm', 'staff'] },
    { icon: Settings, label: 'SETTINGS', path: '/settings', roles: ['director'] },
  ];

  const filteredItems = menuItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white">
      <div className="p-8 flex flex-col items-center gap-4 border-b border-slate-900">
        <img src="/logo.png" alt="Royal Springs Logo" className="h-20 object-contain drop-shadow-2xl" />
        <div className="text-center">
          <h1 className="font-black text-xl leading-tight tracking-tighter uppercase">Royal Springs</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black">ERP SYSTEM</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
              location.pathname === item.path 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40 scale-[1.02]" 
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-white"
            )} />
            <span className="font-black text-xs tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-900 bg-slate-950/50">
        <Link to="/profile" onClick={onClose} className="mb-6 flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-900 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-inner text-xl">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate">{userName}</p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest truncate">{role}</p>
          </div>
        </Link>
        <Link to="/login" onClick={() => { localStorage.clear(); }} className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-red-950/30 hover:text-red-500 transition-all font-black text-xs tracking-widest">
          <LogOut size={22} />
          <span>LOGOUT</span>
        </Link>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'staff');
    setUserName(localStorage.getItem('userName') || 'Staff Member');
  }, []);

  return (
    <>
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col border-r border-slate-800">
        <SidebarContent role={role} userName={userName} location={location} />
      </aside>
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild><Button variant="outline" size="icon" className="bg-slate-950 border-slate-800 text-white"><Menu size={24} /></Button></SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r border-slate-800"><SidebarContent role={role} userName={userName} location={location} onClose={() => setIsOpen(false)} /></SidebarContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;