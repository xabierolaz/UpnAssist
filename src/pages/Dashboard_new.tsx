import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  UserGroupIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { calendarGeneratorService, type CalendarSyncStatus } from '../services/CalendarGeneratorService';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarStatus, setCalendarStatus] = useState<CalendarSyncStatus>({
    isGenerated: false,
    lastGenerated: null,
    eventsCount: 0,
    calendarUrl: null
  });
  const [showCalendarInstructions, setShowCalendarInstructions] = useState<boolean>(false);

  // Tipos para las clases
  type Subject = 'Programación I' | 'Estructuras de Datos' | 'Bases de Datos' | string;
  
  interface ClassInfo {
    id: string;
    subject: Subject;
    time: string;
    location: string;
    students: number;
    dayOfWeek: number; // 1-7 (Lunes-Domingo)
    description?: string;
  }

  // Configuración de colores por asignatura
  const subjectColors: Record<string, string> = {
    'Programación I': 'bg-blue-500',
    'Estructuras de Datos': 'bg-green-500',
    'Bases de Datos': 'bg-purple-500',
  };
  
  // Función para obtener color de asignatura
  const getSubjectColor = (subject: string): string => {
    return subjectColors[subject] || 'bg-orange-500';
  };

  // Horario semanal de ejemplo
  const weeklySchedule: ClassInfo[] = [
    {
      id: '1',
      subject: 'Programación I',
      time: '09:00',
      location: 'Aula 101',
      students: 25,
      dayOfWeek: 1 // Lunes
    },
    {
      id: '2',
      subject: 'Bases de Datos',
      time: '11:00',
      location: 'Aula 102',
      students: 30,
      dayOfWeek: 2 // Martes
    },
    {
      id: '3',
      subject: 'Estructuras de Datos',
      time: '14:00',
      location: 'Lab 201',
      students: 20,
      dayOfWeek: 3 // Miércoles
    },
    {
      id: '4',
      subject: 'Programación I',
      time: '16:00',
      location: 'Aula 103',
      students: 28,
      dayOfWeek: 4 // Jueves
    },
    {
      id: '5',
      subject: 'Bases de Datos',
      time: '10:00',
      location: 'Lab 202',
      students: 22,
      dayOfWeek: 5 // Viernes
    },
    {
      id: '6',
      subject: 'Estructuras de Datos',
      time: '09:00',
      location: 'Aula 104',
      students: 26,
      dayOfWeek: 6 // Sábado
    }
  ];

  // Función para generar calendario
  const handleGenerateCalendar = async () => {
    try {
      const status = calendarGeneratorService.generateMainCalendar();
      setCalendarStatus(status);
      setShowCalendarInstructions(true);
    } catch (error) {
      console.error('Error al generar calendario:', error);
    }
  };

  // Función para copiar enlace del calendario
  const handleCopyCalendarLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('¡Enlace copiado al portapapeles!');
    } catch (error) {
      console.error('Error al copiar enlace:', error);
    }
  };

  // Función para descargar archivo .ics
  const handleDownloadICS = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upn-calendario-academico.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Cargar estado del calendario al inicializar
  useEffect(() => {
    const savedStatus = localStorage.getItem('upn-calendar-status');
    if (savedStatus) {
      setCalendarStatus(JSON.parse(savedStatus));
    }
  }, []);

  // Función para navegar entre meses
  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Función para verificar si dos fechas son iguales
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  // Función para obtener clases del día seleccionado
  const getClassesForDate = (date: Date): ClassInfo[] => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convertir domingo (0) a 7
    return weeklySchedule.filter(cls => cls.dayOfWeek === dayOfWeek);
  };

  // Función para renderizar el calendario
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const emptyDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      emptyDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    const monthDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const hasClasses = getClassesForDate(currentDate).length > 0;
      const isSelected = isSameDay(currentDate, selectedDate);
      const isToday = isSameDay(currentDate, new Date());

      monthDays.push(
        <div
          key={day}
          className={`p-2 cursor-pointer rounded-lg text-center ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : isToday 
                ? 'bg-blue-100 text-blue-800' 
                : hasClasses 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedDate(currentDate)}
        >
          <div className="text-sm font-medium">{day}</div>
          {hasClasses && <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {emptyDays}
          {monthDays}
        </div>
      </div>
    );
  };

  const selectedDateClasses = getClassesForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Académico</h2>
            <p className="text-gray-600">
              Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Botón de generar calendario */}
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={handleGenerateCalendar}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Generar Calendario
            </button>
            
            {calendarStatus.isGenerated && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Calendario generado ({calendarStatus.eventsCount} eventos)
              </div>
            )}
          </div>
        </div>

        {/* Instrucciones del calendario */}
        {showCalendarInstructions && calendarStatus.calendarUrl && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-900">
                📅 Calendario UPN Generado
              </h3>
              <button
                onClick={() => setShowCalendarInstructions(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-blue-800">
                Tu calendario académico está listo. Puedes suscribirte o descargarlo:
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopyCalendarLink(calendarStatus.calendarUrl!)}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                  Copiar Enlace
                </button>
                
                <button
                  onClick={() => handleDownloadICS(calendarStatus.calendarUrl!)}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Descargar .ics
                </button>
                
                <a
                  href={calendarStatus.calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Abrir Calendario
                </a>
              </div>
              
              <div className="text-sm text-blue-700">
                <p><strong>Uso:</strong> Copia el enlace y agrégalo a Google Calendar, Outlook o Apple Calendar como "Suscripción a calendario web"</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          {renderCalendar()}
        </div>

        {/* Clases del día seleccionado */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Clases del día
            </h3>
            
            {selectedDateClasses.length > 0 ? (
              <div className="space-y-3">
                {selectedDateClasses.map(classInfo => (
                  <div
                    key={classInfo.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full ${getSubjectColor(classInfo.subject)}`}></div>
                      <span className="text-sm text-gray-500">{classInfo.time}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {classInfo.subject}
                    </h4>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {classInfo.location}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {classInfo.students} estudiantes
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        2 horas académicas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay clases programadas para este día</p>
              </div>
            )}
          </div>

          {/* Resumen semanal */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen Semanal
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total clases:</span>
                <span className="font-semibold">{weeklySchedule.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Horas académicas:</span>
                <span className="font-semibold">{weeklySchedule.length * 2}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Asignaturas:</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
