import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, authService, profileService } from '@/services/supabase';
import type { Profile, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('🔐 AuthProvider: Component mounting...');
  
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing authentication...');
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔐 AuthProvider: Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔐 AuthProvider: Initial session:', session ? `Found for user ${session.user?.id}` : 'None');
        
        if (session?.user) {
          console.log('🔐 AuthProvider: Fetching user profile for ID:', session.user.id);
          const { data: profile, error: profileError } = await profileService.getProfile(session.user.id);
          
          if (profileError) {
            console.error('🔐 AuthProvider: Error fetching profile:', profileError);
          } else {
            console.log('🔐 AuthProvider: Profile loaded successfully:', profile);
          }
          
          setState({
            user: profile,
            session,
            loading: false,
          });
        } else {
          console.log('🔐 AuthProvider: No session found, user logged out');
          setState({
            user: null,
            session: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('🔐 AuthProvider: Error getting session:', error);
        setState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    getSession();

    // Listen for auth changes
    console.log('🔐 AuthProvider: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider: Auth state changed:', event, session ? `Session for ${session.user?.id}` : 'No session');
        
        if (session?.user) {
          console.log('🔐 AuthProvider: User signed in, fetching profile...');
          // User signed in - fetch profile
          const { data: profile, error: profileError } = await profileService.getProfile(session.user.id);
          
          if (profileError) {
            console.error('🔐 AuthProvider: Error fetching profile after sign in:', profileError);
          } else {
            console.log('🔐 AuthProvider: Profile fetched after sign in:', profile);
          }
          
          setState({
            user: profile,
            session,
            loading: false,
          });
        } else {
          console.log('🔐 AuthProvider: User signed out, clearing state');
          // User signed out
          setState({
            user: null,
            session: null,
            loading: false,
          });
        }
      }
    );

    return () => {
      console.log('🔐 AuthProvider: Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthProvider: Sign in attempt for email:', email);
    setState((prev: AuthState) => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await authService.signInWithEmail(email, password);
      
      if (error) {
        console.error('🔐 AuthProvider: Sign in error:', error);
        setState((prev: AuthState) => ({ ...prev, loading: false }));
        return { error };
      }

      console.log('🔐 AuthProvider: Sign in successful, waiting for auth state change...');
      // Profile will be loaded in the auth state change listener
      return { error: null };
    } catch (error) {
      console.error('🔐 AuthProvider: Sign in exception:', error);
      setState((prev: AuthState) => ({ ...prev, loading: false }));
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('🔐 AuthProvider: Sign up attempt for email:', email, 'with data:', userData);
    setState((prev: AuthState) => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await authService.signUp(email, password, userData);
      
      if (error) {
        console.error('🔐 AuthProvider: Sign up error:', error);
        setState((prev: AuthState) => ({ ...prev, loading: false }));
        return { error };
      }

      console.log('🔐 AuthProvider: Sign up successful, creating profile...');
      // Create profile after successful signup
      if (data.user) {
        const profileData = {
          id: data.user.id,
          full_name: userData.full_name,
          phone_number: userData.phone_number || null,
          role: 'volunteer' as const,
          is_senior_volunteer: false,
        };

        console.log('🔐 AuthProvider: Creating profile with data:', profileData);
        const { error: profileError } = await profileService.createProfile(profileData);
        if (profileError) {
          console.error('🔐 AuthProvider: Error creating profile:', profileError);
        } else {
          console.log('🔐 AuthProvider: Profile created successfully');
        }
      }

      setState((prev: AuthState) => ({ ...prev, loading: false }));
      return { error: null };
    } catch (error) {
      console.error('🔐 AuthProvider: Sign up exception:', error);
      setState((prev: AuthState) => ({ ...prev, loading: false }));
      return { error };
    }
  };

  const signOut = async () => {
    console.log('🔐 AuthProvider: Sign out attempt...');
    setState((prev: AuthState) => ({ ...prev, loading: true }));
    
    try {
      await authService.signOut();
      console.log('🔐 AuthProvider: Sign out successful');
      // State will be updated in the auth state change listener
          } catch (error) {
        console.error('🔐 AuthProvider: Error signing out:', error);
        setState((prev: AuthState) => ({ ...prev, loading: false }));
      }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('🔐 AuthProvider: Update profile attempt with data:', updates);
    
    if (!state.user) {
      console.error('🔐 AuthProvider: Cannot update profile - no user logged in');
      return { error: new Error('No user logged in') };
    }

    try {
      const { data, error } = await profileService.updateProfile(state.user.id, updates);
      
      if (error) {
        console.error('🔐 AuthProvider: Profile update error:', error);
        return { error };
      }

      console.log('🔐 AuthProvider: Profile updated successfully:', data);
      // Update local state
      setState((prev: AuthState) => ({
        ...prev,
        user: data,
      }));

      return { error: null };
    } catch (error) {
      console.error('🔐 AuthProvider: Profile update exception:', error);
      return { error };
    }
  };

  // Log state changes
  useEffect(() => {
    console.log('🔐 AuthProvider: State updated:', {
      hasUser: !!state.user,
      hasSession: !!state.session,
      loading: state.loading,
      userName: state.user?.full_name,
      userRole: state.user?.role
    });
  }, [state]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 