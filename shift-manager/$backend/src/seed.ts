import dotenv from 'dotenv';
import supabase from './utils/supabase';
import logger from './utils/logger';
import path from 'path';
import fs from 'fs';
import { SupabaseClient } from '@supabase/supabase-js';

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('Missing required environment variables for Supabase. Please check your .env file.');
  logger.info('Required variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  logger.info('Please create a .env file in the backend directory with these variables.');
  process.exit(1);
}

const seedData = async () => {
  logger.info('Seeding database...');
  
  try {
    // Create test admin user
    logger.debug('Attempting to create admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('volunteers')
      .insert([
        {
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '555-123-4567',
          role: 'Admin'
        }
      ])
      .select()
	.single();
	  
	  

    if (adminError) {
      logger.error('Error creating admin user:', adminError.message || JSON.stringify(adminError));
    } else {
      logger.info('Admin user created:', adminUser);
    }

    // Create test volunteer users
    logger.debug('Attempting to create volunteer users...');
    const { data: volunteers, error: volError } = await supabase
      .from('volunteers')
      .insert([
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-111-2222',
          role: 'Volunteer'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-333-4444',
          role: 'Volunteer'
        }
      ])
      .select();

    if (volError) {
      logger.error('Error creating volunteer users:', volError.message || JSON.stringify(volError));
    } else {
      logger.info(`${volunteers?.length || 0} volunteer users created`);
    }

    // Create test shifts
    logger.debug('Attempting to create shifts...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data: shifts, error: shiftsError } = await supabase
      .from('shifts')
      .insert([
        {
          date: today.toISOString().split('T')[0],
          time: 'Morning',
          location: 'Downtown',
          has_patrol: true,
          notes: 'Bring water and sunscreen'
        },
        {
          date: today.toISOString().split('T')[0],
          time: 'Evening',
          location: 'Riverside',
          has_patrol: false,
          notes: 'Evening shift, bring flashlight'
        },
        {
          date: tomorrow.toISOString().split('T')[0],
          time: 'Morning',
          location: 'Park Area',
          has_patrol: true,
          notes: ''
        },
        {
          date: nextWeek.toISOString().split('T')[0],
          time: 'Evening',
          location: 'City Center',
          has_patrol: true,
          notes: 'Special event'
        }
      ])
      .select();

    if (shiftsError) {
      logger.error('Error creating shifts:', shiftsError.message || JSON.stringify(shiftsError));
    } else {
      logger.info(`${shifts?.length || 0} shifts created`);
    }

    // Create test registrations if volunteers and shifts were created
    if (volunteers && shifts) {
      logger.debug('Attempting to create registrations...');
      const registrations = [];
      
      // First volunteer registered for first shift
      if (volunteers[0] && shifts[0]) {
        registrations.push({
          volunteer_id: volunteers[0].id,
          shift_id: shifts[0].id,
          status: 'Confirmed'
        });
      }
      
      // Second volunteer registered for second shift
      if (volunteers[1] && shifts[1]) {
        registrations.push({
          volunteer_id: volunteers[1].id,
          shift_id: shifts[1].id,
          status: 'Pending'
        });
      }
      
      // First volunteer also registered for future shift
      if (volunteers[0] && shifts[3]) {
        registrations.push({
          volunteer_id: volunteers[0].id,
          shift_id: shifts[3].id,
          status: 'Pending'
        });
      }

      const { data: regs, error: regsError } = await supabase
        .from('registrations')
        .insert(registrations)
        .select();

      if (regsError) {
        logger.error('Error creating registrations:', regsError.message || JSON.stringify(regsError));
      } else {
        logger.info(`${regs?.length || 0} registrations created`);
      }
    }

    logger.info('Seeding complete!');
  } catch (error) {
    logger.error('Error during seeding:', error);
    if (error instanceof Error) {
      logger.error('Error details:', error.message);
      if (error.stack) {
        logger.debug('Stack trace:', error.stack);
      }
    } else {
      logger.error('Unknown error type:', JSON.stringify(error));
    }
  }
};

// Run the seed function
seedData(); 