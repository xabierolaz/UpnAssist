import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Subject, SubjectRoom } from '../types/subject';
import { RepositoryFactory } from '../factories/RepositoryFactory';
import { EventBus } from '../utils/EventBus';
import { sampleSubjects } from '../data/sampleSubjects';
import type { ISubjectRepository } from '../interfaces/ISubjectRepository';

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

  // Repositorio desacoplado
  const subjectRepository: ISubjectRepository = RepositoryFactory.getSubjectRepository();
  const eventBus = EventBus.getInstance();

  // Cargar asignaturas al iniciar
  useEffect(() => {
    loadSubjects();

    // Escuchar eventos de asignaturas
    const unsubscribeSubjectAdded = eventBus.on(
      EventBus.Events.SUBJECT_ADDED, 
      () => loadSubjects()
    );
    
    const unsubscribeSubjectRemoved = eventBus.on(
      EventBus.Events.SUBJECT_REMOVED, 
      () => loadSubjects()
    );

    return () => {
      unsubscribeSubjectAdded();
      unsubscribeSubjectRemoved();
    };
  }, [subjectRepository, eventBus]);

  const loadSubjects = () => {
    // Primero intentar cargar desde el repositorio
    let loadedSubjects = subjectRepository.getAllSubjects();
    
    // Si no hay asignaturas, cargar los ejemplos
    if (loadedSubjects.length === 0) {
      sampleSubjects.forEach(subject => {
        subjectRepository.addSubject(subject);
      });
      loadedSubjects = subjectRepository.getAllSubjects();
    }
    
    setSubjects(loadedSubjects);
    setActiveRooms(subjectRepository.getJoinedRooms());
  };

  const addSubject = (subject: Subject): boolean => {
    const success = subjectRepository.addSubject(subject);
    if (success) {
      loadSubjects();
    }
    return success;
  };

  const removeSubject = (subjectId: string): boolean => {
    const success = subjectRepository.removeSubject(subjectId);
    if (success) {
      loadSubjects();
      if (selectedRoom?.subject.id === subjectId) {
        setSelectedRoom(null);
      }
    }
    return success;
  };

  const joinRoom = (subject: Subject) => {
    subjectRepository.setRoomJoined(subject.id, true);
    const room = subjectRepository.getJoinedRooms().find((r: SubjectRoom) => r.subject.id === subject.id);
    if (room) {
      setActiveRooms(prev => [...prev, room]);
      setSelectedRoom(room);
    }
  };

  const leaveRoom = (subjectId: string) => {
    subjectRepository.setRoomJoined(subjectId, false);
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
