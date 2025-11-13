-- Volunteer Shift Management Database Schema
-- This file contains the SQL commands to set up the database structure in Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT CHECK (role IN ('admin', 'coordinator', 'volunteer')) DEFAULT 'volunteer',
  is_senior_volunteer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shifts table
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  has_mobile_patrol BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shift assignments table
CREATE TABLE shift_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  start_time TIME,
  end_time TIME,
  is_mobile_patrol BOOLEAN DEFAULT FALSE,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shift_id, volunteer_id)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins and coordinators can manage profiles" ON profiles 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'coordinator')
    )
  );

-- Locations policies
CREATE POLICY "Users can view locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Admins and coordinators can manage locations" ON locations 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'coordinator')
    )
  );

-- Shifts policies
CREATE POLICY "Users can view shifts" ON shifts FOR SELECT USING (true);
CREATE POLICY "Admins and coordinators can manage shifts" ON shifts 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'coordinator')
    )
  );

-- Shift assignments policies
CREATE POLICY "Users can view shift assignments" ON shift_assignments FOR SELECT USING (true);
CREATE POLICY "Volunteers can view their own assignments" ON shift_assignments 
  FOR SELECT USING (volunteer_id = auth.uid());
CREATE POLICY "Admins and coordinators can manage assignments" ON shift_assignments 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'coordinator')
    )
  );

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_assignments_updated_at BEFORE UPDATE ON shift_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default locations
INSERT INTO locations (name, description) VALUES
  ('Main Gate', 'Primary entrance checkpoint'),
  ('Parking Lot A', 'North parking area'),
  ('Parking Lot B', 'South parking area'),
  ('Building Entrance', 'Main building entrance'),
  ('Emergency Exit', 'Emergency exit monitoring');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'volunteer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 