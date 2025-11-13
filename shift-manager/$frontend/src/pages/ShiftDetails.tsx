import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const ShiftDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [shift, setShift] = useState<any | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);

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

  // Fetch shift data
  useEffect(() => {
    const fetchShift = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get shift details
        const shiftData = await api.getShiftById(id);
        setShift(shiftData);
        
        // Check user registrations to see if registered for this shift
        const myRegs = await api.getMyRegistrations();
        const registration = myRegs.find((reg: any) => reg.shift_id === id);
        
        if (registration) {
          setIsRegistered(true);
          setRegistrationStatus(registration.status);
        }
      } catch (err: any) {
        console.error('Error fetching shift:', err);
        setError('Failed to load shift details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShift();
  }, [id]);

  // Handle registration
  const handleRegister = async () => {
    if (!id) return;
    
    try {
      await api.registerForShift(id);
      setIsRegistered(true);
      setRegistrationStatus('Pending');
      alert('You have successfully registered for this shift!');
    } catch (err: any) {
      alert(`Failed to register: ${err.message}`);
    }
  };

  // Handle status update (admin only)
  const handleStatusUpdate = async (registrationId: string, status: string) => {
    try {
      await api.updateRegistrationStatus(registrationId, status);
      
      // Refresh shift data
      const shiftData = await api.getShiftById(id!);
      setShift(shiftData);
      
      alert(`Registration status updated to ${status}`);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Handle shift deletion (admin only)
  const handleDeleteShift = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this shift? This action cannot be undone.')) {
      try {
        await api.deleteShift(id);
        alert('Shift deleted successfully');
        navigate('/dashboard');
      } catch (err: any) {
        alert(`Failed to delete shift: ${err.message}`);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
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
        ) : shift ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formatDate(shift.date)}</h1>
                <div className="flex items-center mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs mr-2 ${
                    shift.time === 'Morning' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {shift.time}
                  </span>
                  <span className="text-gray-600">{shift.location}</span>
                  {shift.has_patrol && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      With Patrol
                    </span>
                  )}
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/shifts/${id}/edit`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteShift}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {shift.notes && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-gray-600">{shift.notes}</p>
                </div>
              </div>
            )}
            
            {!isRegistered ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Registration</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-gray-600 mb-4">Would you like to register for this shift?</p>
                  <button
                    onClick={handleRegister}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Register for this Shift
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Registration</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-gray-600">
                    You are registered for this shift. Current status: 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${registrationStatus === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        registrationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {registrationStatus}
                    </span>
                  </p>
                </div>
              </div>
            )}
            
            {isAdmin && shift.registrations && shift.registrations.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Volunteers ({shift.registrations.length})</h3>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {shift.registrations.map((reg: any) => (
                      <li key={reg.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">{reg.volunteers.name}</p>
                            <p className="text-sm text-gray-500">{reg.volunteers.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${reg.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                reg.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {reg.status}
                            </span>
                            <select
                              value={reg.status}
                              onChange={(e) => handleStatusUpdate(reg.id, e.target.value)}
                              className="ml-2 text-sm border-gray-300 rounded-md"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">Shift not found</p>
        )}
      </div>
    </Layout>
  );
};

export default ShiftDetails; 