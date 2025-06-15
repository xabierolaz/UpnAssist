import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { Subject, SubjectRoom } from '../types/subject';

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  encrypted?: boolean;
  isOwn?: boolean;
  delivered?: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'subject' | 'private';
  members: string[];
  isActive: boolean;
}

interface ChatState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  currentUser: string | null;
  
  // Room management
  activeRoom: string | null;
  rooms: Record<string, ChatRoom>;
  
  // Messages
  messages: Record<string, Message[]>;
  
  // UI state
  currentView: 'subjects' | 'contacts' | 'private-rooms';
  showSecurityModal: boolean;
  
  // Subject/room management (for compatibility with existing components)
  subjects: Subject[];
  activeRooms: SubjectRoom[];
  selectedRoom: SubjectRoom | null;
  
  // Actions
  setConnectionState: (connected: boolean, connecting?: boolean) => void;
  setCurrentUser: (user: string | null) => void;
  setActiveRoom: (roomId: string | null) => void;
  addMessage: (roomId: string, message: Message) => void;
  setCurrentView: (view: 'subjects' | 'contacts' | 'private-rooms') => void;
  setShowSecurityModal: (show: boolean) => void;
  
  // Subject/room actions (for compatibility)
  setSubjects: (subjects: Subject[]) => void;
  setActiveRooms: (rooms: SubjectRoom[]) => void;
  setSelectedRoom: (room: SubjectRoom | null) => void;
  joinRoom: (subject: Subject) => void;
  leaveRoom: (subjectId: string) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    subscribeWithSelector((set) => ({
      // Initial state
      isConnected: false,
      isConnecting: false,
      currentUser: null,
      activeRoom: null,
      rooms: {},
      messages: {},
      currentView: 'subjects',
      showSecurityModal: false,
      subjects: [],
      activeRooms: [],
      selectedRoom: null,
      
      // Actions
      setConnectionState: (connected, connecting = false) =>
        set({ isConnected: connected, isConnecting: connecting }),
        
      setCurrentUser: (user) => set({ currentUser: user }),
      
      setActiveRoom: (roomId) => set({ activeRoom: roomId }),
      
      addMessage: (roomId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), message],
          },
        })),
        
      setCurrentView: (view) => set({ currentView: view }),
      
      setShowSecurityModal: (show) => set({ showSecurityModal: show }),
      
      // Subject/room actions
      setSubjects: (subjects) => set({ subjects }),
      
      setActiveRooms: (rooms) => set({ activeRooms: rooms }),
      
      setSelectedRoom: (room) => set({ selectedRoom: room }),
        joinRoom: (subject) => {
        const room: SubjectRoom = {
          subject,
          participantCount: 1,
          lastActivity: new Date(),
          isJoined: true,
        };
        
        set((state) => ({
          activeRooms: [...state.activeRooms.filter(r => r.subject.id !== subject.id), room],
          selectedRoom: room,
        }));
      },
      
      leaveRoom: (subjectId) =>
        set((state) => ({
          activeRooms: state.activeRooms.filter(r => r.subject.id !== subjectId),
          selectedRoom: state.selectedRoom?.subject.id === subjectId ? null : state.selectedRoom,
        })),
    })),
    {
      name: 'chat-store',
    }
  )
);
