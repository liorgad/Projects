import React from 'react';

// Base Types
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type UserRole = 'admin' | 'coordinator' | 'volunteer';

// Database Entity Types
export interface Profile {
  id: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  is_senior_volunteer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Shift {
  id: string;
  date: string;
  day_of_week: DayOfWeek;
  has_mobile_patrol: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  assignments?: ShiftAssignment[];
}

export interface ShiftAssignment {
  id: string;
  shift_id: string;
  volunteer_id: string;
  location_id?: string;
  start_time?: string;
  end_time?: string;
  is_mobile_patrol: boolean;
  special_notes?: string;
  created_at: string;
  updated_at: string;
  volunteer?: Profile;
  location?: Location;
  shift?: Shift;
}

// Form Data Types
export interface ProfileFormData {
  full_name: string;
  phone_number?: string;
  role: UserRole;
  is_senior_volunteer?: boolean;
}

export interface LocationFormData {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateShiftFormData {
  date: string;
  has_mobile_patrol?: boolean;
  notes?: string;
}

export interface ShiftAssignmentFormData {
  volunteer_id: string;
  location_id?: string;
  start_time?: string;
  end_time?: string;
  is_mobile_patrol?: boolean;
  special_notes?: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface AuthState {
  user: Profile | null;
  session: any | null;
  loading: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Omit<ProfileFormData, 'role'>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileFormData>) => Promise<{ error: any }>;
}

// UI Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color?: string;
  volunteer?: Profile;
  location?: Location;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T | null;
  error: any;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 