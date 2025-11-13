import { Request, Response } from 'express';
import supabase from '../utils/supabase';

// Get all shifts
export const getAllShifts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting shifts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get shift by ID
export const getShiftById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get shift data
    const { data: shift, error: shiftError } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', id)
      .single();

    if (shiftError || !shift) {
      res.status(404).json({ error: 'Shift not found' });
      return;
    }

    // Get registrations for this shift
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('*, volunteers:volunteer_id(name, email)')
      .eq('shift_id', id);

    if (regError) {
      res.status(400).json({ error: regError.message });
      return;
    }

    // Return combined data
    res.status(200).json({
      ...shift,
      registrations: registrations || []
    });
  } catch (error) {
    console.error('Error getting shift by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new shift (admin only)
export const createShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time, location, has_patrol, notes } = req.body;

    // Validate required fields
    if (!date || !time || !location) {
      res.status(400).json({ error: 'Date, time, and location are required' });
      return;
    }

    // Insert new shift
    const { data, error } = await supabase
      .from('shifts')
      .insert([
        { date, time, location, has_patrol: has_patrol || false, notes: notes || '' }
      ])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update shift (admin only)
export const updateShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, time, location, has_patrol, notes } = req.body;

    // Validate at least one field is provided
    if (!date && !time && !location && has_patrol === undefined && !notes) {
      res.status(400).json({ error: 'At least one field to update is required' });
      return;
    }

    // Create update object with only provided fields
    const updateData: any = {};
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (location) updateData.location = location;
    if (has_patrol !== undefined) updateData.has_patrol = has_patrol;
    if (notes !== undefined) updateData.notes = notes;

    // Update shift
    const { data, error } = await supabase
      .from('shifts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: 'Shift not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete shift (admin only)
export const deleteShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Delete associated registrations first
    const { error: regError } = await supabase
      .from('registrations')
      .delete()
      .eq('shift_id', id);

    if (regError) {
      res.status(400).json({ error: regError.message });
      return;
    }

    // Delete the shift
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 