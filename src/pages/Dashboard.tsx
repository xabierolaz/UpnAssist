import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'error' | 'syncing'>('synced');
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Tipos para las clases - 3 asignaturas, 6 clases semanales (2 horas cada día)
  type Subject = 'Programación I' | 'Estructuras de Datos' | 'Bases de Datos';
  
  interface ClassInfo {
    id: string;
    subject: Subject;
    time: string;
    location: string;
    students: number;
    dayOfWeek: number; // 1-7 (Lunes-Domingo)
  }

  // Configuración de colores por asignatura
  const subjectColors = {
    'Programación I': 'bg-blue-500',
    'Estructuras de Datos': 'bg-green-500',
    'Bases de Datos': 'bg-purple-500'
  };

  // Horario semanal: 6 clases (Lunes a Sábado, 2 horas cada día, una asignatura por día)
  const weeklySchedule: ClassInfo[] = [
    // Lunes - Programación I
    { id: '1', subject: 'Programación I', time: '08:00', location: 'A-329 Aulario', students: 45, dayOfWeek: 1 },
    // Martes - Estructuras de Datos  
    { id: '2', subject: 'Estructuras de Datos', time: '10:00', location: 'E-201 Los Encinas', students: 38, dayOfWeek: 2 },
    // Miércoles - Bases de Datos
    { id: '3', subject: 'Bases de Datos', time: '09:00', location: 'P-103 Los Pinos', students: 42, dayOfWeek: 3 },
    // Jueves - Programación I
    { id: '4', subject: 'Programación I', time: '14:00', location: 'A-329 Aulario', students: 45, dayOfWeek: 4 },
    // Viernes - Estructuras de Datos
    { id: '5', subject: 'Estructuras de Datos', time: '11:00', location: 'E-201 Los Encinas', students: 38, dayOfWeek: 5 },
    // Sábado - Bases de Datos
    { id: '6', subject: 'Bases de Datos', time: '08:00', location: 'P-103 Los Pinos', students: 42, dayOfWeek: 6 }
  ];

  // Función para sincronizar con Google Calendar
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    // Simular sincronización
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
      setLastSync(new Date());
    }, 2000);
  };

  // Auto sync cada 5 minutos (simulado)
  useEffect(() => {
    const interval = setInterval(() => {
      if (syncStatus === 'synced') {
        // Simular pérdida ocasional de sincronización
        if (Math.random() < 0.1) {
          setSyncStatus('error');
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [syncStatus]);

  const getSyncStatusInfo = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600',
          bg: 'bg-green-100',
          text: 'Sincronizado',
          buttonColor: 'bg-green-500 hover:bg-green-600'
        };
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-red-600',
          bg: 'bg-red-100',
          text: 'Error de sincronización',
          buttonColor: 'bg-red-500 hover:bg-red-600'
        };
      case 'syncing':
        return {
          icon: ArrowPathIcon,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          text: 'Sincronizando...',
          buttonColor: 'bg-yellow-500'
        };
    }
  };

  const syncInfo = getSyncStatusInfo();

  // Funciones del calendario
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getClassesForDate = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    return weeklySchedule.filter(cls => cls.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Header del calendario
    days.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );

    // Días vacíos al inicio
    const emptyDays = [];
    for (let i = 0; i < firstDay; i++) {
      emptyDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Días del mes
    const monthDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const classes = getClassesForDate(currentDate);
      const isSelected = isSameDay(currentDate, selectedDate);
      const isTodayDate = isToday(currentDate);

      monthDays.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 min-h-[80px] cursor-pointer border border-gray-200 rounded-lg transition-all hover:bg-gray-50 ${
            isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''
          } ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}`}
        >
          <div className={`text-sm font-medium mb-2 ${
            isTodayDate ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`text-xs text-white px-1 py-0.5 rounded ${subjectColors[cls.subject]} truncate`}
                title={`${cls.subject} - ${cls.time} - ${cls.location}`}
              >
                <div className="font-medium">{cls.time}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    days.push(
      <div key="calendar-grid" className="grid grid-cols-7 gap-1">
        {emptyDays}
        {monthDays}
      </div>
    );

    return days;
  };

  const selectedDateClasses = getClassesForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido a UpnAssist - Portal del Profesorado
        </p>
      </div>

      {/* Calendar and Classes Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Calendar */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />
                Calendario Académico
              </h3>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${syncInfo.bg} ${syncInfo.color}`}>
                  <syncInfo.icon className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                  {syncInfo.text}
                </span>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white ${syncInfo.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </button>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <h4 className="text-xl font-semibold text-gray-900">
                {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h4>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-container">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Asignaturas (6 clases semanales):</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(subjectColors).map(([subject, color]) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-sm ${color}`}></div>
                        <span className="text-sm text-gray-600">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Última sincronización:
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    {lastSync.toLocaleString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Classes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Clases del {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </h3>
            
            {selectedDateClasses.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay clases programadas para este día</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateClasses.map((clase) => (
                  <div key={clase.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full ${subjectColors[clase.subject]} mt-1`}></div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{clase.subject}</h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            {clase.time}:00 - {(parseInt(clase.time.split(':')[0]) + 2).toString().padStart(2, '0')}:00 (2 horas)
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {clase.location}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <UserGroupIcon className="h-4 w-4 mr-2" />
                            {clase.students} estudiantes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
