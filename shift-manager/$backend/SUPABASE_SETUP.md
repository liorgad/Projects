# Supabase Setup Guide

This guide will help you set up a Supabase project for the Shift Manager application.

## Creating a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project by clicking "New Project"
3. Enter a name for your project (e.g., "shift-manager")
4. Set a secure database password (save this for future reference)
5. Choose a region closest to your users
6. Click "Create new project"

## Getting Your API Credentials

1. Once your project is created, go to the project dashboard
2. In the left sidebar, click on "Settings" (gear icon)
3. Click on "API" in the settings menu
4. Under "Project API keys", you'll find:
   - URL: Copy the "Project URL" value
   - Key: Copy the "service_role" key (NOT the anon key)
5. Add these values to your `.env` file as:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Enabling the SQL Execution RPC

Our migration script requires the ability to execute SQL via RPC. To enable this:

1. In your Supabase dashboard, go to the SQL Editor
2. Create a new query
3. Paste and execute the following SQL:

```sql
-- Create a function to execute SQL statements
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create a function to enable extensions
CREATE OR REPLACE FUNCTION extensions(name text, schema text, version text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('CREATE EXTENSION IF NOT EXISTS %I WITH SCHEMA %I VERSION %I', name, schema, version);
END;
$$;
```

## Running the Setup Scripts

Once you've completed the steps above, you can set up your database:

1. Ensure your `.env` file is properly configured with your Supabase credentials
2. Run the setup script:
   ```
   npm run setup-db
   ```

This will create the database tables with permissive RLS policies that allow the service role to perform any operation without authentication.

## Setting Up Authentication

The setup is divided into two phases to avoid authentication errors during initial setup:

1. **Initial Setup (already completed above)**
   - Creates tables with permissive RLS policies
   - Allows seeding data without authentication

2. **Authentication Setup (after configuring Supabase Auth)**
   - After you've set up authentication in your application, run:
   ```
   npm run apply-auth-policies
   ```
   - This replaces the permissive policies with proper authentication-based policies

## Manual Table Creation (Optional)

If you prefer to create the tables manually using the Supabase SQL Editor:

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of the `backend/src/db/schema.sql` file
4. Execute the query

## Testing Your Setup

To verify that your setup is working correctly:

1. Run the seed script:
   ```
   npm run seed
   ```
2. If successful, you should see log messages indicating that volunteers, shifts, and registrations were created
3. You can also check the Supabase Table Editor to view the created data

## Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure your `.env` file exists and contains the correct credentials

2. **"Error executing statement: permission denied"**
   - Verify that you're using the service_role key, not the anon key
   - Check that the SQL execution functions were created successfully

3. **"Error: Failed to enable extension"**
   - Some extensions may require enabling from the Supabase dashboard
   - Go to Database > Extensions and enable the uuid-ossp extension

4. **"Error during seeding"**
   - Check that your tables were created correctly
   - Verify that your database schema matches the expected schema in the application

5. **"auth.jwt() errors" or "no email" errors**
   - These occur when trying to use authentication-based policies before setting up auth
   - Make sure to run `npm run setup-db` before `npm run apply-auth-policies`
   - Only run `apply-auth-policies` after you've set up authentication in your app 