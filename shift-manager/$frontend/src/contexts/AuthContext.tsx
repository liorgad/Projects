import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { api } from '../services/api';

// Define the context types
type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { name?: string; phone?: string }) => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateUserProfile: async () => {},
});

// For development/demo mode when Supabase is not configured
const isDemoMode = !process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY;

// Mock user data for development/demo mode
const mockUser = isDemoMode ? {
  id: 'mock-user-id',
  email: 'demo@example.com',
  user_metadata: {
    name: 'Demo User'
  }
} : null;

const mockProfile = isDemoMode ? {
  id: 'mock-user-id',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '123-456-7890',
  role: 'Admin' // or 'Volunteer'
} : null;

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(isDemoMode ? mockUser as unknown as User : null);
  const [profile, setProfile] = useState<any | null>(isDemoMode ? mockProfile : null);
  const [isLoading, setIsLoading] = useState(!isDemoMode);

  // Check if the user is an admin
  const isAdmin = profile?.role === 'Admin';

  // Initialize authentication state
  useEffect(() => {
    // Skip Supabase authentication in demo mode
    if (isDemoMode) {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Get user profile from the API
          const profile = await api.getCurrentUser();
          setProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      
      setIsLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const profile = await api.getCurrentUser();
              setProfile(profile);
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          } else {
            setProfile(null);
          }
          
          setIsLoading(false);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    // In demo mode, simulate successful login with the mock user
    if (isDemoMode) {
      setUser(mockUser as unknown as User);
      setProfile(mockProfile);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    // In demo mode, simulate successful signup
    if (isDemoMode) {
      setUser(mockUser as unknown as User);
      setProfile(mockProfile);
      return { error: null };
    }

    // First register with Supabase Auth
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (!error) {
      // Then create a profile in the volunteers table
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase.from('volunteers').insert([
            {
              id: user.id,
              name,
              email,
              phone: phone || '',
              role: 'Volunteer', // Default role
            },
          ]);
        }
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        return { error: profileError };
      }
    }
    
    return { error };
  };

  // Sign out
  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setProfile(null);
  };

  // Update user profile
  const updateUserProfile = async (data: { name?: string; phone?: string }) => {
    if (isDemoMode) {
      const updatedProfile = {
        ...mockProfile,
        ...data
      };
      setProfile(updatedProfile);
      return;
    }

    try {
      const updatedProfile = await api.updateProfile(data);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 