-- ==========================================
-- FIX RLS POLICIES FOR STAFF SIGN-UP
-- Apply this migration to fix staff record creation failures
-- ==========================================

-- Drop the existing strict policy
DROP POLICY IF EXISTS "Users can insert their own staff record" ON staff;

-- Create a more lenient policy that allows any authenticated user to insert
-- This works because Supabase ensures auth.uid() can only be the user's own ID
CREATE POLICY "Authenticated users can insert their own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = id::text);

-- Keep the viewing policy
DROP POLICY IF EXISTS "Users can view their own staff record" ON staff;
CREATE POLICY "Users can view their own staff record"
ON staff FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

-- Update policy - users can only update their own record
DROP POLICY IF EXISTS "Users can update their own staff record" ON staff;
CREATE POLICY "Users can update their own staff record"
ON staff FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Delete policy
DROP POLICY IF EXISTS "Users can delete their own staff record" ON staff;
CREATE POLICY "Users can delete their own staff record"
ON staff FOR DELETE
TO authenticated
USING (auth.uid()::text = id::text);

-- Admin policies remain the same
DROP POLICY IF EXISTS "Admins can view all staff" ON staff;
CREATE POLICY "Admins can view all staff"
ON staff FOR SELECT
USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
  OR auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager'));

DROP POLICY IF EXISTS "Admins can insert staff" ON staff;
CREATE POLICY "Admins can insert staff"
ON staff FOR INSERT
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
  OR auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager'));

DROP POLICY IF EXISTS "Admins can update staff" ON staff;
CREATE POLICY "Admins can update staff"
ON staff FOR UPDATE
USING (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
  OR auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager'))
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr')
  OR auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager'));

DROP POLICY IF EXISTS "Admins can delete staff" ON staff;
CREATE POLICY "Admins can delete staff"
ON staff FOR DELETE
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'director'
  OR auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'director');
