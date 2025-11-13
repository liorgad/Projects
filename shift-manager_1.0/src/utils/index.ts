import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  isSameDay,
  addWeeks,
  subWeeks,
  getDay,
  parseISO,
  formatISO
} from 'date-fns';
import { HEBREW_DAYS } from '@/constants';
import { type DayOfWeek } from '@/types';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatStr = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format time for display (HH:MM)
 */
export function formatTime(time: string): string {
  if (!time) return '';
  return time.slice(0, 5);
}

/**
 * Get the current week's date range
 */
export function getCurrentWeek(): Date[] {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Start on Sunday
  const end = endOfWeek(today, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

/**
 * Get week date range for a given date
 */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

/**
 * Navigate to next week
 */
export function getNextWeek(currentWeek: Date): Date {
  return addWeeks(currentWeek, 1);
}

/**
 * Navigate to previous week
 */
export function getPreviousWeek(currentWeek: Date): Date {
  return subWeeks(currentWeek, 1);
}

/**
 * Get Hebrew day name for a date
 */
export function getHebrewDayName(date: Date): string {
  const dayOfWeek = getDay(date) as DayOfWeek;
  return HEBREW_DAYS[dayOfWeek];
}

/**
 * Check if a date is today
 */
export function isDateToday(date: Date): boolean {
  return isToday(date);
}

/**
 * Check if two dates are the same day
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Convert Date to ISO string for database storage
 */
export function dateToISOString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Get day of week number (0-6) for a date
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  return getDay(date) as DayOfWeek;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  return phone; // Return original if can't format
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a random color for volunteer assignments
 */
export function getVolunteerColor(volunteerId: string): string {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-red-100 text-red-800 border-red-200',
  ];
  
  // Generate consistent color based on volunteer ID
  const hash = volunteerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate initials from full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

/**
 * Check if user has permission for action
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    volunteer: 0,
    coordinator: 1,
    admin: 2
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 99;
  
  return userLevel >= requiredLevel;
} 