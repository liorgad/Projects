import { createClient } from '@supabase/supabase-js';
import type { 
  Profile, 
  Location, 
  Shift, 
  ShiftAssignment,
  CreateShiftFormData,
  ShiftAssignmentFormData,
  ProfileFormData,
  LocationFormData
} from '@/types';

console.log('📡 Supabase: Initializing client...');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('📡 Supabase: Environment variables:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('📡 Supabase: Missing environment variables!');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('📡 Supabase: Client created successfully');

// Authentication Services
export const authService = {
  async signInWithEmail(email: string, password: string) {
    console.log('🔑 Auth: Signing in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('🔑 Auth: Sign in failed:', error);
    } else {
      console.log('🔑 Auth: Sign in successful for user:', data.user?.id);
    }
    
    return { data, error };
  },

  async signUp(email: string, password: string, userData: Omit<ProfileFormData, 'role'>) {
    console.log('🔑 Auth: Signing up with email:', email, 'and data:', userData);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) {
      console.error('🔑 Auth: Sign up failed:', error);
    } else {
      console.log('🔑 Auth: Sign up successful for user:', data.user?.id);
    }
    
    return { data, error };
  },

  async signOut() {
    console.log('🔑 Auth: Signing out...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('🔑 Auth: Sign out failed:', error);
    } else {
      console.log('🔑 Auth: Sign out successful');
    }
    
    return { error };
  },

  async getCurrentUser() {
    console.log('🔑 Auth: Getting current user...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('🔑 Auth: Get current user failed:', error);
    } else {
      console.log('🔑 Auth: Current user:', user ? user.id : 'None');
    }
    
    return { user, error };
  },

  async updateProfile(userId: string, updates: Partial<ProfileFormData>) {
    console.log('🔑 Auth: Updating profile for user:', userId, 'with updates:', updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('🔑 Auth: Profile update failed:', error);
    } else {
      console.log('🔑 Auth: Profile update successful:', data);
    }
    
    return { data, error };
  },
};

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
    console.log('👤 Profile: Getting profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('👤 Profile: Get profile failed:', error);
    } else {
      console.log('👤 Profile: Get profile successful:', data);
    }
    
    return { data, error };
  },

  async getAllProfiles(): Promise<{ data: Profile[] | null; error: any }> {
    console.log('👤 Profile: Getting all profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
      
    if (error) {
      console.error('👤 Profile: Get all profiles failed:', error);
    } else {
      console.log('👤 Profile: Get all profiles successful, count:', data?.length || 0);
    }
    
    return { data, error };
  },

  async createProfile(profile: ProfileFormData & { id: string }): Promise<{ data: Profile | null; error: any }> {
    console.log('👤 Profile: Creating profile:', profile);
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
      
    if (error) {
      console.error('👤 Profile: Create profile failed:', error);
    } else {
      console.log('👤 Profile: Create profile successful:', data);
    }
    
    return { data, error };
  },

  async updateProfile(id: string, updates: Partial<ProfileFormData>): Promise<{ data: Profile | null; error: any }> {
    console.log('👤 Profile: Updating profile:', id, 'with updates:', updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('👤 Profile: Update profile failed:', error);
    } else {
      console.log('👤 Profile: Update profile successful:', data);
    }
    
    return { data, error };
  },

  async deleteProfile(id: string): Promise<{ error: any }> {
    console.log('👤 Profile: Deleting profile:', id);
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('👤 Profile: Delete profile failed:', error);
    } else {
      console.log('👤 Profile: Delete profile successful');
    }
    
    return { error };
  },
};

// Location Services
export const locationService = {
  async getAllLocations(): Promise<{ data: Location[] | null; error: any }> {
    console.log('📍 Location: Getting all locations...');
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name');
      
    if (error) {
      console.error('📍 Location: Get all locations failed:', error);
    } else {
      console.log('📍 Location: Get all locations successful, count:', data?.length || 0);
    }
    
    return { data, error };
  },

  async createLocation(location: LocationFormData): Promise<{ data: Location | null; error: any }> {
    console.log('📍 Location: Creating location:', location);
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select()
      .single();
      
    if (error) {
      console.error('📍 Location: Create location failed:', error);
    } else {
      console.log('📍 Location: Create location successful:', data);
    }
    
    return { data, error };
  },

  async updateLocation(id: string, updates: Partial<LocationFormData>): Promise<{ data: Location | null; error: any }> {
    console.log('📍 Location: Updating location:', id, 'with updates:', updates);
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('📍 Location: Update location failed:', error);
    } else {
      console.log('📍 Location: Update location successful:', data);
    }
    
    return { data, error };
  },

  async deleteLocation(id: string): Promise<{ error: any }> {
    console.log('📍 Location: Deleting location:', id);
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('📍 Location: Delete location failed:', error);
    } else {
      console.log('📍 Location: Delete location successful');
    }
    
    return { error };
  },
};

// Shift Services
export const shiftService = {
  async getShiftsByDateRange(startDate: string, endDate: string): Promise<{ data: Shift[] | null; error: any }> {
    console.log('📅 Shift: Getting shifts for date range:', startDate, 'to', endDate);
    const { data, error } = await supabase
      .from('shifts')
      .select(`
        *,
        assignments:shift_assignments(
          *,
          volunteer:profiles(*),
          location:locations(*)
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
      
    if (error) {
      console.error('📅 Shift: Get shifts by date range failed:', error);
    } else {
      console.log('📅 Shift: Get shifts by date range successful, count:', data?.length || 0);
    }
    
    return { data, error };
  },

  async getShiftById(id: string): Promise<{ data: Shift | null; error: any }> {
    console.log('📅 Shift: Getting shift by ID:', id);
    const { data, error } = await supabase
      .from('shifts')
      .select(`
        *,
        assignments:shift_assignments(
          *,
          volunteer:profiles(*),
          location:locations(*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('📅 Shift: Get shift by ID failed:', error);
    } else {
      console.log('📅 Shift: Get shift by ID successful:', data);
    }
    
    return { data, error };
  },

  async createShift(shift: CreateShiftFormData & { day_of_week: number }): Promise<{ data: Shift | null; error: any }> {
    console.log('📅 Shift: Creating shift:', shift);
    const { data, error } = await supabase
      .from('shifts')
      .insert(shift)
      .select()
      .single();
      
    if (error) {
      console.error('📅 Shift: Create shift failed:', error);
    } else {
      console.log('📅 Shift: Create shift successful:', data);
    }
    
    return { data, error };
  },

  async updateShift(id: string, updates: Partial<CreateShiftFormData>): Promise<{ data: Shift | null; error: any }> {
    console.log('📅 Shift: Updating shift:', id, 'with updates:', updates);
    const { data, error } = await supabase
      .from('shifts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('📅 Shift: Update shift failed:', error);
    } else {
      console.log('📅 Shift: Update shift successful:', data);
    }
    
    return { data, error };
  },

  async deleteShift(id: string): Promise<{ error: any }> {
    console.log('📅 Shift: Deleting shift:', id);
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('📅 Shift: Delete shift failed:', error);
    } else {
      console.log('📅 Shift: Delete shift successful');
    }
    
    return { error };
  },
};

// Shift Assignment Services
export const shiftAssignmentService = {
  async createAssignment(assignment: ShiftAssignmentFormData & { shift_id: string }): Promise<{ data: ShiftAssignment | null; error: any }> {
    console.log('📋 Assignment: Creating assignment:', assignment);
    const { data, error } = await supabase
      .from('shift_assignments')
      .insert(assignment)
      .select(`
        *,
        volunteer:profiles(*),
        location:locations(*)
      `)
      .single();
      
    if (error) {
      console.error('📋 Assignment: Create assignment failed:', error);
    } else {
      console.log('📋 Assignment: Create assignment successful:', data);
    }
    
    return { data, error };
  },

  async updateAssignment(id: string, updates: Partial<ShiftAssignmentFormData>): Promise<{ data: ShiftAssignment | null; error: any }> {
    console.log('📋 Assignment: Updating assignment:', id, 'with updates:', updates);
    const { data, error } = await supabase
      .from('shift_assignments')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        volunteer:profiles(*),
        location:locations(*)
      `)
      .single();
      
    if (error) {
      console.error('📋 Assignment: Update assignment failed:', error);
    } else {
      console.log('📋 Assignment: Update assignment successful:', data);
    }
    
    return { data, error };
  },

  async deleteAssignment(id: string): Promise<{ error: any }> {
    console.log('📋 Assignment: Deleting assignment:', id);
    const { error } = await supabase
      .from('shift_assignments')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('📋 Assignment: Delete assignment failed:', error);
    } else {
      console.log('📋 Assignment: Delete assignment successful');
    }
    
    return { error };
  },

  async getAssignmentsByVolunteer(volunteerId: string, startDate?: string, endDate?: string): Promise<{ data: ShiftAssignment[] | null; error: any }> {
    console.log('📋 Assignment: Getting assignments for volunteer:', volunteerId, 'date range:', startDate, 'to', endDate);
    let query = supabase
      .from('shift_assignments')
      .select(`
        *,
        shift:shifts(*),
        location:locations(*)
      `)
      .eq('volunteer_id', volunteerId);

    if (startDate && endDate) {
      query = query
        .gte('shift.date', startDate)
        .lte('shift.date', endDate);
    }

    const { data, error } = await query.order('shift.date');
    
    if (error) {
      console.error('📋 Assignment: Get assignments by volunteer failed:', error);
    } else {
      console.log('📋 Assignment: Get assignments by volunteer successful, count:', data?.length || 0);
    }
    
    return { data, error };
  },
};

// Real-time subscriptions
export const subscriptionService = {
  subscribeToShifts(callback: (payload: any) => void) {
    console.log('🔔 Subscription: Setting up shifts subscription...');
    return supabase
      .channel('shifts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shifts' }, (payload) => {
        console.log('🔔 Subscription: Shifts change detected:', payload);
        callback(payload);
      })
      .subscribe();
  },

  subscribeToAssignments(callback: (payload: any) => void) {
    console.log('🔔 Subscription: Setting up assignments subscription...');
    return supabase
      .channel('shift_assignments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shift_assignments' }, (payload) => {
        console.log('🔔 Subscription: Assignments change detected:', payload);
        callback(payload);
      })
      .subscribe();
  },

  subscribeToProfiles(callback: (payload: any) => void) {
    console.log('🔔 Subscription: Setting up profiles subscription...');
    return supabase
      .channel('profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        console.log('🔔 Subscription: Profiles change detected:', payload);
        callback(payload);
      })
      .subscribe();
  },

  unsubscribe(subscription: any) {
    console.log('🔔 Subscription: Unsubscribing from channel...');
    return supabase.removeChannel(subscription);
  },
}; 