-- ==========================================
-- CLEAN FIX FOR SIGNUP PERMISSIONS
-- This script handles existing policies gracefully
-- ==========================================

-- First, let's see what policies currently exist
SELECT policyname, tablename FROM pg_policies WHERE tablename = 'staff';

-- Drop all existing policies one by one with proper error handling
DO $$
BEGIN
    -- Drop each policy individually
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Allow user signup - insert own staff record') THEN
        DROP POLICY "Allow user signup - insert own staff record" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Users can view own staff record') THEN
        DROP POLICY "Users can view own staff record" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Users can update own staff record') THEN
        DROP POLICY "Users can update own staff record" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Users can delete own staff record') THEN
        DROP POLICY "Users can delete own staff record" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can view all staff') THEN
        DROP POLICY "Admins can view all staff" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can insert staff records') THEN
        DROP POLICY "Admins can insert staff records" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can update staff records') THEN
        DROP POLICY "Admins can update staff records" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Directors can delete staff records') THEN
        DROP POLICY "Directors can delete staff records" ON staff;
    END IF;
    
    -- Also drop any old policies that might exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Authenticated users can insert their own staff record') THEN
        DROP POLICY "Authenticated users can insert their own staff record" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can insert staff') THEN
        DROP POLICY "Admins can insert staff" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can update staff') THEN
        DROP POLICY "Admins can update staff" ON staff;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Admins can delete staff') THEN
        DROP POLICY "Admins can delete staff" ON staff;
    END IF;
    
END $$;

-- Now create the new policies

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

-- Verify the policies were created successfully
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || substring(qual::text, 1, 100) || '...'
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || substring(with_check::text, 1, 100) || '...'
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'staff'
ORDER BY policyname;
