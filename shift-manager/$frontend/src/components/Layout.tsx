import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-xl font-bold">
                  Shift Manager
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/profile')}`}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link 
                    to="/shifts/new" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/shifts/new')}`}
                  >
                    Create Shift
                  </Link>
                )}
              </div>
            </div>
            
            {/* User Menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center">
                <span className="mr-4 text-sm">{profile?.name}</span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              >
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link 
                  to="/shifts/new" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/shifts/new') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Shift
                </Link>
              )}
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-700 hover:bg-blue-800"
              >
                Sign Out ({profile?.name})
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Volunteer Shift Manager
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 