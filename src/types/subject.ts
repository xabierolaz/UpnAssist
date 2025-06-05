/**
 * Tipos para gestión de asignaturas en el chat
 */

export interface Subject {
  id: string;
  code: string;        // Código de la asignatura
  name: string;        // Nombre de la asignatura
  roomId: string;      // ID único para la sala de chat
  semester: string;    // Semestre actual
  year: string;        // Año académico
  description?: string;
}

export interface SubjectRoom {
  subject: Subject;
  participantCount: number;
  lastActivity: Date;
  isJoined: boolean;
}
