/**
 * Servicio para gestionar las asignaturas y sus salas de chat
 */

import type { Subject, SubjectRoom } from '../types/subject';

class SubjectService {
  private subjects: Map<string, Subject> = new Map();
  private rooms: Map<string, SubjectRoom> = new Map();

  constructor() {
    this.loadFromLocalStorage();
  }

  /**
   * Carga las asignaturas guardadas en localStorage
   */
  private loadFromLocalStorage() {
    try {
      const savedSubjects = localStorage.getItem('upn-subjects');
      const savedRooms = localStorage.getItem('upn-subject-rooms');

      if (savedSubjects) {
        const subjectsData = JSON.parse(savedSubjects);
        this.subjects = new Map(Object.entries(subjectsData));
      }

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
      console.error('Error al cargar asignaturas desde localStorage:', error);
    }
  }

  /**
   * Guarda las asignaturas en localStorage
   */
  private saveToLocalStorage() {
    try {
      localStorage.setItem('upn-subjects', 
        JSON.stringify(Object.fromEntries(this.subjects))
      );
      
      const roomsData = Object.fromEntries(
        Array.from(this.rooms.entries()).map(([key, value]) => [
          key, 
          {
            ...value,
            lastActivity: value.lastActivity.toISOString()
          }
        ])
      );
      
      localStorage.setItem('upn-subject-rooms',
        JSON.stringify(roomsData)
      );
    } catch (error) {
      console.error('Error al guardar asignaturas:', error);
    }
  }

  /**
   * Añade una nueva asignatura
   */
  addSubject(subject: Subject): boolean {
    try {
      this.subjects.set(subject.id, subject);
      
      // Crear sala asociada
      const room: SubjectRoom = {
        subject,
        participantCount: 0,
        lastActivity: new Date(),
        isJoined: false
      };
      
      this.rooms.set(subject.id, room);
      this.saveToLocalStorage();
      return true;
    } catch (error) {
      console.error('Error al añadir asignatura:', error);
      return false;
    }
  }

  /**
   * Obtiene todas las asignaturas
   */
  getAllSubjects(): Subject[] {
    return Array.from(this.subjects.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Obtiene todas las salas de chat
   */
  getAllRooms(): SubjectRoom[] {
    return Array.from(this.rooms.values())
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  /**
   * Obtiene las salas a las que se ha unido el usuario
   */
  getJoinedRooms(): SubjectRoom[] {
    return Array.from(this.rooms.values())
      .filter(room => room.isJoined)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  /**
   * Marca una sala como unida o no
   */
  setRoomJoined(subjectId: string, joined: boolean): void {
    const room = this.rooms.get(subjectId);
    if (room) {
      room.isJoined = joined;
      if (joined) {
        room.lastActivity = new Date();
      }
      this.saveToLocalStorage();
    }
  }

  /**
   * Actualiza el contador de participantes de una sala
   */
  updateParticipantCount(subjectId: string, count: number): void {
    const room = this.rooms.get(subjectId);
    if (room) {
      room.participantCount = count;
      this.saveToLocalStorage();
    }
  }

  /**
   * Actualiza la última actividad de una sala
   */
  updateLastActivity(subjectId: string): void {
    const room = this.rooms.get(subjectId);
    if (room) {
      room.lastActivity = new Date();
      this.saveToLocalStorage();
    }
  }

  /**
   * Obtiene el ID de sala para una asignatura
   */
  getRoomId(subjectId: string): string | null {
    const subject = this.subjects.get(subjectId);
    return subject?.roomId || null;
  }

  /**
   * Obtiene una asignatura por su ID
   */
  getSubject(subjectId: string): Subject | null {
    return this.subjects.get(subjectId) || null;
  }

  /**
   * Elimina una asignatura y su sala
   */
  removeSubject(subjectId: string): boolean {
    try {
      this.subjects.delete(subjectId);
      this.rooms.delete(subjectId);
      this.saveToLocalStorage();
      return true;
    } catch (error) {
      console.error('Error al eliminar asignatura:', error);
      return false;
    }
  }
}

// Exportar una única instancia del servicio
export const subjectService = new SubjectService();
