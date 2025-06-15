import type { IChatRepository } from '../interfaces/IChatRepository';
import type { Subject, SubjectRoom } from '../types/subject';
import type { Message, User } from '../types/chat';
import { EventBus } from '../utils/EventBus';

/**
 * Implementación del repositorio de chat usando Socket.io
 * Versión simplificada que implementa la interfaz requerida
 */
export class SocketChatRepository implements IChatRepository {
  private isConnected: boolean = false;
  private userName: string = '';
  private activeRooms: string[] = [];
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Simular eventos de conexión para cumplir con la interfaz
    setTimeout(() => {
      this.isConnected = true;
      this.eventBus.emit('connection:status', { connected: true });
    }, 1000);
  }

  async connect(userName?: string): Promise<boolean> {
    if (userName) {
      this.userName = userName;
    }
    this.isConnected = true;
    this.eventBus.emit('connection:status', { connected: true });
    return true;
  }

  disconnect(): void {
    this.isConnected = false;
    this.userName = '';
    this.activeRooms = [];
    this.eventBus.emit('connection:status', { connected: false });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getUserName(): string {
    return this.userName;
  }
  async joinSubjectRoom(subject: Subject): Promise<boolean> {
    this.activeRooms.push(subject.roomId);
    const subjectRoom: SubjectRoom = {
      subject: subject,
      participantCount: 1,
      lastActivity: new Date(),
      isJoined: true
    };
    this.eventBus.emit('room:joined', subjectRoom);
    return true;
  }

  leaveSubjectRoom(subjectId: string): boolean {
    const index = this.activeRooms.findIndex(roomId => roomId === subjectId);
    if (index !== -1) {
      const roomId = this.activeRooms.splice(index, 1)[0];
      this.eventBus.emit('room:left', roomId);
      return true;
    }
    return false;
  }

  getActiveRooms(): string[] {
    return [...this.activeRooms];
  }
  async sendMessage(messageText: string, roomId: string): Promise<boolean> {
    // Simular envío de mensaje
    const messageObj: Message = {
      id: Date.now().toString(),
      user: this.userName,
      message: messageText,
      timestamp: new Date(),
      isOwn: true,
      delivered: true,
      roomId: roomId
    };
    
    setTimeout(() => {
      this.eventBus.emit('message:received', messageObj);
    }, 100);
    return true;
  }
  onMessage(callback: (message: Message, roomId: string) => void): void {
    this.eventBus.on('message:received', (data: Message) => {
      callback(data, 'default');
    });
  }

  onUsersUpdate(callback: (users: User[], roomId: string) => void): void {
    this.eventBus.on('users:updated', (data: { users: User[]; roomId: string }) => {
      callback(data.users, data.roomId);
    });
  }

  onConnectionStatus(callback: (connected: boolean) => void): void {
    this.eventBus.on('connection:status', (data: { connected: boolean }) => {
      callback(data.connected);
    });
  }
  onRoomJoined(callback: (room: SubjectRoom) => void): void {
    this.eventBus.on('room:joined', callback);
  }

  onRoomLeft(callback: (roomId: string) => void): void {
    this.eventBus.on('room:left', callback);
  }

  isEncryptionEnabled(): boolean {
    return false;
  }
}