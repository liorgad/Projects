export const APP_NAME = 'Volunteer Shift Manager';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CALENDAR: '/calendar',
  VOLUNTEERS: '/volunteers',
  LOCATIONS: '/locations',
  SHIFTS: '/shifts',
  PROFILE: '/profile',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  COORDINATOR: 'coordinator',
  VOLUNTEER: 'volunteer',
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.COORDINATOR]: 'Coordinator',
  [USER_ROLES.VOLUNTEER]: 'Volunteer',
} as const;

export const HEBREW_DAYS = {
  0: 'א', // Sunday
  1: 'ב', // Monday
  2: 'ג', // Tuesday
  3: 'ד', // Wednesday
  4: 'ה', // Thursday
  5: 'ו', // Friday
  6: 'ש', // Saturday
} as const;

export const ENGLISH_DAYS = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
} as const;

export const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
] as const;

export const SHIFT_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-red-100 text-red-800 border-red-200',
] as const;

export const MOBILE_PATROL_COLOR = 'bg-yellow-100 text-yellow-800 border-yellow-200';

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;

export const API_ENDPOINTS = {
  PROFILES: '/profiles',
  LOCATIONS: '/locations',
  SHIFTS: '/shifts',
  ASSIGNMENTS: '/shift_assignments',
} as const;

export const FORM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_PATTERN: /^\+?[\d\s\-\(\)]{10,}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NOTES_MAX_LENGTH: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const DEFAULT_LOCATIONS = [
  { name: 'Main Gate', description: 'Primary entrance checkpoint' },
  { name: 'Parking Lot A', description: 'North parking area' },
  { name: 'Parking Lot B', description: 'South parking area' },
  { name: 'Building Entrance', description: 'Main building entrance' },
  { name: 'Emergency Exit', description: 'Emergency exit monitoring' },
] as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

export const SUCCESS_MESSAGES = {
  SHIFT_CREATED: 'Shift created successfully',
  SHIFT_UPDATED: 'Shift updated successfully',
  SHIFT_DELETED: 'Shift deleted successfully',
  ASSIGNMENT_CREATED: 'Volunteer assigned successfully',
  ASSIGNMENT_UPDATED: 'Assignment updated successfully',
  ASSIGNMENT_DELETED: 'Assignment removed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  LOCATION_CREATED: 'Location created successfully',
  LOCATION_UPDATED: 'Location updated successfully',
  LOCATION_DELETED: 'Location deleted successfully',
} as const; 