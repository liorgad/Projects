-- This file contains Row Level Security (RLS) policies that rely on authentication
-- Apply these after initial setup when authentication is configured

-- First, remove the permissive service role policies
DROP POLICY IF EXISTS service_role_volunteers_policy ON volunteers;
DROP POLICY IF EXISTS service_role_shifts_policy ON shifts;
DROP POLICY IF EXISTS service_role_registrations_policy ON registrations;

-- Admin users can do everything
CREATE POLICY admin_volunteers_policy ON volunteers 
  FOR ALL 
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM volunteers WHERE role = 'Admin'));

CREATE POLICY admin_shifts_policy ON shifts 
  FOR ALL 
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM volunteers WHERE role = 'Admin'));

CREATE POLICY admin_registrations_policy ON registrations 
  FOR ALL 
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM volunteers WHERE role = 'Admin'));

-- Volunteers can read all volunteers
CREATE POLICY volunteer_read_volunteers_policy ON volunteers 
  FOR SELECT 
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM volunteers));

-- Volunteers can read all shifts
CREATE POLICY volunteer_read_shifts_policy ON shifts 
  FOR SELECT 
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM volunteers));

-- Volunteers can read all registrations
CREATE POLICY volunteer_read_registrations_policy ON registrations 
  FOR SELECT 
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM volunteers));

-- Volunteers can create/update their own registrations
CREATE POLICY volunteer_insert_registrations_policy ON registrations 
  FOR INSERT 
  WITH CHECK (volunteer_id IN (
    SELECT id FROM volunteers WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY volunteer_update_registrations_policy ON registrations 
  FOR UPDATE 
  USING (volunteer_id IN (
    SELECT id FROM volunteers WHERE email = auth.jwt() ->> 'email'
  ));

-- RLS policy for volunteers to delete their own registrations
CREATE POLICY volunteer_delete_registrations_policy ON registrations 
  FOR DELETE 
  USING (volunteer_id IN (
    SELECT id FROM volunteers WHERE email = auth.jwt() ->> 'email'
  )); 