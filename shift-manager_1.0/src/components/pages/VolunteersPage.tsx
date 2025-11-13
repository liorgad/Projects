import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Users, 
  Plus, 
  Search,
  Phone,
  Mail,
  Shield,
  Edit,
  MoreVertical
} from 'lucide-react';
import { profileService } from '@/services/supabase';
import { formatPhoneNumber } from '@/utils';
import type { Profile } from '@/types';

export const VolunteersPage: React.FC = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const { data, error } = await profileService.getAllProfiles();
      
      if (error) {
        console.error('Error loading volunteers:', error);
        return;
      }

      setVolunteers(data || []);
    } catch (error) {
      console.error('Error loading volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageVolunteers = user?.role === 'admin' || user?.role === 'coordinator';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'coordinator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
          <p className="text-gray-600">
            Manage volunteer profiles and roles
          </p>
        </div>
        {canManageVolunteers && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Volunteer
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search volunteers..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="coordinator">Coordinator</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredVolunteers.length === 0 ? (
            <li className="p-6 text-center text-gray-500">
              No volunteers found matching your criteria.
            </li>
          ) : (
            filteredVolunteers.map((volunteer) => (
              <li key={volunteer.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {volunteer.full_name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(volunteer.role)}`}>
                          {volunteer.role}
                        </span>
                        {volunteer.is_senior_volunteer && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Senior
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        {volunteer.phone_number && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {formatPhoneNumber(volunteer.phone_number)}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          Joined {new Date(volunteer.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {canManageVolunteers && (
                      <>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {volunteers.length}
            </div>
            <div className="text-sm text-gray-600">Total Volunteers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {volunteers.filter(v => v.role === 'coordinator').length}
            </div>
            <div className="text-sm text-gray-600">Coordinators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {volunteers.filter(v => v.is_senior_volunteer).length}
            </div>
            <div className="text-sm text-gray-600">Senior Volunteers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {volunteers.filter(v => v.role === 'volunteer').length}
            </div>
            <div className="text-sm text-gray-600">Regular Volunteers</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 