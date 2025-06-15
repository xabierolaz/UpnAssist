import React, { useEffect } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  ChevronLeftIcon,  ChevronRightIcon,
  UserGroupIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  Squares2X2Icon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
// import { calendarGeneratorService } from '../services/CalendarGeneratorService'; // Will be used later
import { useDashboardStore } from '../stores/dashboardStore';
// import { useAppStore } from '../stores/appStore'; // Will be used later
import ApplicationLauncher from './ApplicationLauncher';
import Resources from './Resources';
import Chat from './Chat';
import Help from './Help';
// import CalendarWidget from '../components/dashboard/CalendarWidget'; // Will be used later
import QuickActions from '../components/dashboard/QuickActions';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  // Use Zustand stores instead of local state
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    calendarStatus,
    setCalendarStatus,
    showCalendarInstructions,
    setShowCalendarInstructions,
    showAppsModal,
    setShowAppsModal,
    showChatModal,
    setShowChatModal,
    showHelpModal,
    setShowHelpModal
  } = useDashboardStore();

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
  /* COMMENTED OUT - Will be used later
  const handleGenerateCalendar = async () => {
    try {
      const status = calendarGeneratorService.generateMainCalendar();
      setCalendarStatus(status);
      setShowCalendarInstructions(true);
    } catch (error) {
      console.error('Error al generar calendario:', error);
    }
  };
  */

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
  // Función para abrir correo institucional
  /* COMMENTED OUT - Will be used later
  const handleOpenEmail = () => {
    window.open('https://webmail.unavarra.es', '_blank');
  };
  */

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

  const selectedDateClasses = getClassesForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout horizontal principal - Optimizado para pantallas panorámicas */}
      <div className="flex h-screen">
        
        {/* Menú lateral único - Fusión de Herramientas y Accesos Rápidos */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 UPN Dashboard</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {selectedDate.toLocaleDateString('es-ES', { 
                  weekday: 'short', 
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>          {/* Menú lateral fusionado */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Quick Actions Section with Error Boundary */}
            <ErrorBoundary>
              <QuickActions 
                onOpenApps={() => setShowAppsModal(true)}
                onOpenChat={() => setShowChatModal(true)}
                onOpenHelp={() => setShowHelpModal(true)}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Área principal de contenido */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Instrucciones del calendario flotantes */}
          {showCalendarInstructions && calendarStatus.calendarUrl && (
            <div className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                    href={calendarStatus.calendarUrl || '#'}
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
            {/* Layout principal - Optimizado para pantallas panorámicas 19:6 */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 2xl:grid-cols-20 xl:grid-cols-16 lg:grid-cols-12 gap-6">
              
              {/* Calendario Central - Ocupando la mayor parte del ancho */}
              <div className="2xl:col-span-14 xl:col-span-11 lg:col-span-8 order-1 lg:order-2">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-semibold text-gray-900">
                      📅 {(() => {
                        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                        return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
                      })()}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRightIcon className="h-6 w-6 text-gray-600" />
                      </button>
                    </div>
                  </div>                  {/* Grid del calendario optimizado para pantallas panorámicas */}
                  <div className="grid grid-cols-7 gap-4 mb-6">
                    {(() => {
                      const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                      return dayNames.map(day => (
                        <div key={day} className="p-4 text-center text-lg font-semibold text-gray-500 bg-gray-50 rounded-lg">
                          {day}
                        </div>
                      ));
                    })()}
                  </div>

                  <div className="grid grid-cols-7 gap-4">
                    {(() => {
                      const year = currentMonth.getFullYear();
                      const month = currentMonth.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const lastDay = new Date(year, month + 1, 0);
                      const daysInMonth = lastDay.getDate();
                      // Ajustar para que lunes sea día 0 (España): domingo = 6, lunes = 0
                      const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

                      const allDays = [];

                      // Días vacíos del mes anterior
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        allDays.push(
                          <div key={`empty-${i}`} className="p-6 h-24"></div>
                        );
                      }

                      // Días del mes actual
                      for (let day = 1; day <= daysInMonth; day++) {
                        const currentDate = new Date(year, month, day);
                        const classesForDay = getClassesForDate(currentDate);
                        const hasClasses = classesForDay.length > 0;
                        const isSelected = isSameDay(currentDate, selectedDate);
                        const isToday = isSameDay(currentDate, new Date());

                        allDays.push(
                          <div
                            key={day}
                            className={`p-6 h-24 cursor-pointer rounded-lg text-center transition-all hover:scale-105 relative ${
                              isSelected 
                                ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
                                : isToday 
                                  ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' 
                                  : hasClasses 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300' 
                                    : 'hover:bg-gray-100 border border-gray-200'
                            }`}
                            onClick={() => setSelectedDate(currentDate)}
                          >
                            <div className="text-2xl font-semibold">{day}</div>
                            {hasClasses && (
                              <div className="flex justify-center mt-2 space-x-1">
                                {classesForDay.slice(0, 3).map((cls, idx) => (
                                  <div key={idx} className={`w-2 h-2 rounded-full ${getSubjectColor(cls.subject)}`}></div>
                                ))}
                                {classesForDay.length > 3 && (
                                  <div className="text-xs font-bold">+{classesForDay.length - 3}</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return allDays;
                    })()}
                  </div>
                  
                  {/* Información del día seleccionado debajo del calendario */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <p className="text-base text-gray-600 text-center">
                      <strong>Día seleccionado:</strong> {selectedDate.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {getClassesForDate(selectedDate).length > 0 && (
                      <p className="text-base text-green-600 text-center mt-2">
                        {getClassesForDate(selectedDate).length} clase(s) programada(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel lateral derecho - Agenda y Próximas Clases */}
              <div className="2xl:col-span-6 xl:col-span-5 lg:col-span-4 order-2 lg:order-1 space-y-6">
                {/* Clases del día */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-blue-600" />
                    Agenda del Día
                  </h3>            
            {selectedDateClasses.length > 0 ? (
              <div className="space-y-3">
                {selectedDateClasses.map(classInfo => (
                  <div
                    key={classInfo.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-3 h-3 rounded-full ${getSubjectColor(classInfo.subject)}`}></div>
                      <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">{classInfo.time}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {classInfo.subject}
                    </h4>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {classInfo.location}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {classInfo.students} estudiantes
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        2 horas académicas
                      </div>
                    </div>
                    
                    {/* Progreso de la clase */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso del día</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No hay clases programadas</p>
                <p className="text-gray-400 text-xs mt-1">para este día</p>
              </div>
            )}
          </div>

          {/* Próximas clases */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-3 text-indigo-600" />
              Próximas Clases
            </h3>
            <div className="space-y-3">
              {weeklySchedule.slice(0, 3).map((classInfo) => {
                const dayNames = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                return (
                  <div key={classInfo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getSubjectColor(classInfo.subject)}`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{classInfo.subject}</div>
                        <div className="text-xs text-gray-500">
                          {dayNames[classInfo.dayOfWeek]} - {classInfo.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{classInfo.location}</div>
                  </div>
                );
              })}              {weeklySchedule.length > 3 && (
                <div className="text-center pt-2">
                  <span className="text-xs text-gray-500">
                    +{weeklySchedule.length - 3} clases más esta semana
                  </span>
                </div>              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Modales optimizados para Full HD */}
      {/* Modal de Aplicaciones */}
      {showAppsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-7xl xl:max-w-[95vw] w-full max-h-[95vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Squares2X2Icon className="h-8 w-8 mr-3 text-blue-600" />
                Aplicaciones y Recursos
              </h2>
              <button
                onClick={() => setShowAppsModal(false)}
                className="p-3 hover:bg-blue-200 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    🚀 <span className="ml-2">Aplicaciones Académicas</span>
                  </h3>
                  <ApplicationLauncher />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    📁 <span className="ml-2">Recursos Universitarios</span>
                  </h3>                  <Resources />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl xl:max-w-[90vw] w-full max-h-[95vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-green-100">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3 text-green-600" />
                Chat Académico
              </h2>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-3 hover:bg-green-200 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <Chat />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ayuda */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl xl:max-w-[90vw] w-full max-h-[95vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-purple-100">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <QuestionMarkCircleIcon className="h-8 w-8 mr-3 text-purple-600" />
                Centro de Ayuda
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-3 hover:bg-purple-200 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <Help />
            </div>
          </div>        </div>  )}    </div>  </div>
  </div>
  );
};

export default Dashboard;
