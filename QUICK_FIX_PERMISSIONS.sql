-- ==========================================
-- IMMEDIATE FIX FOR SIGNUP PERMISSIONS
-- Run this script directly in your Supabase SQL Editor
-- ==========================================

-- First, disable RLS temporarily to allow the fix
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

-- Then re-enable it with the correct policies
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Authenticated users can insert their own staff record" ON staff;
DROP POLICY IF EXISTS "Users can view their own staff record" ON staff;
DROP POLICY IF EXISTS "Users can update their own staff record" ON staff;
DROP POLICY IF EXISTS "Users can delete their own staff record" ON staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON staff;
DROP POLICY IF EXISTS "Admins can insert staff" ON staff;
DROP POLICY IF EXISTS "Admins can update staff" ON staff;
DROP POLICY IF EXISTS "Admins can delete staff" ON staff;

-- Create the new signup-friendly policies

-- 1. SIGNUP POLICY - Allow any authenticated user to insert their own staff record
CREATE POLICY "Allow user signup - insert own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
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

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'staff'
ORDER BY policyname;
