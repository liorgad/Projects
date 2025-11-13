# Cursor IDE Prompt: Volunteer Shift Management Web Application

## Project Overview
Create a comprehensive volunteer shift management web application using **React 18+**, **TypeScript**, and **Supabase** as the backend. The application should replicate and enhance the functionality of a volunteer roster spreadsheet system for managing police volunteer shifts.

## Technical Stack Requirements
- **Frontend**: React 18+ with TypeScript (strict mode)
- **Backend**: Supabase (authentication, database, real-time subscriptions)
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API + useReducer for complex state
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns library
- **Icons**: Lucide React icons
- **Notifications**: React Hot Toast

## Core Features & Database Schema

### 1. Database Tables (Supabase)
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT CHECK (role IN ('admin', 'coordinator', 'volunteer')) DEFAULT 'volunteer',
  is_senior_volunteer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shifts table
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  has_mobile_patrol BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shift assignments table
CREATE TABLE shift_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  start_time TIME,
  end_time TIME,
  is_mobile_patrol BOOLEAN DEFAULT FALSE,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shift_id, volunteer_id)
);
```

### 2. Authentication & Security
- Implement Supabase Row Level Security (RLS) policies
- Role-based access control (Admin, Coordinator, Volunteer)
- Volunteers can only view schedules, Coordinators can edit, Admins have full access
- Secure API endpoints with proper authentication middleware
- Input validation and sanitization on all forms

### 3. Core Components Structure

#### Main Application Components:
```typescript
// App.tsx - Main application with routing
// components/Layout/MainLayout.tsx - Responsive layout with navigation
// components/Auth/AuthProvider.tsx - Authentication context
// components/Calendar/ShiftCalendar.tsx - Main calendar view
// components/Shifts/ShiftManager.tsx - Shift creation and editing
// components/Volunteers/VolunteerManager.tsx - Volunteer management
// components/Locations/LocationManager.tsx - Location management
```

#### Key Features to Implement:

**Calendar View (Primary Interface):**
- Weekly calendar grid showing days (Sunday-Saturday, Hebrew: א-ש)
- Each day shows:
  - Date number
  - Mobile patrol availability indicator
  - List of assigned volunteers with locations and times
  - Color coding for different volunteer roles/locations
- Click-to-edit functionality for coordinators/admins
- Responsive design: Desktop shows full week, mobile shows day-by-day swipe view

**Shift Management:**
- Add/edit/delete shifts
- Assign multiple volunteers per shift
- Specify locations and time ranges
- Mobile patrol assignment tracking
- Bulk operations for recurring shifts
- Conflict detection (same volunteer, multiple assignments)

**Volunteer Management:**
- Profile management with contact information
- Role assignment (Senior volunteer, Regular volunteer)
- Availability tracking
- Volunteer statistics and history

**Real-time Updates:**
- Use Supabase real-time subscriptions
- Live updates when shifts are modified
- Optimistic UI updates with error handling

## Responsive Design Requirements

### Desktop (≥1024px):
- Full week calendar view
- Sidebar with volunteer list and quick actions
- Modal dialogs for detailed editing
- Drag-and-drop functionality for shift assignments

### Tablet (768px-1023px):
- Condensed week view
- Collapsible sidebar
- Touch-friendly interface elements

### Mobile (≤767px):
- Single day view with swipe navigation
- Full-screen edit dialogs
- Bottom navigation bar
- Pull-to-refresh functionality

## Code Quality & Standards

### TypeScript Configuration:
- Strict mode enabled
- Proper type definitions for all components
- Interface definitions for API responses
- Generic types for reusable components

### Component Standards:
```typescript
// Example component structure
interface ShiftCalendarProps {
  selectedWeek: Date;
  onWeekChange: (week: Date) => void;
  readonly?: boolean;
}

const ShiftCalendar: React.FC<ShiftCalendarProps> = ({ 
  selectedWeek, 
  onWeekChange, 
  readonly = false 
}) => {
  // Component implementation with proper error boundaries
  // Loading states, error handling, and accessibility
};
```

### Security Best Practices:
- Validate all inputs using Zod schemas
- Sanitize user-generated content
- Implement proper CORS policies
- Use environment variables for sensitive configuration
- Implement rate limiting for API calls

### Performance Optimization:
- Lazy loading for large volunteer lists
- Memoization for expensive calculations
- Virtual scrolling for large datasets
- Image optimization and lazy loading
- Code splitting by routes

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management for modals and forms
- Semantic HTML structure

## Error Handling & User Experience
- Comprehensive error boundaries
- Toast notifications for user actions
- Loading states for all async operations
- Offline functionality with service workers
- Data persistence during network interruptions
- Clear validation messages in Hebrew/English

## Deployment & Environment Setup
- Environment-specific configuration files
- Supabase environment variables setup
- Docker containerization for consistent development
- CI/CD pipeline configuration
- Performance monitoring setup

## Development Guidelines
- Use functional components with hooks exclusively
- Implement custom hooks for business logic
- Follow atomic design principles
- Write comprehensive JSDoc comments
- Include unit tests for utility functions
- Integration tests for critical user flows

## Additional Features to Consider
- Export schedules to PDF/Excel
- Email/SMS notifications for shift reminders
- Volunteer availability calendar
- Shift statistics and reporting
- Multi-language support (Hebrew/English)
- Dark mode toggle

## File Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── services/         # API service functions
├── stores/           # State management
└── constants/        # Application constants
```

Generate a production-ready application with proper error handling, loading states, and a polished user interface that works seamlessly on both desktop and mobile devices.