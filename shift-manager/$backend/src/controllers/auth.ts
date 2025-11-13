import { Request, Response } from 'express';
import supabase from '../utils/supabase';

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to request by auth middleware
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Optional: Add custom password validation here
    // if (password.length < 8) {
    //   res.status(400).json({ error: 'Password must be at least 8 characters' });
    //   return;
    // }

    // Attempt to sign in with Supabase - THIS IS WHERE PASSWORD IS VERIFIED
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    if (!data.user || !data.session) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    // Get user details from database
    const { data: userData, error: userError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      res.status(401).json({ error: 'User not found in database' });
      return;
    }

    res.status(200).json({
      user: userData,
      token: data.session.access_token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, reason } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (!role) {
      res.status(400).json({ error: 'Role is required' });
      return;
    }

    if (!['Admin', 'Volunteer'].includes(role)) {
      res.status(400).json({ error: 'Role must be either Admin or Volunteer' });
      return;
    }

    if (!reason) {
      res.status(400).json({ error: 'Reason for registration is required' });
      return;
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (!data.user) {
      res.status(400).json({ error: 'Failed to create user' });
      return;
    }

    // Create user profile in volunteers table
    const { data: userData, error: userError } = await supabase
      .from('volunteers')
      .insert({
        id: data.user.id,
        name,
        email,
        phone: phone || null,
        role,
        reason,
      })
      .select()
      .single();

    if (userError) {
      res.status(400).json({ error: userError.message });
      return;
    }

    // If we have a session, return it with the user data
    const token = data.session?.access_token;
    
    res.status(201).json({
      user: userData,
      token: token || null,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    if (!name && !phone) {
      res.status(400).json({ error: 'At least one field to update is required' });
      return;
    }

    // Create update object with only provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    // Update profile
    const { data, error } = await supabase
      .from('volunteers')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 