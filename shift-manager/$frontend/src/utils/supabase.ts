import { createClient } from '@supabase/supabase-js';

// For development only - replace with your actual Supabase details in .env.local
// when deploying to production
const DEV_SUPABASE_URL = 'https://xxvygfhpoczrnurmeugz.supabase.co';
const DEV_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4dnlnZmhwb2N6cm51cm1ldWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzQ4MTgsImV4cCI6MjA2NDYxMDgxOH0.DrgPaXmjoAuEVf-zEVByIypYIHOcjvOamOMbtD2kS-g';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || DEV_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || DEV_SUPABASE_ANON_KEY;

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Anonymous Key is missing from environment variables. Using development placeholders - authentication functionality will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if a user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Helper to get the current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
}; 