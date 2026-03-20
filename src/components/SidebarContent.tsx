"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, BedDouble, CalendarCheck, Users, Package, 
  BarChart3, UserCog, AlertCircle, LogOut, Receipt, Briefcase, 
  FileBarChart, MessageSquare, ShieldAlert, ImageIcon, 
  ShieldCheck, UtensilsCrossed, Sparkles, Wrench, Banknote, Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizeStaffLevel } from '@/utils/rbac';

interface SidebarContentProps {
  role: string | null;
  userName: string | null;
  location: any;
  onClose?: () => void;
}

const SidebarContent = ({ role, userName, location, onClose }: SidebarContentProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', path: '/dashboard', roles: ['director', 'manager', 'supervisor', 'staff', 'hr', 'accountant'] },
    { icon: MessageSquare, label: 'MESSAGES', path: '/messages', roles: ['director', 'manager', 'supervisor', 'staff', 'hr', 'accountant'] },
    { icon: BedDouble, label: 'ROOMS', path: '/rooms', roles: ['director', 'manager', 'supervisor', 'staff'] },
    { icon: CalendarCheck, label: 'BOOKINGS', path: '/bookings', roles: ['director', 'manager', 'supervisor', 'staff'] },
    { icon: Receipt, label: 'BILLING', path: '/billing', roles: ['director', 'manager', 'accountant'] },
    { icon: UtensilsCrossed, label: 'KITCHEN', path: '/kitchen', roles: ['director', 'manager', 'chef'] },
    { icon: Sparkles, label: 'HOUSEKEEPING', path: '/housekeeping', roles: ['director', 'manager', 'supervisor'] },
    { icon: Wrench, label: 'MAINTENANCE', path: '/maintenance', roles: ['director', 'manager', 'supervisor'] },
    { icon: Users, label: 'GUESTS', path: '/guests', roles: ['director', 'manager', 'supervisor', 'staff'] },
    { icon: Package, label: 'INVENTORY', path: '/inventory', roles: ['director', 'manager', 'accountant'] },
    { icon: BarChart3, label: 'FINANCE', path: '/finance', roles: ['director', 'manager', 'accountant'] },
    { icon: Banknote, label: 'PAYROLL', path: '/payroll', roles: ['director', 'hr', 'accountant'] },
    { icon: FileBarChart, label: 'REPORTS', path: '/reports', roles: ['director', 'manager'] },
    { icon: UserCog, label: 'HR & STAFF', path: '/hr', roles: ['director', 'manager', 'hr'] },
    { icon: ShieldCheck, label: 'USERS', path: '/users', roles: ['director'] },
    { icon: Briefcase, label: 'CAREERS', path: '/job-postings', roles: ['director', 'hr'] },
    { icon: ImageIcon, label: 'MEDIA', path: '/media', roles: ['director', 'manager'] },
    { icon: ShieldAlert, label: 'SECURITY', path: '/security', roles: ['director'] },
    { icon: AlertCircle, label: 'INCIDENTS', path: '/incidents', roles: ['director', 'manager', 'supervisor', 'staff'] },
    { icon: Settings, label: 'SETTINGS', path: '/settings', roles: ['director'] },
  ];

  const normalizedRole = normalizeStaffLevel(role);
  const filteredItems = menuItems.filter(item => item.roles.includes(normalizedRole));

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

export default SidebarContent;