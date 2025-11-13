import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Users,
  MapPin
} from 'lucide-react';
import { 
  getWeekDays, 
  getNextWeek, 
  getPreviousWeek,
  formatDate,
  getHebrewDayName,
  dateToISOString,
  isDateToday
} from '@/utils';
import { shiftService } from '@/services/supabase';
import type { Shift } from '@/types';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const days = getWeekDays(currentWeek);
    setWeekDays(days);
    loadShifts(days[0], days[6]);
  }, [currentWeek]);

  const loadShifts = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      const { data, error } = await shiftService.getShiftsByDateRange(
        dateToISOString(startDate),
        dateToISOString(endDate)
      );

      if (error) {
        console.error('Error loading shifts:', error);
        return;
      }

      setShifts(data || []);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(getPreviousWeek(currentWeek));
  };

  const goToNextWeek = () => {
    setCurrentWeek(getNextWeek(currentWeek));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const getShiftForDate = (date: Date) => {
    const dateStr = dateToISOString(date);
    return shifts.find(shift => shift.date === dateStr);
  };

  const canManageShifts = user?.role === 'admin' || user?.role === 'coordinator';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Calendar</h1>
          <p className="text-gray-600">
            Manage volunteer shifts and assignments
          </p>
        </div>
        {canManageShifts && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Shift
          </Button>
        )}
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousWeek}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {formatDate(weekDays[0], 'MMM d')} - {formatDate(weekDays[6], 'MMM d, yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentWeek}
          >
            Today
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextWeek}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Week Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 text-center border-r last:border-r-0">
                <div className="text-sm font-medium text-gray-900">
                  {getHebrewDayName(day)}
                </div>
                <div className={`text-2xl font-bold mt-1 ${
                  isDateToday(day) 
                    ? 'text-primary' 
                    : 'text-gray-700'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Week Content */}
          <div className="grid grid-cols-7 min-h-96">
            {weekDays.map((day, index) => {
              const shift = getShiftForDate(day);
              const isToday = isDateToday(day);
              
              return (
                <div 
                  key={index} 
                  className={`p-4 border-r last:border-r-0 ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                >
                  {shift ? (
                    <div className="space-y-2">
                      {/* Mobile Patrol Indicator */}
                      {shift.has_mobile_patrol && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Mobile Patrol
                        </div>
                      )}
                      
                      {/* Volunteer Assignments */}
                      <div className="space-y-1">
                        {shift.assignments && shift.assignments.length > 0 ? (
                          shift.assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="p-2 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              <div className="font-medium">
                                {assignment.volunteer?.full_name}
                              </div>
                              {assignment.location && (
                                <div className="flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {assignment.location.name}
                                </div>
                              )}
                              {assignment.start_time && assignment.end_time && (
                                <div className="text-xs text-blue-600 mt-1">
                                  {assignment.start_time} - {assignment.end_time}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500 italic">
                            No volunteers assigned
                          </div>
                        )}
                      </div>

                      {/* Shift Notes */}
                      {shift.notes && (
                        <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                          {shift.notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    canManageShifts && (
                      <button
                        className="w-full h-full min-h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
                        onClick={() => {
                          // TODO: Open create shift modal
                          console.log('Create shift for', day);
                        }}
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Week Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {shifts.length}
            </div>
            <div className="text-sm text-gray-600">Total Shifts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {shifts.reduce((acc, shift) => acc + (shift.assignments?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Volunteers Assigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {shifts.filter(shift => shift.has_mobile_patrol).length}
            </div>
            <div className="text-sm text-gray-600">Mobile Patrols</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 