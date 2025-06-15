import type { ISubjectRepository } from '../interfaces/ISubjectRepository';
import type { Subject, SubjectRoom } from '../types/subject';
import { EventBus } from '../utils/EventBus';

/**
 * Implementación del repositorio de asignaturas usando localStorage
 * Desacopla el almacenamiento específico de la lógica de negocio
 */
export class LocalStorageSubjectRepository implements ISubjectRepository {
  private subjects: Map<string, Subject> = new Map();
  private rooms: Map<string, SubjectRoom> = new Map();
  private eventBus: EventBus;

  private readonly STORAGE_KEYS = {
    SUBJECTS: 'upn-subjects',
    ROOMS: 'upn-subject-rooms'
  };

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.load();
  }

  addSubject(subject: Subject): boolean {
    try {
      if (this.subjects.has(subject.id)) {
        return false; // Ya existe
      }

      this.subjects.set(subject.id, subject);
        // Crear sala asociada
      const room: SubjectRoom = {
        subject,
        participantCount: 0,
        lastActivity: new Date(),
        isJoined: false
      };
      
      this.rooms.set(subject.id, room);
      this.save();
      
      this.eventBus.emit(EventBus.Events.SUBJECT_ADDED, { subject });
      return true;
    } catch (error) {
      console.error('Error adding subject:', error);
      return false;
    }
  }

  removeSubject(subjectId: string): boolean {
    try {
      if (!this.subjects.has(subjectId)) {
        return false;
      }

      const subject = this.subjects.get(subjectId)!;
      this.subjects.delete(subjectId);
      
      // Eliminar sala asociada
      const roomId = `subject-${subjectId}`;
      this.rooms.delete(roomId);
      
      this.save();
      this.eventBus.emit(EventBus.Events.SUBJECT_REMOVED, { subjectId, subject });
      return true;
    } catch (error) {
      console.error('Error removing subject:', error);
      return false;
    }
  }

  getAllSubjects(): Subject[] {
    return Array.from(this.subjects.values());
  }

  getSubject(subjectId: string): Subject | undefined {
    return this.subjects.get(subjectId);
  }

  getAllRooms(): SubjectRoom[] {
    return Array.from(this.rooms.values());
  }

  getJoinedRooms(): SubjectRoom[] {
    return Array.from(this.rooms.values()).filter(room => room.isJoined);
  }

  setRoomJoined(subjectId: string, joined: boolean): void {
    const roomId = `subject-${subjectId}`;
    const room = this.rooms.get(roomId);
    
    if (room) {
      room.isJoined = joined;
      room.lastActivity = new Date();
      this.save();
    }
  }

  isRoomJoined(subjectId: string): boolean {
    const roomId = `subject-${subjectId}`;
    const room = this.rooms.get(roomId);
    return room?.isJoined || false;
  }

  save(): void {
    try {
      // Convertir Maps a objetos para almacenamiento
      const subjectsObj = Object.fromEntries(this.subjects);
      const roomsObj = Object.fromEntries(
        Array.from(this.rooms.entries()).map(([key, value]) => [
          key,
          {
            ...value,
            lastActivity: value.lastActivity.toISOString()
          }
        ])
      );

      localStorage.setItem(this.STORAGE_KEYS.SUBJECTS, JSON.stringify(subjectsObj));
      localStorage.setItem(this.STORAGE_KEYS.ROOMS, JSON.stringify(roomsObj));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  load(): void {
    try {
      // Cargar asignaturas
      const savedSubjects = localStorage.getItem(this.STORAGE_KEYS.SUBJECTS);
      if (savedSubjects) {
        const subjectsData = JSON.parse(savedSubjects);
        this.subjects = new Map(Object.entries(subjectsData));
      }

      // Cargar salas
      const savedRooms = localStorage.getItem(this.STORAGE_KEYS.ROOMS);
      if (savedRooms) {
        const roomsData = JSON.parse(savedRooms);
        const roomsMap = new Map();
        
        Object.entries(roomsData).forEach(([key, value]: [string, any]) => {
          roomsMap.set(key, {
            ...value,
            lastActivity: new Date(value.lastActivity)
          });
        });
        
        this.rooms = roomsMap;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  clear(): void {
    this.subjects.clear();
    this.rooms.clear();
    localStorage.removeItem(this.STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(this.STORAGE_KEYS.ROOMS);
  }
}
