"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { UtensilsCrossed } from 'lucide-react';
import InventoryManager from '@/components/InventoryManager';
import { supabase } from '@/lib/supabase';

const Kitchen = () => {
  const [staffId, setStaffId] = useState('');
  const [staffLevel, setStaffLevel] = useState<'director' | 'manager' | 'supervisor' | 'staff'>('staff');

  useEffect(() => {
    // Get current user and their staff level
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStaffId(user.id);
        
        // Fetch staff record to get staff_level
        const { data: staffData } = await supabase
          .from('staff')
          .select('staff_level')
          .eq('auth_email', user.email)
          .single();
        
        if (staffData?.staff_level) {
          setStaffLevel(staffData.staff_level as any);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Kitchen Store & Inventory</h2>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Executive Chef Portal</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <InventoryManager
            department="Food & Beverage"
            staffId={staffId}
            staffLevel={staffLevel}
            title="Kitchen Inventory Management"
            icon={<UtensilsCrossed size={20} />}
            categories={['Vegetables', 'Proteins', 'Dairy', 'Grains', 'Spices', 'Other']}
            units={['kg', 'L', 'pcs', 'box', 'pack']}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Kitchen;