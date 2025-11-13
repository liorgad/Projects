import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('Missing required environment variables for Supabase. Please check your .env file.');
  logger.info('Required variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  logger.info('Please create a .env file in the backend directory with these variables.');
  process.exit(1);
}

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const applyAuthPolicies = async () => {
  try {
    logger.info('Starting to apply authentication policies...');

    // Read the auth policies SQL file
    const policiesPath = path.join(__dirname, 'auth_policies.sql');
    if (!fs.existsSync(policiesPath)) {
      logger.error(`Auth policies file not found at ${policiesPath}`);
      process.exit(1);
    }

    const policiesSql = fs.readFileSync(policiesPath, 'utf8');

    // Split the SQL file into individual statements
    const statements = policiesSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    logger.info(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Log a truncated version of the statement for readability
      const logStatement = statement.length > 100 
        ? `${statement.substring(0, 100)}...` 
        : statement;
      
      logger.info(`Executing statement ${i + 1}/${statements.length}: ${logStatement}`);
      
      const { error } = await supabase.rpc('execute_sql', { sql: `${statement};` });
      
      if (error) {
        logger.error(`Error executing statement ${i + 1}: ${error.message}`);
        logger.debug(`Failed statement: ${statement}`);
      } else {
        logger.info(`Statement ${i + 1} executed successfully`);
      }
    }

    logger.info('Authentication policies applied successfully');
  } catch (error) {
    logger.error('Error applying authentication policies:', error);
    if (error instanceof Error) {
      logger.error('Error details:', error.message);
      if (error.stack) {
        logger.debug('Stack trace:', error.stack);
      }
    }
    process.exit(1);
  }
};

// Run the function
applyAuthPolicies(); 