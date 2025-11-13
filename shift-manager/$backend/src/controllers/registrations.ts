import { Request, Response } from 'express';
import supabase from '../utils/supabase';

// Register for a shift
export const registerForShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shift_id } = req.body;
    const volunteer_id = req.user.id;

    if (!shift_id) {
      res.status(400).json({ error: 'Shift ID is required' });
      return;
    }

    // Check if shift exists
    const { data: shift, error: shiftError } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', shift_id)
      .single();

    if (shiftError || !shift) {
      res.status(404).json({ error: 'Shift not found' });
      return;
    }

    // Check if already registered
    const { data: existingReg, error: regError } = await supabase
      .from('registrations')
      .select('*')
      .eq('shift_id', shift_id)
      .eq('volunteer_id', volunteer_id)
      .maybeSingle();

    if (existingReg) {
      res.status(400).json({ error: 'Already registered for this shift' });
      return;
    }

    // Create new registration
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        { 
          shift_id,
          volunteer_id,
          status: 'Pending'
        }
      ])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error registering for shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's registrations
export const getUserRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteer_id = req.user.id;

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        shifts:shift_id (
          id,
          date,
          time,
          location,
          has_patrol,
          notes
        )
      `)
      .eq('volunteer_id', volunteer_id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting user registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update registration status (admin only)
export const updateRegistrationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
      res.status(400).json({ error: 'Valid status is required' });
      return;
    }

    const { data, error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel registration
export const cancelRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const volunteer_id = req.user.id;

    // Check if registration exists and belongs to the user
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .eq('volunteer_id', volunteer_id)
      .single();

    if (regError || !registration) {
      res.status(404).json({ error: 'Registration not found or not authorized' });
      return;
    }

    // Update status to Cancelled
    const { data, error } = await supabase
      .from('registrations')
      .update({ status: 'Cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 