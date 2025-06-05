import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BookOpenIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  CalculatorIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  FolderIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

import type { Application, AppCategory, AppCategoryInfo } from '../types/applications';

// Definición de categorías
export const appCategories: { [key in AppCategory]: AppCategoryInfo } = {
  academico: {
    id: 'academico',
    name: 'Académico',
    description: 'Herramientas para la gestión académica',
    icon: AcademicCapIcon,
    color: 'bg-blue-500'
  },
  comunicacion: {
    id: 'comunicacion',
    name: 'Comunicación',
    description: 'Chat, email y notificaciones',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-green-500'
  },
  gestion: {
    id: 'gestion',
    name: 'Gestión',
    description: 'Administración de estudiantes y recursos',
    icon: UserGroupIcon,
    color: 'bg-purple-500'
  },
  herramientas: {
    id: 'herramientas',
    name: 'Herramientas',
    description: 'Utilidades y herramientas académicas',
    icon: WrenchScrewdriverIcon,
    color: 'bg-orange-500'
  },
  sistema: {
    id: 'sistema',
    name: 'Sistema',
    description: 'Configuración y ayuda',
    icon: CogIcon,
    color: 'bg-gray-500'
  }
};

// Definición de todas las aplicaciones disponibles
export const applications: Application[] = [
  // ACADÉMICO
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Vista general y calendario académico',
    icon: CalendarIcon,
    category: 'academico',
    color: 'bg-blue-500',
    isActive: true,
    route: '/dashboard'
  },
  {
    id: 'horarios',
    name: 'Horarios',
    description: 'Gestión de horarios y planificación',
    icon: ClockIcon,
    category: 'academico',
    color: 'bg-blue-600',
    isActive: false,
    route: '/schedules'
  },
  {
    id: 'estadisticas',
    name: 'Estadísticas',
    description: 'Análisis y reportes académicos',
    icon: ChartBarIcon,
    category: 'academico',
    color: 'bg-blue-700',
    isActive: false,
    route: '/statistics'
  },
  {
    id: 'presentaciones',
    name: 'Presentaciones',
    description: 'Gestión de presentaciones y material',
    icon: PresentationChartLineIcon,
    category: 'academico',
    color: 'bg-blue-800',
    isActive: false,
    route: '/presentations'  },

  // COMUNICACIÓN
  {
    id: 'chat',
    name: 'Chat Académico',
    description: 'Comunicación con estudiantes y colegas',
    icon: ChatBubbleLeftRightIcon,
    category: 'comunicacion',
    color: 'bg-green-500',
    isActive: true,
    route: '/chat',
    badge: 3
  },  {
    id: 'ai-assistant',
    name: 'AmaIA',
    description: 'Asistente inteligente sobre UpnAssist (Botón flotante)',
    icon: SparklesIcon,
    category: 'comunicacion',
    color: 'bg-purple-500',
    isActive: true,
    route: '/dashboard'
  },
  {
    id: 'email',
    name: 'Email UPN',
    description: 'Correo electrónico institucional',
    icon: EnvelopeIcon,
    category: 'comunicacion',
    color: 'bg-green-600',
    isActive: true,
    route: '/email',
    badge: 12
  },
  {
    id: 'notificaciones',
    name: 'Notificaciones',
    description: 'Alertas y recordatorios del sistema',
    icon: BellIcon,
    category: 'comunicacion',
    color: 'bg-green-700',
    isActive: false,
    route: '/notifications',
    badge: 5
  },

  // GESTIÓN
  {
    id: 'estudiantes',
    name: 'Gestión de Estudiantes',
    description: 'Administración de lista de estudiantes',
    icon: UserGroupIcon,
    category: 'gestion',
    color: 'bg-purple-500',
    isActive: false,
    route: '/students'
  },
  {
    id: 'recursos',
    name: 'Recursos Académicos',
    description: 'Biblioteca de recursos y materiales',
    icon: BookOpenIcon,
    category: 'gestion',
    color: 'bg-purple-600',
    isActive: true,
    route: '/resources'
  },
  {
    id: 'archivos',
    name: 'Gestión de Archivos',
    description: 'Organización de documentos y archivos',
    icon: FolderIcon,
    category: 'gestion',
    color: 'bg-purple-700',
    isActive: false,
    route: '/files'
  },

  // HERRAMIENTAS
  {
    id: 'detector-copias',
    name: 'Detector de Copias',
    description: 'Análisis de plagios en trabajos académicos',
    icon: DocumentDuplicateIcon,
    category: 'herramientas',
    color: 'bg-orange-500',
    isActive: true,
    route: '/plagiarism-detector'
  },
  {
    id: 'calculadora',
    name: 'Calculadora de Notas',
    description: 'Cálculo de promedios y calificaciones',
    icon: CalculatorIcon,
    category: 'herramientas',
    color: 'bg-orange-600',
    isActive: false,
    route: '/calculator'
  },
  {
    id: 'notas-rapidas',
    name: 'Notas Rápidas',
    description: 'Bloc de notas para apuntes rápidos',
    icon: DocumentTextIcon,
    category: 'herramientas',
    color: 'bg-orange-700',
    isActive: false,
    route: '/quick-notes'
  },
  {
    id: 'laboratorio-virtual',
    name: 'Laboratorio Virtual',
    description: 'Entorno de práctica para programación',
    icon: ComputerDesktopIcon,
    category: 'herramientas',
    color: 'bg-orange-800',
    isActive: false,
    route: '/virtual-lab'
  },

  // SISTEMA
  {
    id: 'guia-profesor',
    name: 'Guía del Profesor',
    description: 'Manual y recursos para profesores',
    icon: QuestionMarkCircleIcon,
    category: 'sistema',
    color: 'bg-gray-500',
    isActive: true,
    route: '/teacher-guide'
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    description: 'Ajustes del sistema y perfil',
    icon: CogIcon,
    category: 'sistema',
    color: 'bg-gray-600',
    isActive: false,
    route: '/settings'
  },
  {
    id: 'cerrar-sesion',
    name: 'Cerrar Sesión',
    description: 'Salir del sistema de forma segura',
    icon: ArrowRightOnRectangleIcon,
    category: 'sistema',
    color: 'bg-gray-700',
    isActive: true,
    action: () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Lógica de cierre de sesión
        // Logout logic would go here
      }
    }
  }
];

// Funciones de utilidad
export const getApplicationsByCategory = (category: AppCategory): Application[] => {
  return applications.filter(app => app.category === category);
};

export const getActiveApplications = (): Application[] => {
  return applications.filter(app => app.isActive);
};

export const getApplicationById = (id: string): Application | undefined => {
  return applications.find(app => app.id === id);
};
