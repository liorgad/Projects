# Shift Manager Backend

## Setup Instructions

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   Replace `your_supabase_url` and `your_supabase_service_role_key` with your actual Supabase credentials.

   You can find these values in your Supabase project dashboard under Settings > API.

3. **Set up the database:**
   ```
   npm run setup-db
   ```
   This will:
   - Run the database migration script to create all necessary tables with permissive RLS policies
   - Seed the database with initial test data

   Alternatively, you can run these steps separately:
   ```
   npm run migrate  # Create tables only
   npm run seed     # Add test data only
   ```

4. **Apply authentication policies (after setting up auth):**
   ```
   npm run apply-auth-policies
   ```
   This step should only be run after you've configured authentication in your application.
   It replaces the permissive RLS policies with proper authentication-based policies.

5. **Start the development server:**
   ```
   npm run dev
   ```

## Database Schema

The application uses Supabase with the following schema:

### Tables

1. **volunteers**
   - `id` - UUID primary key
   - `name` - Volunteer's full name
   - `email` - Unique email address
   - `phone` - Phone number
   - `role` - Either 'Admin' or 'Volunteer'
   - `created_at` - Timestamp of creation
   - `updated_at` - Timestamp of last update

2. **shifts**
   - `id` - UUID primary key
   - `date` - Date of the shift
   - `time` - Time of day ('Morning', 'Afternoon', 'Evening')
   - `location` - Location of the shift
   - `has_patrol` - Boolean indicating if patrol is required
   - `notes` - Additional notes
   - `created_at` - Timestamp of creation
   - `updated_at` - Timestamp of last update

3. **registrations**
   - `id` - UUID primary key
   - `volunteer_id` - Reference to volunteers table
   - `shift_id` - Reference to shifts table
   - `status` - Status of registration ('Pending', 'Confirmed', 'Cancelled')
   - `created_at` - Timestamp of creation
   - `updated_at` - Timestamp of last update

### Security

The database uses Row Level Security (RLS) policies to restrict access. The setup is divided into two phases:

1. **Initial Setup Phase:**
   - Service role has full access to all tables
   - This allows seeding and initial operations without authentication

2. **Authentication Phase:**
   - Admin users can perform all operations on all tables
   - Regular volunteers can:
     - View all volunteers, shifts, and registrations
     - Create, update, and delete only their own registrations

## Logging

The application uses Winston for logging. Logs are saved to:
- `logs/all.log` - Contains all logs
- `logs/error.log` - Contains only error logs

Log levels:
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `http` - HTTP request/response logs
- `debug` - Debug information

In production, only logs of level `info` and above are recorded.

## Troubleshooting

If you encounter errors when running the setup scripts:

1. Verify that your Supabase credentials are correct in the `.env` file
2. Check if your Supabase instance has the SQL execution RPC enabled
3. Check the `logs/error.log` file for detailed error information
4. Make sure you have the necessary permissions on your Supabase project

### Common Authentication Issues

If you see errors about "auth.jwt()" or "no email":
- These occur when trying to use authentication-based policies before setting up auth
- Make sure to run `npm run setup-db` first for the initial permissive setup
- Only run `npm run apply-auth-policies` after you've configured authentication

For more detailed instructions, see the [Supabase Setup Guide](./SUPABASE_SETUP.md). 