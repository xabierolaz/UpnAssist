import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Subject, SubjectRoom } from '../types/subject';
import { subjectService } from '../services/SubjectService';
import { sampleSubjects } from '../data/sampleSubjects';

interface ChatRoomsContextType {
  subjects: Subject[];
  activeRooms: SubjectRoom[];
  selectedRoom: SubjectRoom | null;
  loadSubjects: () => void;
  addSubject: (subject: Subject) => boolean;
  removeSubject: (subjectId: string) => boolean;
  joinRoom: (subject: Subject) => void;
  leaveRoom: (subjectId: string) => void;
  selectRoom: (roomId: string | null) => void;
}

const ChatRoomsContext = createContext<ChatRoomsContextType | undefined>(undefined);

export const useChatRooms = () => {
  const context = useContext(ChatRoomsContext);
  if (context === undefined) {
    throw new Error('useChatRooms must be used within a ChatRoomsProvider');
  }
  return context;
};

interface ChatRoomsProviderProps {
  children: ReactNode;
}

export const ChatRoomsProvider: React.FC<ChatRoomsProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeRooms, setActiveRooms] = useState<SubjectRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<SubjectRoom | null>(null);

  // Cargar asignaturas al iniciar
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    // Primero intentar cargar desde el servicio
    let loadedSubjects = subjectService.getAllSubjects();
    
    // Si no hay asignaturas, cargar los ejemplos
    if (loadedSubjects.length === 0) {
      sampleSubjects.forEach(subject => {
        subjectService.addSubject(subject);
      });
      loadedSubjects = subjectService.getAllSubjects();
    }
    
    setSubjects(loadedSubjects);
    setActiveRooms(subjectService.getJoinedRooms());
  };

  const addSubject = (subject: Subject): boolean => {
    const success = subjectService.addSubject(subject);
    if (success) {
      loadSubjects();
    }
    return success;
  };

  const removeSubject = (subjectId: string): boolean => {
    const success = subjectService.removeSubject(subjectId);
    if (success) {
      loadSubjects();
      if (selectedRoom?.subject.id === subjectId) {
        setSelectedRoom(null);
      }
    }
    return success;
  };

  const joinRoom = (subject: Subject) => {
    subjectService.setRoomJoined(subject.id, true);
    const room = subjectService.getJoinedRooms().find(r => r.subject.id === subject.id);
    if (room) {
      setActiveRooms(prev => [...prev, room]);
      setSelectedRoom(room);
    }
  };

  const leaveRoom = (subjectId: string) => {
    subjectService.setRoomJoined(subjectId, false);
    setActiveRooms(prev => prev.filter(room => room.subject.id !== subjectId));
    if (selectedRoom?.subject.id === subjectId) {
      setSelectedRoom(null);
    }
  };

  const selectRoom = (roomId: string | null) => {
    if (!roomId) {
      setSelectedRoom(null);
      return;
    }

    const subjectId = roomId.replace('subject-', '');
    const room = activeRooms.find(r => r.subject.id === subjectId);
    setSelectedRoom(room || null);
  };

  return (
    <ChatRoomsContext.Provider value={{
      subjects,
      activeRooms,
      selectedRoom,
      loadSubjects,
      addSubject,
      removeSubject,
      joinRoom,
      leaveRoom,
      selectRoom
    }}>
      {children}
    </ChatRoomsContext.Provider>
  );
};
