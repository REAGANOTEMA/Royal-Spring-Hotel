-- ==========================================
-- ROYAL SPRING HOTEL - DEPARTMENT INVENTORY TABLES
-- This migration creates inventory management tables for each department
-- ==========================================

-- ==========================================
-- 1. ROOMS DIVISION INVENTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS rooms_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    department TEXT DEFAULT 'Rooms Division',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rooms_inventory
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Rooms Division';

CREATE INDEX IF NOT EXISTS idx_rooms_inventory_dept ON rooms_inventory(department);

-- ==========================================
-- 2. KITCHEN INVENTORY (if not exists from previous migration)
-- ==========================================

CREATE TABLE IF NOT EXISTS kitchen_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    department TEXT DEFAULT 'Food & Beverage',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kitchen_inventory
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Food & Beverage';

-- Migrate old stock_quantity column if it exists
ALTER TABLE kitchen_inventory
    RENAME COLUMN stock_quantity TO quantity;

CREATE INDEX IF NOT EXISTS idx_kitchen_inventory_dept ON kitchen_inventory(department);

-- ==========================================
-- 3. ENGINEERING/MAINTENANCE INVENTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS engineering_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    department TEXT DEFAULT 'Engineering',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE engineering_inventory
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Engineering';

-- Migrate old stock_quantity column if it exists
ALTER TABLE engineering_inventory
    RENAME COLUMN stock_quantity TO quantity;

CREATE INDEX IF NOT EXISTS idx_engineering_inventory_dept ON engineering_inventory(department);

-- ==========================================
-- 4. HOUSEKEEPING SUPPLIES
-- ==========================================

CREATE TABLE IF NOT EXISTS housekeeping_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    category TEXT,
    department TEXT DEFAULT 'Housekeeping',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE housekeeping_supplies
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Housekeeping';

CREATE INDEX IF NOT EXISTS idx_housekeeping_supplies_dept ON housekeeping_supplies(department);

-- ==========================================
-- 5. SECURITY EQUIPMENT & SUPPLIES
-- ==========================================

CREATE TABLE IF NOT EXISTS security_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    equipment_type TEXT,
    department TEXT DEFAULT 'Security',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE security_supplies
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Security';

CREATE INDEX IF NOT EXISTS idx_security_supplies_dept ON security_supplies(department);

-- ==========================================
-- 6. IT EQUIPMENT & SUPPLIES
-- ==========================================

CREATE TABLE IF NOT EXISTS it_supplies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    equipment_type TEXT,
    department TEXT DEFAULT 'Information Technology',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE it_supplies
    ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Information Technology';

CREATE INDEX IF NOT EXISTS idx_it_supplies_dept ON it_supplies(department);

-- ==========================================
-- 7. DEPARTMENT ACTIVITY LOGS
-- ==========================================

CREATE TABLE IF NOT EXISTS department_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    inventory_item_id UUID,
    inventory_type TEXT,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE department_activity_logs
    ADD COLUMN IF NOT EXISTS department TEXT;

CREATE INDEX IF NOT EXISTS idx_dept_activity_logs_staff ON department_activity_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_dept_activity_logs_dept ON department_activity_logs(department);
CREATE INDEX IF NOT EXISTS idx_dept_activity_logs_created ON department_activity_logs(created_at);

-- ==========================================
-- 8. RLS POLICIES FOR INVENTORY TABLES
-- ==========================================

-- Enable RLS on inventory tables
ALTER TABLE rooms_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineering_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_activity_logs ENABLE ROW LEVEL SECURITY;

-- Rooms Division inventory access
DROP POLICY IF EXISTS "rooms_inventory_view" ON rooms_inventory;
CREATE POLICY "rooms_inventory_view"
ON rooms_inventory FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Rooms Division'
);

-- Kitchen inventory access
DROP POLICY IF EXISTS "kitchen_inventory_view" ON kitchen_inventory;
CREATE POLICY "kitchen_inventory_view"
ON kitchen_inventory FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Food & Beverage'
);

-- ==========================================
-- 9. EMPLOYEE RECOGNITION AND PROMOTION TRACKING
-- ==========================================

CREATE TABLE IF NOT EXISTS employee_recognition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    recognition_type TEXT NOT NULL, -- e.g., 'employee_of_month', 'promotion'
    title TEXT NOT NULL,
    notes TEXT,
    awarded_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE employee_recognition ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recognition_view_authorized"
ON employee_recognition FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Human Resources' OR
    staff_id = auth.uid()
);

CREATE POLICY "recognition_insert_hr_director"
ON employee_recognition FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Human Resources'
);

CREATE POLICY "recognition_update_hr_director"
ON employee_recognition FOR UPDATE
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Human Resources'
)
WITH CHECK (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Human Resources'
);

CREATE POLICY "recognition_delete_hr_director"
ON employee_recognition FOR DELETE
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Human Resources'
);

-- Engineering inventory access
DROP POLICY IF EXISTS "engineering_inventory_view" ON engineering_inventory;
CREATE POLICY "engineering_inventory_view"
ON engineering_inventory FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Engineering'
);

-- Housekeeping supplies access
DROP POLICY IF EXISTS "housekeeping_supplies_view" ON housekeeping_supplies;
CREATE POLICY "housekeeping_supplies_view"
ON housekeeping_supplies FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' = 'director' OR
    auth.jwt() ->> 'department' = 'Housekeeping'
);

-- Insert policies for managers and up
DROP POLICY IF EXISTS "inventory_insert_manager" ON rooms_inventory;
CREATE POLICY "inventory_insert_manager"
ON rooms_inventory FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'staff_level' IN ('director', 'manager') OR
    auth.jwt() ->> 'department' = 'Rooms Division'
);

DROP POLICY IF EXISTS "kitchen_inventory_insert" ON kitchen_inventory;
CREATE POLICY "kitchen_inventory_insert"
ON kitchen_inventory FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'staff_level' IN ('director', 'manager') OR
    auth.jwt() ->> 'department' = 'Food & Beverage'
);

-- Delete policies for managers and up
DROP POLICY IF EXISTS "inventory_delete_manager" ON rooms_inventory;
CREATE POLICY "inventory_delete_manager"
ON rooms_inventory FOR DELETE
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' IN ('director', 'manager')
);

DROP POLICY IF EXISTS "kitchen_inventory_delete" ON kitchen_inventory;
CREATE POLICY "kitchen_inventory_delete"
ON kitchen_inventory FOR DELETE
TO authenticated
USING (
    auth.jwt() ->> 'staff_level' IN ('director', 'manager')
);
