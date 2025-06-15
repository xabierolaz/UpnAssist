import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
}

interface ApplicationState {
  id: string;
  name: string;
  status: 'available' | 'maintenance' | 'unavailable';
  lastUpdated: Date;
}

interface AppState {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Applications
  applications: Record<string, ApplicationState>;
  
  // System status
  systemStatus: {
    isOnline: boolean;
    lastUpdate: Date;
    maintenanceMode: boolean;
  };
  
  // Theme and UI
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  updateApplicationStatus: (appId: string, status: ApplicationState['status']) => void;
  
  setSystemStatus: (status: Partial<AppState['systemStatus']>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  
  // Computed
  getUnreadNotifications: () => Notification[];
  getRecentNotifications: (limit?: number) => Notification[];
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [
        {
          id: '1',
          title: 'Sistema Actualizado',
          message: 'Nueva versión del sistema académico disponible',
          type: 'success',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          title: 'Recordatorio',
          message: 'Entrega de proyecto final próxima semana',
          type: 'warning',
          timestamp: new Date(Date.now() - 3600000),
          read: false
        },
        {
          id: '3',
          title: 'Mantenimiento',
          message: 'Plataforma disponible 24/7',
          type: 'info',
          timestamp: new Date(Date.now() - 7200000),
          read: true
        }
      ],
      unreadCount: 2,
      
      applications: {
        'moodle': {
          id: 'moodle',
          name: 'Moodle UPN',
          status: 'available',
          lastUpdated: new Date()
        },
        'email': {
          id: 'email',
          name: 'Email Institucional',
          status: 'available',
          lastUpdated: new Date()
        },
        'biblioteca': {
          id: 'biblioteca',
          name: 'Biblioteca Digital',
          status: 'available',
          lastUpdated: new Date()
        }
      },
      
      systemStatus: {
        isOnline: true,
        lastUpdate: new Date(),
        maintenanceMode: false
      },
      
      theme: 'light',
      sidebarCollapsed: false,

      // Actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };
        
        set(
          (state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
          }),
          false,
          'app/addNotification'
        );
      },

      markNotificationRead: (id) => set(
        (state) => {
          const notifications = state.notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
          );
          const unreadCount = notifications.filter(n => !n.read).length;
          return { notifications, unreadCount };
        },
        false,
        'app/markNotificationRead'
      ),

      markAllNotificationsRead: () => set(
        (state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadCount: 0
        }),
        false,
        'app/markAllNotificationsRead'
      ),

      removeNotification: (id) => set(
        (state) => {
          const notifications = state.notifications.filter(notif => notif.id !== id);
          const unreadCount = notifications.filter(n => !n.read).length;
          return { notifications, unreadCount };
        },
        false,
        'app/removeNotification'
      ),

      clearNotifications: () => set({
        notifications: [],
        unreadCount: 0
      }, false, 'app/clearNotifications'),

      updateApplicationStatus: (appId, status) => set(
        (state) => ({
          applications: {
            ...state.applications,
            [appId]: {
              ...state.applications[appId],
              status,
              lastUpdated: new Date()
            }
          }
        }),
        false,
        'app/updateApplicationStatus'
      ),

      setSystemStatus: (status) => set(
        (state) => ({
          systemStatus: { ...state.systemStatus, ...status }
        }),
        false,
        'app/setSystemStatus'
      ),

      setTheme: (theme) => set({ theme }, false, 'app/setTheme'),

      toggleSidebar: () => set(
        (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
        false,
        'app/toggleSidebar'
      ),

      // Computed getters
      getUnreadNotifications: () => {
        return get().notifications.filter(n => !n.read);
      },

      getRecentNotifications: (limit = 5) => {
        return get().notifications
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'app-store',
    }
  )
);
