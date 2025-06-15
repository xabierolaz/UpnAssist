import type { Subject, SubjectRoom } from '../types/subject';
import type { Message, User } from '../types/chat';

/**
 * Interface para el repositorio de chat
 * Desacopla la implementación específica del servicio de chat
 */
export interface IChatRepository {
  // Conexión y estado
  connect(userName?: string): Promise<boolean>;
  disconnect(): void;
  getConnectionStatus(): boolean;
  getUserName(): string;

  // Gestión de salas
  joinSubjectRoom(subject: Subject): Promise<boolean>;
  leaveSubjectRoom(subjectId: string): boolean;
  getActiveRooms(): string[];

  // Mensajería
  sendMessage(message: string, roomId: string): Promise<boolean>;

  // Callbacks para eventos
  onMessage(callback: (message: Message, roomId: string) => void): void;
  onUsersUpdate(callback: (users: User[], roomId: string) => void): void;
  onConnectionStatus(callback: (status: boolean) => void): void;
  onRoomJoined(callback: (room: SubjectRoom) => void): void;
  onRoomLeft(callback: (roomId: string) => void): void;

  // Seguridad
  isEncryptionEnabled(): boolean;
}
