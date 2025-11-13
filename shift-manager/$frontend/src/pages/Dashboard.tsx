import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ShiftCard from '../components/ShiftCard';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Fetch shifts and user registrations
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all shifts
        const shiftsData = await api.getShifts();
        setShifts(shiftsData);
        
        // Fetch user registrations
        const registrationsData = await api.getMyRegistrations();
        setMyRegistrations(registrationsData);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Check if user is registered for a shift
  const isRegisteredForShift = (shiftId: string) => {
    return myRegistrations.some(reg => 
      reg.shift_id === shiftId && 
      ['Pending', 'Confirmed'].includes(reg.status)
    );
  };

  // Handle registration for a shift
  const handleRegister = async (shiftId: string) => {
    try {
      await api.registerForShift(shiftId);
      
      // Refresh registrations
      const registrationsData = await api.getMyRegistrations();
      setMyRegistrations(registrationsData);
      
      alert('You have successfully registered for this shift!');
    } catch (err: any) {
      alert(`Failed to register: ${err.message}`);
    }
  };

  // Group shifts by date
  const groupShiftsByDate = (shifts: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    shifts.forEach(shift => {
      const dateKey = shift.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(shift);
    });
    
    return groups;
  };

  const shiftsByDate = groupShiftsByDate(shifts);
  const dates = Object.keys(shiftsByDate).sort();

  // Filter shifts to upcoming only
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingDates = dates.filter(date => new Date(date) >= today);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Shifts</h1>
          {isAdmin && (
            <button
              onClick={() => navigate('/shifts/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Shift
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!isLoading && !error && upcomingDates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming shifts available.</p>
          </div>
        )}
        
        {!isLoading && !error && upcomingDates.map(date => (
          <div key={date} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              {new Date(date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shiftsByDate[date].map(shift => (
                <ShiftCard 
                  key={shift.id}
                  shift={shift}
                  isRegistered={isRegisteredForShift(shift.id)}
                  onRegister={() => handleRegister(shift.id)}
                />
              ))}
            </div>
          </div>
        ))}
        
        {!isLoading && myRegistrations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Registrations</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {myRegistrations.map(registration => (
                  <li key={registration.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {registration.shifts?.date && new Date(registration.shifts.date).toLocaleDateString()} - {registration.shifts?.time}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${registration.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              registration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {registration.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {registration.shifts?.location}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          {registration.status === 'Pending' && (
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to cancel this registration?')) {
                                  try {
                                    await api.cancelRegistration(registration.id);
                                    // Refresh registrations
                                    const registrationsData = await api.getMyRegistrations();
                                    setMyRegistrations(registrationsData);
                                  } catch (err: any) {
                                    alert(`Failed to cancel: ${err.message}`);
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 