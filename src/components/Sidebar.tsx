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
  Hotel,
  Receipt,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'staff');
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
    <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        {/* Replace Hotel icon with logo image */}
        <img src="/logo.png" alt="Royal Springs Logo" className="w-10 h-10 object-contain bg-blue-600 p-2 rounded-lg" />
        <div>
          <h1 className="font-bold text-lg leading-tight">Royal Springs</h1>
          <p className="text-xs text-slate-400">ERP System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              location.pathname === item.path 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Logged in as</p>
          <p className="text-sm font-semibold text-blue-400 capitalize">{role?.replace('_', ' ')}</p>
        </div>
        <Link
          to="/login"
          onClick={() => localStorage.removeItem('userRole')}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;