// Tipos para el sistema de aplicaciones
export interface Application {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Heroicon component
  category: AppCategory;
  color: string;
  isActive: boolean;
  route?: string;
  action?: () => void;
  badge?: string | number;
}

export type AppCategory = 
  | 'academico'      // Dashboard, Calendario, Horarios
  | 'comunicacion'   // Chat, Email, Notificaciones
  | 'gestion'        // Estudiantes, Recursos, Configuración
  | 'herramientas'   // Calculadora, Notas, Detector de Copias, Utilidades
  | 'sistema';       // Configuración, Ayuda, Logout

export interface AppCategoryInfo {
  id: AppCategory;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}
