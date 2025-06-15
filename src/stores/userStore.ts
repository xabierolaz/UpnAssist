import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isOnline: boolean;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: boolean;
  };
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserState['preferences']>) => void;
  toggleTheme: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      preferences: {
        theme: 'light',
        language: 'es',
        notifications: true,
      },

      setUser: (user) => set({ 
        currentUser: user, 
        isAuthenticated: true 
      }, false, 'user/setUser'),

      logout: () => set({ 
        currentUser: null, 
        isAuthenticated: false 
      }, false, 'user/logout'),

      updatePreferences: (newPreferences) => set(
        (state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        }),
        false,
        'user/updatePreferences'
      ),

      toggleTheme: () => set(
        (state) => ({
          preferences: {
            ...state.preferences,
            theme: state.preferences.theme === 'light' ? 'dark' : 'light'
          }
        }),
        false,
        'user/toggleTheme'
      ),
    }),
    {
      name: 'user-store',
    }
  )
);
