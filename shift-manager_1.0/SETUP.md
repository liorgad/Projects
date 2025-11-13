# Volunteer Shift Manager - Setup Guide

This is a comprehensive volunteer shift management web application built with React 18+, TypeScript, and Supabase.

## 🚀 Features

- **Authentication**: Secure user login/registration with role-based access control
- **Shift Management**: Create, edit, and manage volunteer shifts with calendar view
- **Volunteer Management**: Manage volunteer profiles and assignments
- **Location Management**: Configure and manage shift locations
- **Real-time Updates**: Live updates when shifts are modified
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Hebrew/English Support**: Calendar displays Hebrew day names
- **Role-based Permissions**: Admin, Coordinator, and Volunteer roles

## 🛠 Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns library
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## 🔧 Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up the database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `database-schema.sql`
   - Run the SQL commands to create tables and policies

4. **Configure Authentication**:
   - In your Supabase dashboard, go to Authentication > Settings
   - Configure your site URL and redirect URLs
   - Enable email authentication or configure other providers

## 🚀 Running the Application

1. **Start the development server**:
```bash
npm run dev
```

2. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - The application will be running with hot reload

## 👤 User Roles

The application supports three user roles:

- **Admin**: Full access to all features and user management
- **Coordinator**: Can manage shifts, volunteers, and locations
- **Volunteer**: Can view schedules and update own profile

## 📱 Key Components

### Calendar View
- Weekly calendar grid with Hebrew day names (א-ש)
- Click-to-edit functionality for coordinators/admins
- Mobile patrol indicators
- Volunteer assignment cards with locations and times

### Volunteer Management
- Comprehensive volunteer listing
- Role management and senior volunteer designation
- Contact information and statistics

### Shift Management
- Create and manage shifts
- Assign multiple volunteers per shift
- Mobile patrol tracking
- Conflict detection

### Location Management
- Configure shift locations
- Active/inactive status management
- Location descriptions and details

## 🔒 Security Features

- Row Level Security (RLS) policies in Supabase
- Role-based access control
- Input validation and sanitization
- Secure authentication flow

## 📊 Database Schema

The application uses four main tables:
- `profiles`: User profiles extending Supabase auth
- `locations`: Shift locations
- `shifts`: Shift schedules
- `shift_assignments`: Volunteer assignments to shifts

## 🎨 UI/UX Features

- Modern, clean interface with Tailwind CSS
- Responsive design for all device sizes
- Loading states and error handling
- Toast notifications for user feedback
- Consistent color coding and iconography

## 🧪 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Code Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── pages/          # Page components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Netlify: Similar to Vercel with environment variables
- Traditional hosting: Build with `npm run build` and serve the `dist` folder

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Customization
- Modify `src/constants/index.ts` for application settings
- Update `tailwind.config.js` for styling customization
- Edit database schema in `database-schema.sql` for data structure changes

## 📞 Support

For issues or questions:
1. Check the Supabase documentation for backend-related issues
2. Review the React/TypeScript documentation for frontend issues
3. Ensure all environment variables are correctly set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is for volunteer organization use. Modify and distribute as needed for non-commercial volunteer management purposes. 