-- Rooms Table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  price DECIMAL NOT NULL,
  status TEXT DEFAULT 'Available',
  floor TEXT
);

-- Staff Profiles & HR Control
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'staff',
  department TEXT,
  salary DECIMAL,
  warnings INTEGER DEFAULT 0,
  deductions DECIMAL DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  PRIMARY KEY (id)
);

-- Attendance Tracking
CREATE TABLE attendance (
  id BIGSERIAL PRIMARY KEY,
  staff_id UUID REFERENCES profiles(id),
  clock_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clock_out TIMESTAMP WITH TIME ZONE,
  work_date DATE DEFAULT CURRENT_DATE
);

-- Bookings & Transactions
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  room_id TEXT REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'Confirmed',
  payment_account TEXT DEFAULT '4187612853948627'
);

-- Inventory & Assets
CREATE TABLE inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  stock INTEGER,
  min_stock INTEGER,
  unit TEXT
);