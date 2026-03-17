-- Royal Springs ERP Database Logic

-- 1. Function to deduct inventory when a room is marked as 'Cleaning'
CREATE OR REPLACE FUNCTION deduct_cleaning_supplies()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Cleaning' AND OLD.status != 'Cleaning' THEN
    -- Deduct 1 set of linens
    UPDATE inventory 
    SET stock = stock - 1 
    WHERE name ILIKE '%Linens%' AND stock > 0;
    
    -- Deduct 2 bars of soap/toiletries
    UPDATE inventory 
    SET stock = stock - 2 
    WHERE name ILIKE '%Soap%' OR name ILIKE '%Toiletries%' AND stock > 0;
    
    -- Log the activity
    INSERT INTO audit_logs (user_name, action)
    VALUES ('System', 'Auto-deducted cleaning supplies for Room ' || NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger for Room Status Change
DROP TRIGGER IF EXISTS on_room_cleaning ON rooms;
CREATE TRIGGER on_room_cleaning
AFTER UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION deduct_cleaning_supplies();

-- 3. Function to update 'last_updated' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_inventory_modtime ON inventory;
CREATE TRIGGER update_inventory_modtime
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();