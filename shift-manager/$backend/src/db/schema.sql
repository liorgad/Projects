-- VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Volunteer')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SHIFTS TABLE
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  time TEXT NOT NULL CHECK (time IN ('Morning', 'Afternoon', 'Evening')),
  location TEXT NOT NULL,
  has_patrol BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(volunteer_id, shift_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for initial setup
CREATE POLICY service_role_volunteers_policy ON volunteers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY service_role_shifts_policy ON shifts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY service_role_registrations_policy ON registrations FOR ALL USING (true) WITH CHECK (true); 