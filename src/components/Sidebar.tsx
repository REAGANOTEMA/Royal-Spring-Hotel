"use client";

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Package, 
  BarChart3, 
  UserCog, 
  AlertCircle,
  LogOut,
  Receipt,
  Briefcase,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'staff');
    setUserName(localStorage.getItem('userName') || 'Staff Member');
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['director', 'general_manager', 'hr', 'staff'] },
    { icon: BedDouble, label: 'Rooms', path: '/rooms', roles: ['director', 'general_manager', 'staff'] },
    { icon: CalendarCheck, label: 'Bookings', path: '/bookings', roles: ['director', 'general_manager', 'staff'] },
    { icon: Receipt, label: 'Billing', path: '/billing', roles: ['director', 'general_manager', 'staff'] },
    { icon: Users, label: 'Guests', path: '/guests', roles: ['director', 'general_manager', 'staff'] },
    { icon: Package, label: 'Inventory', path: '/inventory', roles: ['director', 'general_manager'] },
    { icon: BarChart3, label: 'Finance', path: '/finance', roles: ['director', 'general_manager'] },
    { icon: UserCog, label: 'HR & Staff', path: '/hr', roles: ['director', 'general_manager', 'hr'] },
    { icon: Briefcase, label: 'Job Postings', path: '/job-postings', roles: ['director', 'hr'] },
    { icon: AlertCircle, label: 'Incidents', path: '/incidents', roles: ['director', 'general_manager', 'staff'] },
  ];

  const filteredItems = menuItems.filter(item => role && item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-950 text-white h-screen sticky top-0 flex flex-col border-r border-slate-800">
      <div className="p-8 flex flex-col items-center gap-4 border-b border-slate-900">
        <img src="/logo.png" alt="Royal Springs Logo" className="h-16 object-contain" />
        <div className="text-center">
          <h1 className="font-bold text-lg leading-tight tracking-tight">Royal Springs</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold">ERP System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
              location.pathname === item.path 
                ? "bg-blue-700 text-white shadow-lg shadow-blue-900/40" 
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-white"
            )} />
            <span className="font-bold text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-900 bg-slate-950/50">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold shadow-inner">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider truncate">{role?.replace('_', ' ')}</p>
          </div>
        </div>
        <Link
          to="/login"
          onClick={() => {
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-950/30 hover:text-red-500 transition-all duration-300 font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;