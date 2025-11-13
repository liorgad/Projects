import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger';

// Load environment variables
dotenv.config();

// Check if required environment variables exist
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseKey) {
  const errorMessage = 'Missing Supabase environment variables. Please create a .env file with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY';
  
  // If logger is available, use it; otherwise fall back to console
  if (typeof logger !== 'undefined') {
    logger.error(errorMessage);
  } else {
    console.error(errorMessage);
  }
  
  // Create a dummy client that logs errors on every operation
  supabase = {
    from: () => ({
      insert: () => ({ data: null, error: new Error('Supabase client not properly initialized') }),
      select: () => ({ data: null, error: new Error('Supabase client not properly initialized') }),
      update: () => ({ data: null, error: new Error('Supabase client not properly initialized') }),
      delete: () => ({ data: null, error: new Error('Supabase client not properly initialized') }),
      single: () => ({ data: null, error: new Error('Supabase client not properly initialized') })
    }),
    auth: {
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase client not properly initialized') }),
      signIn: () => Promise.resolve({ data: null, error: new Error('Supabase client not properly initialized') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase client not properly initialized') })
    }
  };
} else {
  // Create real Supabase client
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default supabase; 