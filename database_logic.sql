-- ROYAL SPRING HOTEL ERP - FINAL EXECUTIVE UPDATE
-- Adding Settings and Notifications tables

-- 17. Hotel Settings
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'hotel_config',
    hotel_name TEXT DEFAULT 'Royal Spring Hotel',
    contact_email TEXT DEFAULT 'info@royalspringsresort.com',
    contact_phone TEXT DEFAULT '+256 772 514 889',
    address TEXT DEFAULT 'Kampala, Uganda',
    currency TEXT DEFAULT 'UGX',
    tax_rate DECIMAL(5, 2) DEFAULT 18.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (id, hotel_name) VALUES ('hotel_config', 'Royal Spring Hotel') ON CONFLICT DO NOTHING;

-- 18. System Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'Info', -- Info, Warning, Success, Error
    is_read BOOLEAN DEFAULT FALSE,
    target_role TEXT, -- Role that should see this
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO notifications (title, message, type, target_role) VALUES 
('Low Stock Alert', 'Tomato stock is below 5kg in the kitchen.', 'Warning', 'chef'),
('New Reservation', 'A new booking has been made for Room 201.', 'Info', 'staff'),
('Maintenance Required', 'AC Leakage reported in Room 202.', 'Error', 'staff')
ON CONFLICT DO NOTHING;