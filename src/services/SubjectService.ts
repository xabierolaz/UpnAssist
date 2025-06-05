/**
 * Servicio para gestionar las asignaturas y sus salas de chat
 */

import type { Subject, SubjectRoom } from '../types/subject';

class SubjectService {
  private subjects: Map<string, Subject> = new Map();
  private rooms: Map<string, SubjectRoom> = new Map();

  constructor() {
    // Cargar las asignaturas del almacenamiento local si existen
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
        const parsed = JSON.parse(savedSubjects) as Record<string, Subject>;
        Object.values(parsed).forEach((subject: Subject) => {
          this.subjects.set(subject.id, subject);
        });
      }
      
      if (savedRooms) {
        const parsed = JSON.parse(savedRooms) as Record<string, SubjectRoom>;
        Object.values(parsed).forEach((room: SubjectRoom) => {
          room.lastActivity = new Date(room.lastActivity); // Convertir string a Date
          this.rooms.set(room.subject.id, room);
        });
      }
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
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
      localStorage.setItem('upn-subject-rooms',
        JSON.stringify(Object.fromEntries(this.rooms))
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
      // Validar datos
      if (!subject.id || !subject.code || !subject.name) {
        throw new Error('Datos de asignatura incompletos');
      }

      // Crear la sala correspondiente
      const room: SubjectRoom = {
        subject,
        participantCount: 0,
        lastActivity: new Date(),
        isJoined: false
      };

      // Guardar datos
      this.subjects.set(subject.id, subject);
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
    return Array.from(this.subjects.values());
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
