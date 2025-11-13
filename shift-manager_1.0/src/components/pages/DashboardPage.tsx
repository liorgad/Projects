import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Shield, 
  Plus,
  ChevronRight,
  Clock
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { shiftService, profileService, locationService } from '@/services/supabase';
import { formatDate, getWeekDays, dateToISOString } from '@/utils';

interface DashboardStats {
  totalVolunteers: number;
  activeLocations: number;
  upcomingShifts: number;
  myUpcomingShifts: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVolunteers: 0,
    activeLocations: 0,
    upcomingShifts: 0,
    myUpcomingShifts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current week for upcoming shifts
      const weekDays = getWeekDays(new Date());
      const startDate = dateToISOString(weekDays[0]);
      const endDate = dateToISOString(weekDays[6]);

      const [volunteersResult, locationsResult, shiftsResult] = await Promise.all([
        profileService.getAllProfiles(),
        locationService.getAllLocations(),
        shiftService.getShiftsByDateRange(startDate, endDate),
      ]);

      const volunteers = volunteersResult.data || [];
      const locations = locationsResult.data || [];
      const shifts = shiftsResult.data || [];

      // Calculate stats
      const totalVolunteers = volunteers.length;
      const activeLocations = locations.filter(loc => loc.is_active).length;
      const upcomingShifts = shifts.filter(shift => new Date(shift.date) >= new Date()).length;
      
      // Calculate user's upcoming shifts
      const myUpcomingShifts = shifts.filter(shift => 
        new Date(shift.date) >= new Date() && 
        shift.assignments?.some(assignment => assignment.volunteer_id === user?.id)
      ).length;

      setStats({
        totalVolunteers,
        activeLocations,
        upcomingShifts,
        myUpcomingShifts,
      });

      // Set upcoming shifts for display
      const upcoming = shifts
        .filter(shift => new Date(shift.date) >= new Date())
        .slice(0, 5);
      setUpcomingShifts(upcoming);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Volunteers',
      value: stats.totalVolunteers,
      icon: Users,
      color: 'bg-blue-500',
      link: ROUTES.VOLUNTEERS,
    },
    {
      title: 'Active Locations',
      value: stats.activeLocations,
      icon: MapPin,
      color: 'bg-green-500',
      link: ROUTES.LOCATIONS,
    },
    {
      title: 'Upcoming Shifts',
      value: stats.upcomingShifts,
      icon: Calendar,
      color: 'bg-purple-500',
      link: ROUTES.CALENDAR,
    },
    {
      title: 'My Shifts',
      value: stats.myUpcomingShifts,
      icon: Shield,
      color: 'bg-orange-500',
      link: ROUTES.CALENDAR,
    },
  ];

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with volunteer shifts today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to={ROUTES.CALENDAR}>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Upcoming Shifts</h2>
              <Link
                to={ROUTES.CALENDAR}
                className="text-sm text-primary hover:text-primary/80 flex items-center"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingShifts.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming shifts scheduled.</p>
              ) : (
                upcomingShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(shift.date, 'EEEE, MMM d')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {shift.assignments?.length || 0} volunteers assigned
                        </p>
                      </div>
                    </div>
                    {shift.has_mobile_patrol && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Mobile Patrol
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to={ROUTES.CALENDAR}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Shift
                </Button>
              </Link>
              <Link to={ROUTES.VOLUNTEERS}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Volunteers
                </Button>
              </Link>
              <Link to={ROUTES.LOCATIONS}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Locations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 