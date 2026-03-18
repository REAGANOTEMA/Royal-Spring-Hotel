-- ROYAL SPRING HOTEL ERP - MASTER EXECUTIVE DATABASE LOGIC
-- Run this script in your Supabase SQL Editor to initialize the entire system.

-- ==========================================
-- 1. CLEANUP (Optional: Uncomment to reset)
-- ==========================================
-- DROP TABLE IF EXISTS audit_logs, jobs, guest_messages, documents, media, incidents, maintenance, housekeeping, inventory, kitchen_logs, kitchen_inventory, billing, bookings, check_in_logs, staff, rooms CASCADE;

-- ==========================================
-- 2. CORE TABLES (Rooms & Staff)
-- ==========================================

-- Rooms & Accommodations
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY, -- e.g. '101', '204'
    type TEXT NOT NULL, -- Standard, Deluxe, Suite
    price DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'Available', -- Available, Occupied, Cleaning, Maintenance
    floor TEXT, -- 1st Floor, 2nd Floor, etc.
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff & Human Resources
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- director, gm, hr, accountant, chef, staff
    status TEXT DEFAULT 'Active',
    salary TEXT DEFAULT '0',
    advance TEXT DEFAULT '0',
    deduction TEXT DEFAULT '0',
    net TEXT DEFAULT '0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. OPERATIONAL TABLES (Bookings & Finance)
-- ==========================================

-- Reservations & Front Desk
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest TEXT NOT NULL,
    room TEXT REFERENCES rooms(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Confirmed', -- Confirmed, Checked In, Checked Out, Cancelled
    amount TEXT,
    check_in DATE,
    check_out DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Ledger & Invoicing
CREATE TABLE IF NOT EXISTS billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest TEXT NOT NULL,
    room TEXT,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- Paid, Pending, Expense
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. SUPPLY CHAIN (Kitchen & Inventory)
-- ==========================================

-- Kitchen Inventory (Executive Chef)
CREATE TABLE IF NOT EXISTS kitchen_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    category TEXT, -- Vegetables, Meat & Poultry, Spices, Dry Goods, Dairy
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    unit TEXT DEFAULT 'kg', -- kg, ltr, pcs, tray
    min_stock_level DECIMAL(10, 2) DEFAULT 5,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Kitchen Usage & Restock Logs
CREATE TABLE IF NOT EXISTS kitchen_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES kitchen_inventory(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- Used, Damaged, Restocked
    quantity DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    logged_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- General Resort Inventory (Housekeeping/Office)
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT, -- Housekeeping, Kitchen, Maintenance, Office
    stock INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'pcs',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. FACILITY MANAGEMENT (Housekeeping & Maintenance)
-- ==========================================

-- Housekeeping Tasks
CREATE TABLE IF NOT EXISTS housekeeping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    staff_name TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, In Progress, Completed, Inspected
    notes TEXT,
    last_cleaned TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance & Repair Tickets
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT, -- Room number or Area
    priority TEXT DEFAULT 'Medium', -- Low, Medium, High, Critical
    status TEXT DEFAULT 'Open', -- Open, In Progress, Resolved
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. SECURITY & LOGS
-- ==========================================

-- Incident Reports
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- Property Damage, Maintenance Issue, Security Concern, Other
    description TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    reported_by TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance & Clocking Logs
CREATE TABLE IF NOT EXISTS check_in_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    staff_name TEXT,
    check_in TIMESTAMPTZ DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    total_hours DECIMAL(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT,
    action TEXT NOT NULL,
    ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. CONTENT & COMMUNICATION
-- ==========================================

-- Media Library (Gallery)
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Image', -- Image, Video
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Repository (Help/Knowledge Base)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT, -- General, Policy, Manual, Legal
    uploaded_by TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Verified, Alert
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest Messages (AI Concierge History)
CREATE TABLE IF NOT EXISTS guest_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT,
    last_message TEXT,
    time TEXT,
    status TEXT DEFAULT 'Unread', -- Unread, Replied
    history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recruitment & Job Postings
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT,
    type TEXT, -- Full-time, Part-time, Contract
    status TEXT DEFAULT 'Draft', -- Draft, Published
    applicants INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. SEED DATA (Initial Records)
-- ==========================================

-- Seed Rooms
INSERT INTO rooms (id, type, price, status, floor, image) VALUES
('101', 'Standard', 150000, 'Available', '1st Floor', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'),
('102', 'Standard', 150000, 'Occupied', '1st Floor', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'),
('201', 'Deluxe', 250000, 'Available', '2nd Floor', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'),
('202', 'Deluxe', 250000, 'Maintenance', '2nd Floor', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800'),
('301', 'Suite', 450000, 'Cleaning', '3rd Floor', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- Seed Staff
INSERT INTO staff (name, role, salary, net) VALUES
('John Executive', 'director', '5000000', '5000000'),
('Sarah Manager', 'gm', '3500000', '3500000'),
('Musa Chef', 'chef', '2500000', '2500000'),
('Jane Accountant', 'accountant', '2500000', '2500000'),
('Robert HR', 'hr', '2500000', '2500000'),
('Alice Staff', 'staff', '1200000', '1200000')
ON CONFLICT DO NOTHING;

-- Seed Kitchen Inventory
INSERT INTO kitchen_inventory (item_name, category, stock_quantity, unit, min_stock_level) VALUES
('Fresh Tomatoes', 'Vegetables', 25.5, 'kg', 5.0),
('Beef Fillet', 'Meat & Poultry', 15.0, 'kg', 3.0),
('Basmati Rice', 'Dry Goods', 50.0, 'kg', 10.0),
('Cooking Oil', 'Dry Goods', 20.0, 'ltr', 5.0),
('Fresh Milk', 'Dairy', 12.0, 'ltr', 2.0)
ON CONFLICT DO NOTHING;

-- Seed General Inventory
INSERT INTO inventory (name, category, stock, unit) VALUES
('Bed Sheets (King)', 'Housekeeping', 45, 'pcs'),
('Bath Towels', 'Housekeeping', 60, 'pcs'),
('A4 Paper Reams', 'Office', 12, 'pcs'),
('Cleaning Detergent', 'Housekeeping', 20, 'ltr')
ON CONFLICT DO NOTHING;

-- Seed Initial Billing (Revenue)
INSERT INTO billing (guest, room, amount, status, date) VALUES
('David Okello', '201', '250,000', 'Paid', CURRENT_DATE),
('Mary Nakato', '102', '150,000', 'Paid', CURRENT_DATE - INTERVAL '1 day'),
('System Expense', 'Kitchen Supplies', '85,000', 'Expense', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Seed Initial Housekeeping Tasks
INSERT INTO housekeeping (room_id, staff_name, status) VALUES
('301', 'Alice Staff', 'In Progress'),
('101', 'Alice Staff', 'Completed')
ON CONFLICT DO NOTHING;

-- Seed Initial Maintenance Tickets
INSERT INTO maintenance (title, description, location, priority, status) VALUES
('AC Leakage', 'Water dripping from unit', 'Room 202', 'High', 'Open'),
('Bulb Replacement', 'Main light not working', 'Lobby', 'Low', 'Resolved')
ON CONFLICT DO NOTHING;

-- Seed Initial Job Postings
INSERT INTO jobs (title, department, type, status) VALUES
('Front Desk Officer', 'Reception', 'Full-time', 'Published'),
('Sous Chef', 'Kitchen', 'Full-time', 'Published')
ON CONFLICT DO NOTHING;