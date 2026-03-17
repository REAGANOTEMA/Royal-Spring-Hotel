-- 12. Documents Table (for Help Center / Document Management)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  uploaded_by TEXT,
  status TEXT DEFAULT 'Pending',
  url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public Access Policy
CREATE POLICY "Public Access" ON documents FOR ALL USING (true);