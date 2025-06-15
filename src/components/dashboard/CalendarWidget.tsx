import React from 'react';
import { 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface ClassInfo {
  id: string;
  subject: string;
  time: string;
  location: string;
  students: number;
  dayOfWeek: number;
  description?: string;
}

interface CalendarWidgetProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  classes: ClassInfo[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  classes
}) => {
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Lunes = 0
    
    const days: Date[] = [];
    
    // Días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, 0 - i);
      days.push(day);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    return days;
  };

  const getClassesForDay = (date: Date): ClassInfo[] => {
    const dayOfWeek = (date.getDay() + 6) % 7 + 1; // Convertir a formato 1-7 (Lunes-Domingo)
    return classes.filter(classInfo => classInfo.dayOfWeek === dayOfWeek);
  };

  const getDayClasses = (date: Date): string => {
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const hasClasses = getClassesForDay(date).length > 0;

    let classes = 'h-12 w-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative ';
    
    if (!isCurrentMonth) {
      classes += 'text-gray-400 hover:bg-gray-100 ';
    } else if (isSelected) {
      classes += 'bg-blue-600 text-white hover:bg-blue-700 ';
    } else if (isToday) {
      classes += 'bg-blue-100 text-blue-600 hover:bg-blue-200 ';
    } else {
      classes += 'text-gray-700 hover:bg-gray-100 ';
    }

    if (hasClasses && isCurrentMonth && !isSelected) {
      classes += 'ring-2 ring-blue-300 ';
    }

    return classes;
  };

  const days = getDaysInMonth(currentMonth);
  const selectedDayClasses = getClassesForDay(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
          Mi Calendario
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-800 min-w-[120px] text-center">
            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendario */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={getDayClasses(day)}
            >
              <span className="text-sm font-medium">{day.getDate()}</span>
              {getClassesForDay(day).length > 0 && day.getMonth() === currentMonth.getMonth() && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clases del día seleccionado */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">
          {formatDate(selectedDate)}
        </h3>
        {selectedDayClasses.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay clases programadas</p>
        ) : (
          <div className="space-y-3">
            {selectedDayClasses.map((classInfo) => (
              <div key={classInfo.id} className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-1">{classInfo.subject}</h4>
                <div className="flex items-center text-sm text-blue-700 mb-1">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {classInfo.time}
                </div>
                <div className="flex items-center text-sm text-blue-700 mb-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {classInfo.location}
                </div>
                <div className="flex items-center text-sm text-blue-700">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {classInfo.students} estudiantes
                </div>
                {classInfo.description && (
                  <p className="text-sm text-blue-600 mt-2">{classInfo.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;
