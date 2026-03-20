-- ==========================================
-- FINAL PERMISSIONS FIX - ROYAL SPRINGS
-- Complete fix for signup and login permissions
-- ==========================================

-- Step 1: Clean up all existing policies
DO $$
BEGIN
    -- Drop all existing policies on staff table
    DROP POLICY IF EXISTS "Allow user signup - insert own staff record" ON staff;
    DROP POLICY IF EXISTS "Users can view own staff record" ON staff;
    DROP POLICY IF EXISTS "Users can update own staff record" ON staff;
    DROP POLICY IF EXISTS "Users can delete own staff record" ON staff;
    DROP POLICY IF EXISTS "Admins can view all staff" ON staff;
    DROP POLICY IF EXISTS "Admins can insert staff records" ON staff;
    DROP POLICY IF EXISTS "Admins can update staff records" ON staff;
    DROP POLICY IF EXISTS "Admins can delete staff records" ON staff;
    DROP POLICY IF EXISTS "Directors can delete staff records" ON staff;
    
    -- Drop any old policies
    DROP POLICY IF EXISTS "Authenticated users can insert their own staff record" ON staff;
    DROP POLICY IF EXISTS "Admins can insert staff" ON staff;
    DROP POLICY IF EXISTS "Admins can update staff" ON staff;
    DROP POLICY IF EXISTS "Admins can delete staff" ON staff;
END $$;

-- Step 2: Create clean, effective policies

-- Policy 1: Allow users to insert their own staff record (SIGNUP)
CREATE POLICY "Allow user signup - insert own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 2: Allow users to view their own staff record (LOGIN)
CREATE POLICY "Users can view own staff record"
ON staff FOR SELECT
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 3: Allow users to update their own staff record
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

-- Policy 4: Allow users to delete their own staff record
CREATE POLICY "Users can delete own staff record"
ON staff FOR DELETE
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Policy 5: Allow admins to view all staff
CREATE POLICY "Admins can view all staff"
ON staff FOR SELECT
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
);

-- Policy 6: Allow admins to manage all staff records
CREATE POLICY "Admins can manage staff records"
ON staff FOR ALL
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
)
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
);

-- Step 3: Verify policies were created
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || substring(qual::text, 1, 80) || '...'
    ELSE 'No USING clause'
  END as using_clause
FROM pg_policies 
WHERE tablename = 'staff'
ORDER BY policyname;

-- ==========================================
-- WHAT THIS FIXES:
-- 1. Users can SIGN UP without permission errors
-- 2. Users can LOG IN without permission errors  
-- 3. Users can view their own staff records
-- 4. Users can update their profiles
-- 5. Admins retain full management access
-- ==========================================
