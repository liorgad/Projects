import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  MapPin, 
  Plus, 
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Building
} from 'lucide-react';
import { locationService } from '@/services/supabase';
import type { Location } from '@/types';

export const LocationsPage: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await locationService.getAllLocations();
      
      if (error) {
        console.error('Error loading locations:', error);
        return;
      }

      setLocations(data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageLocations = user?.role === 'admin' || user?.role === 'coordinator';

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
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">
            Manage volunteer shift locations
          </p>
        </div>
        {canManageLocations && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search locations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Locations Grid */}
      {filteredLocations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No locations found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No locations match your search criteria.' : 'Get started by adding your first location.'}
          </p>
          {canManageLocations && !searchTerm && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {location.name}
                      </h3>
                      {location.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {location.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          location.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {canManageLocations && (
                    <div className="flex-shrink-0 ml-2">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {canManageLocations && (
                  <div className="mt-6 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {locations.length}
            </div>
            <div className="text-sm text-gray-600">Total Locations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {locations.filter(l => l.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Locations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {locations.filter(l => !l.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Inactive Locations</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 