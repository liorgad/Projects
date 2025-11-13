import { Request, Response, NextFunction } from 'express';
import supabase from '../utils/supabase';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to verify JWT and extract user
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'Unauthorized - No token provided' });
      return;
	}

    // Verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
      return;
    }

    // Get user details from database
    const { data: userData, error: userError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      res.status(401).json({ error: 'Unauthorized - User not found' });
      return;
    }

    // Attach user to request
    req.user = userData;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if user is an admin
export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    return;
  }

  if (req.user.role !== 'Admin') {
    res.status(403).json({ error: 'Forbidden - Admin access required' });
    return;
  }

  next();
}; 