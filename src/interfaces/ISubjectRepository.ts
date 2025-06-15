import type { Subject, SubjectRoom } from '../types/subject';

/**
 * Interface para el repositorio de asignaturas
 * Desacopla la gestión de asignaturas del almacenamiento específico
 */
export interface ISubjectRepository {
  // Gestión de asignaturas
  addSubject(subject: Subject): boolean;
  removeSubject(subjectId: string): boolean;
  getAllSubjects(): Subject[];
  getSubject(subjectId: string): Subject | undefined;

  // Gestión de salas
  getAllRooms(): SubjectRoom[];
  getJoinedRooms(): SubjectRoom[];
  setRoomJoined(subjectId: string, joined: boolean): void;
  isRoomJoined(subjectId: string): boolean;

  // Persistencia
  save(): void;
  load(): void;
  clear(): void;
}
