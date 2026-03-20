-- ==========================================
-- SIMPLE PERMISSIONS RESET
-- Quick and dirty fix - disable RLS, recreate policies
-- ==========================================

-- Step 1: Disable RLS completely
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

-- Step 2: Re-enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Step 3: Create the essential signup policy first
CREATE POLICY "Allow user signup - insert own staff record"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Step 4: Create self-view policy
CREATE POLICY "Users can view own staff record"
ON staff FOR SELECT
TO authenticated
USING (
  auth.uid()::text = id::text OR
  auth.email() = email OR
  auth.email() = auth_email
);

-- Step 5: Create admin policies
CREATE POLICY "Admins can view all staff"
ON staff FOR SELECT
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'hr'
);

CREATE POLICY "Admins can insert staff records"
ON staff FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('director', 'gm', 'hr') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' IN ('director', 'manager') OR
  auth.jwt() -> 'user_metadata' ->> 'staff_level' = 'hr'
);

-- Step 6: Verify policies exist
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'staff' ORDER BY policyname;
