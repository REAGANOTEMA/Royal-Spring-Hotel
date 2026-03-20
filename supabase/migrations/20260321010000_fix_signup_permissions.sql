-- ==========================================
-- FIX SIGNUP PERMISSIONS - ALLOW NEW USER REGISTRATION
-- This migration fixes the "Permission denied" error during signup
-- ==========================================

-- Drop all existing staff policies to start fresh
DROP POLICY IF EXISTS "Authenticated users can insert their own staff record" ON staff;
DROP POLICY IF EXISTS "Users can view their own staff record" ON staff;
DROP POLICY IF EXISTS "Users can update their own staff record" ON staff;
DROP POLICY IF EXISTS "Users can delete their own staff record" ON staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON staff;
DROP POLICY IF EXISTS "Admins can insert staff" ON staff;
DROP POLICY IF EXISTS "Admins can update staff" ON staff;
DROP POLICY IF EXISTS "Admins can delete staff" ON staff;

-- Enable RLS on staff table
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- 1. SIGNUP POLICY - Allow any authenticated user to insert their own staff record
-- This is crucial for new user registration
CREATE POLICY "Allow user signup - insert own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  -- User can insert if they're creating their own record (ID matches auth.uid)
  auth.uid()::text = id::text OR
  -- OR if they're creating a record with their own email
  auth.email() = email OR
  -- OR if they're creating a record with their own auth_email
  auth.email() = auth_email
);

-- 2. SELF-VIEW POLICY - Users can view their own record
CREATE POLICY "Users can view own staff record"
ON staff FOR SELECT
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- 3. SELF-UPDATE POLICY - Users can update their own record
CREATE POLICY "Users can update own staff record"
ON staff FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
)
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- 4. SELF-DELETE POLICY - Users can delete their own record
CREATE POLICY "Users can delete own staff record"
ON staff FOR DELETE
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- 5. ADMIN VIEW POLICY - Admins can view all staff
CREATE POLICY "Admins can view all staff"
ON staff FOR SELECT
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'hr'
);

-- 6. ADMIN INSERT POLICY - Admins can create staff records
CREATE POLICY "Admins can insert staff records"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'hr'
);

-- 7. ADMIN UPDATE POLICY - Admins can update staff records
CREATE POLICY "Admins can update staff records"
ON staff FOR UPDATE
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'hr'
)
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'hr'
);

-- 8. ADMIN DELETE POLICY - Only directors can delete staff
CREATE POLICY "Directors can delete staff records"
ON staff FOR DELETE
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'director' OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'director'
);

-- Add helpful comment
COMMENT ON POLICY "Allow user signup - insert own staff record" ON staff IS 'Allows new users to create their staff record during signup process';
