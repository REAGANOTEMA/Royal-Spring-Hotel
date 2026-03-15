-- Function to calculate work hours automatically on clock-out
CREATE OR REPLACE FUNCTION calculate_work_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clock_out IS NOT NULL THEN
    -- Calculate hours and update a summary (optional) or just keep for reporting
    -- This is where you'd add logic to update a 'total_hours' column if needed
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for attendance
CREATE TRIGGER on_clock_out
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION calculate_work_hours();

-- Security: Ensure only HR/Director can approve profiles
CREATE POLICY "HR and Directors can update profiles"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('hr', 'director', 'general_manager')
    )
  );