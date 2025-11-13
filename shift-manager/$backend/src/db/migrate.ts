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

const runMigration = async () => {
  try {
    logger.info('Starting database migration...');

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      logger.error(`Schema file not found at ${schemaPath}`);
      process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split the SQL file into individual statements
    // This is a simple approach and might not work for all SQL statements
    const statements = schemaSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    logger.info(`Found ${statements.length} SQL statements to execute`);

    // Enable UUID extension if not already enabled
    logger.info('Enabling UUID extension...');
    const { error: uuidError } = await supabase.rpc('extensions', {
      name: 'uuid-ossp',
      schema: 'public',
      version: '1.1'
    });

    if (uuidError) {
      logger.warn(`Error enabling UUID extension: ${uuidError.message}`);
      logger.info('Continuing with migration...');
    } else {
      logger.info('UUID extension enabled successfully');
    }

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

    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Error during migration:', error);
    if (error instanceof Error) {
      logger.error('Error details:', error.message);
      if (error.stack) {
        logger.debug('Stack trace:', error.stack);
      }
    }
    process.exit(1);
  }
};

// Run the migration
runMigration(); 