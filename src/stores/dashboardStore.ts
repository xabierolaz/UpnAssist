import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ClassInfo {
  id: string;
  subject: string;
  time: string;
  location: string;
  students: number;
  dayOfWeek: number;
  description?: string;
}

interface CalendarSyncStatus {
  isGenerated: boolean;
  lastGenerated: Date | null;
  eventsCount: number;
  calendarUrl: string | null;
}

interface DashboardState {
  selectedDate: Date;
  currentMonth: Date;
  weeklySchedule: ClassInfo[];
  calendarStatus: CalendarSyncStatus;
  showCalendarInstructions: boolean;
  
  // Modal states
  showAppsModal: boolean;
  showChatModal: boolean;
  showHelpModal: boolean;
  
  // Actions
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  navigateMonth: (direction: number) => void;
  updateCalendarStatus: (status: CalendarSyncStatus) => void;
  setCalendarStatus: (status: CalendarSyncStatus) => void;
  setShowCalendarInstructions: (show: boolean) => void;
  setShowAppsModal: (show: boolean) => void;
  setShowChatModal: (show: boolean) => void;
  setShowHelpModal: (show: boolean) => void;
  closeAllModals: () => void;
  getClassesForDate: (date: Date) => ClassInfo[];
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      selectedDate: new Date(),
      currentMonth: new Date(),
      weeklySchedule: [
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
      ],
      calendarStatus: {
        isGenerated: false,
        lastGenerated: null,
        eventsCount: 0,
        calendarUrl: null
      },
      showCalendarInstructions: false,
      showAppsModal: false,
      showChatModal: false,
      showHelpModal: false,

      setSelectedDate: (date) => set({ selectedDate: date }, false, 'dashboard/setSelectedDate'),

      setCurrentMonth: (date) => set({ currentMonth: date }, false, 'dashboard/setCurrentMonth'),

      navigateMonth: (direction) => set(
        (state) => {
          const newMonth = new Date(state.currentMonth);
          newMonth.setMonth(state.currentMonth.getMonth() + direction);
          return { currentMonth: newMonth };
        },
        false,
        'dashboard/navigateMonth'
      ),

      updateCalendarStatus: (status) => set({ calendarStatus: status }, false, 'dashboard/updateCalendarStatus'),

      setCalendarStatus: (status) => set({ calendarStatus: status }, false, 'dashboard/setCalendarStatus'),

      setShowCalendarInstructions: (show) => set({ showCalendarInstructions: show }, false, 'dashboard/setShowCalendarInstructions'),

      setShowAppsModal: (show) => set({ showAppsModal: show }, false, 'dashboard/setShowAppsModal'),

      setShowChatModal: (show) => set({ showChatModal: show }, false, 'dashboard/setShowChatModal'),

      setShowHelpModal: (show) => set({ showHelpModal: show }, false, 'dashboard/setShowHelpModal'),

      closeAllModals: () => set({
        showAppsModal: false,
        showChatModal: false,
        showHelpModal: false
      }, false, 'dashboard/closeAllModals'),

      getClassesForDate: (date) => {
        const state = get();
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convertir domingo (0) a 7
        return state.weeklySchedule.filter(cls => cls.dayOfWeek === dayOfWeek);
      },
    }),
    {
      name: 'dashboard-store',
    }
  )
);
