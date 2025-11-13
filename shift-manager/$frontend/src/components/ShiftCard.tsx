import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ShiftProps {
  shift: {
    id: string;
    date: string;
    time: string;
    location: string;
    has_patrol: boolean;
    notes?: string;
    registrations?: any[];
  };
  isRegistered?: boolean;
  onRegister?: () => void;
}

const ShiftCard: React.FC<ShiftProps> = ({ shift, isRegistered = false, onRegister }) => {
  const { isAdmin } = useAuth();
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get registration count
  const registrationCount = shift.registrations?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{formatDate(shift.date)}</h3>
            <p className="text-gray-600 mt-1">
              <span className={`inline-block px-2 py-1 rounded text-xs mr-2 ${
                shift.time === 'Morning' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {shift.time}
              </span>
              <span className="text-sm">{shift.location}</span>
            </p>
          </div>
          
          {shift.has_patrol && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              With Patrol
            </span>
          )}
        </div>
        
        {shift.notes && (
          <p className="text-gray-600 text-sm mt-2">
            {shift.notes}
          </p>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {isAdmin && (
              <span>{registrationCount} volunteer{registrationCount !== 1 ? 's' : ''} registered</span>
            )}
          </div>
          
          <div className="space-x-2">
            {isRegistered ? (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-sm rounded-md">
                Registered
              </span>
            ) : (
              <button
                onClick={onRegister}
                disabled={!onRegister}
                className={`px-3 py-1 text-sm rounded-md ${
                  onRegister 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Register
              </button>
            )}
            
            <Link 
              to={`/shifts/${shift.id}`} 
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftCard; 