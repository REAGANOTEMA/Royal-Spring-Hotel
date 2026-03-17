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
  FileBarChart,
  MessageSquare,
  ShieldAlert,
  ImageIcon,
  Menu,
  X,
  User,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const SidebarContent = ({ role, userName, location, onClose }: any) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['director', 'gm', 'hr', 'accountant', 'waiter', 'housekeeper', 'chef', 'staff'] },
    { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['director', 'gm', 'staff'] },
    { icon: BedDouble, label: 'Rooms', path: '/rooms', roles: ['director', 'gm', 'housekeeper', 'staff'] },
    { icon: CalendarCheck, label: 'Bookings', path: '/bookings', roles: ['director', 'gm', 'staff'] },
    { icon: Receipt, label: 'Billing', path: '/billing', roles: ['director', 'gm', 'accountant', 'waiter', 'staff'] },
    { icon: Users, label: 'Guests', path: '/guests', roles: ['director', 'gm', 'staff'] },
    { icon: Package, label: 'Inventory', path: '/inventory', roles: ['director', 'gm', 'accountant', 'chef', 'housekeeper'] },
    { icon: BarChart3, label: 'Finance', path: '/finance', roles: ['director', 'gm', 'accountant'] },
    { icon: FileBarChart, label: 'Reports', path: '/reports', roles: ['director', 'gm'] },
    { icon: UserCog, label: 'HR & Staff', path: '/hr', roles: ['director', 'gm', 'hr'] },
    { icon: ShieldCheck, label: 'User Management', path: '/users', roles: ['director'] },
    { icon: Briefcase, label: 'Job Postings', path: '/job-postings', roles: ['director', 'hr'] },
    { icon: ImageIcon, label: 'Media Library', path: '/media', roles: ['director', 'gm'] },
    { icon: ShieldAlert, label: 'Security Logs', path: '/security', roles: ['director'] },
    { icon: AlertCircle, label: 'Incidents', path: '/incidents', roles: ['director', 'gm', 'staff'] },
  ];

  const filteredItems = menuItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white">
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
            onClick={onClose}
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
        <Link
          to="/profile"
          onClick={onClose}
          className={cn(
            "mb-6 flex items-center gap-3 p-3 rounded-xl transition-colors",
            location.pathname === '/profile' ? "bg-blue-900/30 border border-blue-800" : "hover:bg-slate-900"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold shadow-inner">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider truncate">{role?.replace('_', ' ')}</p>
          </div>
        </Link>
        <Link
          to="/login"
          onClick={() => {
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            onClose && onClose();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-950/30 hover:text-red-500 transition-all duration-300 font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Logout</span>
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
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col border-r border-slate-800">
        <SidebarContent role={role} userName={userName} location={location} />
      </aside>

      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-slate-950 border-slate-800 text-white hover:bg-slate-900">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-slate-800">
            <SidebarContent 
              role={role} 
              userName={userName} 
              location={location} 
              onClose={() => setIsOpen(false)} 
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;