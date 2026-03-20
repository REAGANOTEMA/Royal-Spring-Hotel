# Inventory System Implementation Guide

## ✅ What's Been Created

### 1. **Inventory Types** (`src/types/inventory.ts`)
- `InventoryItem` - Database inventory item schema
- `InventoryLog` - Activity log entry schema
- Department → Table name mapping via `DEPARTMENT_INVENTORY_MAP`

### 2. **Inventory Service** (`src/lib/inventoryService.ts`)
Unified API for all inventory operations:
- `fetchInventory(department)` - Get all items
- `addInventoryItem(item, staffId)` - Create with auto-logging
- `updateInventoryItem(id, department, updates, staffId)` - Change fields
- `deleteInventoryItem(id, department, staffId)` - Remove with logging
- `updateInventoryStock(id, department, qty, action, staffId)` - Use/Restock
- `searchInventoryItems(department, query)` - Search
- `fetchActivityLogs(department, limit)` - Get history
- `logInventoryActivity(...)` - Manual activity logging

### 3. **InventoryManager Component** (`src/components/InventoryManager.tsx`)
Reusable React component with:
- Search & filter
- Add/Edit/Delete items
- Stock use/restock modal
- Activity log display
- Role-based permissions (managers can edit, staff read-only)
- Auto activity logging

### 4. **Updated Kitchen.tsx**
Example implementation using the new system:
```tsx
<InventoryManager
  department="Food & Beverage"
  staffId={staffId}
  staffLevel={staffLevel}
  title="Kitchen Inventory Management"
  icon={<UtensilsCrossed size={20} />}
  categories={['Vegetables', 'Proteins', 'Dairy', 'Grains', 'Spices', 'Other']}
  units={['kg', 'L', 'pcs', 'box', 'pack']}
/>
```

---

## 🚀 How to Apply to Other Departments

### **Option 1: Quick Integration** (Recommended)
Replace the department page with InventoryManager:

**Example for Engineering:**
```tsx
// src/pages/Engineering.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Wrench } from 'lucide-react';
import InventoryManager from '@/components/InventoryManager';
import { supabase } from '@/lib/supabase';

const Engineering = () => {
  const [staffId, setStaffId] = useState('');
  const [staffLevel, setStaffLevel] = useState<'director' | 'manager' | 'supervisor' | 'staff'>('staff');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStaffId(user.id);
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
            <div className="p-2 bg-orange-600 rounded-xl text-white">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Engineering Inventory</h2>
              <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Maintenance & Equipment</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <InventoryManager
            department="Engineering"
            staffId={staffId}
            staffLevel={staffLevel}
            title="Engineering & Maintenance Inventory"
            icon={<Wrench size={20} />}
            categories={['Tools', 'Equipment', 'Spare Parts', 'Electronics', 'Safety']}
            units={['pcs', 'set', 'box', 'kg', 'm']}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Engineering;
```

### **Department Configuration Table**

Copy-paste for your departments:

```tsx
// Rooms Division
{
  department: 'Rooms Division',
  icon: <BedDouble size={20} />,
  iconBg: 'bg-blue-600',
  categories: ['Amenities', 'Linens', 'Equipment', 'Supplies'],
  units: ['pcs', 'box', 'pack', 'roll', 'bottle']
}

// Housekeeping
{
  department: 'Housekeeping',
  icon: <Sparkles size={20} />,
  iconBg: 'bg-purple-600',
  categories: ['Cleaning Supplies', 'Linens', 'Laundry', 'Amenities', 'Equipment'],
  units: ['pcs', 'box', 'bottle', 'pack', 'kg']
}

// Security
{
  department: 'Security',
  icon: <Shield size={20} />,
  iconBg: 'bg-red-600',
  categories: ['Equipment', 'Uniforms', 'Electronics', 'Supplies'],
  units: ['pcs', 'set', 'box', 'pack']
}

// IT
{
  department: 'Information Technology',
  icon: <Monitor size={20} />,
  iconBg: 'bg-indigo-600',
  categories: ['Hardware', 'Software', 'Network', 'Supplies'],
  units: ['pcs', 'box', 'set', 'license']
}
```

### **Option 2: Keep Custom Layout + Add Inventory**
If you want to keep custom layouts, just add InventoryManager as a section:

```tsx
<div className="p-8">
  {/* Your existing custom UI */}
  <YourCustomHeader />

  {/* Add inventory section */}
  <InventoryManager
    department="Rooms Division"
    staffId={staffId}
    staffLevel={staffLevel}
    title="Inventory Management"
    icon={<BedDouble size={20} />}
    categories={[...]}
    units={[...]}
  />
</div>
```

---

## 📊 Database Tables Used

All connecting automatically to Supabase:

| Department | Table | Handles |
|---|---|---|
| Rooms Division | `rooms_inventory` | Linens, amenities, supplies |
| Food & Beverage | `kitchen_inventory` | Food, cookware, dining |
| Engineering | `engineering_inventory` | Tools, equipment, parts |
| Housekeeping | `housekeeping_supplies` | Cleaning, laundry |
| Security | `security_supplies` | Equipment, uniforms |
| IT | `it_supplies` | Hardware, software |

**Activity Log Table:**
- `department_activity_logs` - All CREATE/UPDATE/DELETE/USE/RESTOCK actions with staff attribution

---

## 🔐 Security (RLS Auto-Enforced)

Your Supabase RLS policies enforce:
- **Directors**: View/Edit all departments
- **Managers**: View/Edit own department
- **Supervisors**: View own department
- **Staff**: View/Edit only (if RLS configured)

The component respects `staffLevel` prop for UI:
- Only managers & directors see "Add/Edit/Delete" buttons
- Staff see read-only view

---

## 🧪 Testing Checklist

- [ ] Create a new inventory item for each department
- [ ] Edit item details (quantity, category, etc.)
- [ ] Use/Restock an item (stock action)
- [ ] Delete an item
- [ ] Search for items
- [ ] View activity logs in department_activity_logs
- [ ] Verify timestamps & user attribution
- [ ] Test role-based access (log in as different staff levels)

---

## 💡 Quick API Usage Examples

Use directly in any component:

```tsx
import { addInventoryItem, updateInventoryStock } from '@/lib/inventoryService';

// Add item
const newItem = await addInventoryItem({
  item_name: 'Bed Sheets',
  quantity: 50,
  unit: 'pcs',
  category: 'Linens',
  department: 'Rooms Division'
}, staffId);

// update stock (use)
await updateInventoryStock(
  itemId,
  'Rooms Division',
  45, // new quantity
  'USE', // action
  staffId,
  'Used for Room 201' // reason
);
```

---

## 📝 Next Steps

1. **Update remaining departments** using the configurations above
2. **Test all CRUD operations** with the checklist
3. **Verify RLS enforcement** by logging in as different roles
4. **Monitor activity logs** to confirm tracking works
5. **Add custom filters/reports** if needed (future enhancement)

---

## 🆘 Troubleshooting

**Component not showing items?**
- Check staffId is being fetched correctly
- Verify RLS policy allows your user to read the table
- Check browser console for Supabase errors

**Activity logs empty?**
- Confirm department_activity_logs table has RLS disabled or proper policies
- Check staff_id is passed correctly to inventory functions

**Stock updates not working?**
- Verify staff_level in JWT or database matches component prop
- Check Write RLS policies allow managers/directors to UPDATE

---

Ready to proceed with next departments? Let me know which ones! 🚀
