/**
 * Servicio de chat mejorado con soporte para múltiples salas
 */

import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import type { Message, User } from '../types';
import type { Subject, SubjectRoom } from '../types/subject';
import { generateRoomKey, encryptMessage, decryptMessage, isCryptoAvailable } from '../utils/chatEncryption';
import { subjectService } from './SubjectService';

interface RoomInfo {
  roomId: string;
  encryptionKey: CryptoKey | null;
  users: User[];
}

export class MultiRoomChatService {
  private socket: Socket | null = null;
  private userId: string;
  private userName: string;
  private isConnected: boolean = false;
  private readonly SERVER_URL = 'https://socket-io-realtime.herokuapp.com';
  private pingInterval: number | null = null;
  private activeRooms: Map<string, RoomInfo> = new Map();
  private encryptionEnabled: boolean = false;
  
  private onMessageCallback: ((message: Message, roomId: string) => void) | null = null;
  private onUsersUpdateCallback: ((users: User[], roomId: string) => void) | null = null;
  private onConnectionStatusCallback: ((status: boolean) => void) | null = null;
  private onRoomJoinedCallback: ((room: SubjectRoom) => void) | null = null;
  private onRoomLeftCallback: ((roomId: string) => void) | null = null;

  constructor() {
    this.userId = uuidv4();
    this.userName = 'Profesor';
    this.encryptionEnabled = isCryptoAvailable();
  }

  async connect(userName?: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (userName) {
        this.userName = userName;
      }

      try {
        if (this.socket) {
          this.socket.disconnect();
        }

        this.socket = io(this.SERVER_URL, {
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          upgrade: true,
          rememberUpgrade: true,
          extraHeaders: {
            'X-Client-Info': `UpnAssist-${this.detectDeviceType()}-${navigator.platform}`,
            'X-Client-ID': this.userId
          },
          query: {
            userId: this.userId,
            userName: this.userName,
            device: this.detectDeviceType(),
            timestamp: new Date().getTime()
          }
        });

        this.setupSocketListeners();
        this.startPingInterval();

        this.socket.on('connect', () => {
          console.log('✅ Conectado al servidor de chat');
          this.isConnected = true;
          this.onConnectionStatusCallback?.(true);

          // Reconectar a las salas activas
          this.rejoinActiveRooms();
          resolve(true);
        });

      } catch (error) {
        console.error('Error al conectar:', error);
        this.isConnected = false;
        this.onConnectionStatusCallback?.(false);
        resolve(false);
      }
    });
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del chat');
      this.isConnected = false;
      this.onConnectionStatusCallback?.(false);
    });

    this.socket.on('message', async (data) => {
      try {
        if (!this.activeRooms.has(data.roomId)) return;

        const roomInfo = this.activeRooms.get(data.roomId)!;
        let messageContent = data.message;

        // Descifrar el mensaje si es necesario
        if (data.encrypted && roomInfo.encryptionKey) {
          messageContent = await decryptMessage(data.message, roomInfo.encryptionKey);
        }

        const message: Message = {
          id: data.id || uuidv4(),
          user: data.userName,
          message: messageContent,
          timestamp: new Date(data.timestamp),
          isOwn: data.userId === this.userId,
          encrypted: data.encrypted
        };

        this.onMessageCallback?.(message, data.roomId);
        
        // Actualizar última actividad de la sala
        if (data.roomId.startsWith('subject-')) {
          const subjectId = data.roomId.replace('subject-', '');
          subjectService.updateLastActivity(subjectId);
        }
      } catch (error) {
        console.error('Error al procesar mensaje:', error);
      }
    });

    this.socket.on('room-users', (data) => {
      const roomId = data.roomId;
      if (!this.activeRooms.has(roomId)) return;

      const users = data.users.map((user: any) => ({
        id: user.userId,
        name: user.userName,
        joinedAt: new Date(user.joinedAt || new Date()),
        device: user.device || 'unknown'
      }));

      this.onUsersUpdateCallback?.(users, roomId);

      // Actualizar contador de participantes para salas de asignaturas
      if (roomId.startsWith('subject-')) {
        const subjectId = roomId.replace('subject-', '');
        subjectService.updateParticipantCount(subjectId, users.length);
      }
    });
  }

  async joinSubjectRoom(subject: Subject): Promise<boolean> {
    if (!this.socket || !this.isConnected) return false;

    try {
      const roomId = `subject-${subject.id}`;
      
      // Generar clave de cifrado para la sala
      const encryptionKey = this.encryptionEnabled ? 
        await generateRoomKey(roomId) : null;

      // Unirse a la sala
      this.socket.emit('join-room', {
        roomId,
        userId: this.userId,
        userName: this.userName,
        timestamp: new Date().toISOString(),
        device: this.detectDeviceType(),
        subjectInfo: {
          id: subject.id,
          code: subject.code,
          name: subject.name
        }
      });

      // Registrar la sala como activa
      this.activeRooms.set(roomId, {
        roomId,
        encryptionKey,
        users: []
      });

      // Actualizar el estado en SubjectService
      subjectService.setRoomJoined(subject.id, true);
      
      const room = subjectService.getSubject(subject.id);
      if (room) {
        this.onRoomJoinedCallback?.({
          subject: room,
          participantCount: 0,
          lastActivity: new Date(),
          isJoined: true
        });
      }

      return true;
    } catch (error) {
      console.error('Error al unirse a la sala:', error);
      return false;
    }
  }

  leaveSubjectRoom(subjectId: string): boolean {
    if (!this.socket || !this.isConnected) return false;

    try {
      const roomId = `subject-${subjectId}`;
      
      // Salir de la sala
      this.socket.emit('leave-room', {
        roomId,
        userId: this.userId,
        timestamp: new Date().toISOString()
      });

      // Eliminar la sala de las activas
      this.activeRooms.delete(roomId);

      // Actualizar el estado en SubjectService
      subjectService.setRoomJoined(subjectId, false);
      
      this.onRoomLeftCallback?.(roomId);

      return true;
    } catch (error) {
      console.error('Error al salir de la sala:', error);
      return false;
    }
  }

  async sendMessage(message: string, roomId: string): Promise<boolean> {
    if (!this.socket || !this.isConnected || !message.trim()) return false;

    try {
      const roomInfo = this.activeRooms.get(roomId);
      if (!roomInfo) return false;

      // Cifrar el mensaje si es posible
      let encryptedMessage = message;
      if (this.encryptionEnabled && roomInfo.encryptionKey) {
        encryptedMessage = await encryptMessage(message.trim(), roomInfo.encryptionKey);
      }

      this.socket.emit('send-message', {
        id: uuidv4(),
        roomId,
        userId: this.userId,
        userName: this.userName,
        message: encryptedMessage,
        timestamp: new Date().toISOString(),
        encrypted: this.encryptionEnabled && roomInfo.encryptionKey !== null
      });

      return true;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return false;
    }
  }

  private startPingInterval(): void {
    this.stopPingInterval();
    
    this.pingInterval = window.setInterval(() => {
      if (this.socket && this.isConnected) {
        this.activeRooms.forEach((roomInfo, roomId) => {
          this.socket?.emit('room-ping', {
            roomId,
            userId: this.userId,
            userName: this.userName,
            timestamp: new Date().toISOString()
          });
        });
      }
    }, 15000);
  }

  private stopPingInterval(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private async rejoinActiveRooms(): Promise<void> {
    const joinedRooms = subjectService.getJoinedRooms();
    for (const room of joinedRooms) {
      await this.joinSubjectRoom(room.subject);
    }
  }

  private detectDeviceType(): string {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iPad|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) 
      ? 'mobile' 
      : 'desktop';
  }

  // Métodos de callback
  onMessage(callback: (message: Message, roomId: string) => void): void {
    this.onMessageCallback = callback;
  }

  onUsersUpdate(callback: (users: User[], roomId: string) => void): void {
    this.onUsersUpdateCallback = callback;
  }

  onConnectionStatus(callback: (status: boolean) => void): void {
    this.onConnectionStatusCallback = callback;
  }

  onRoomJoined(callback: (room: SubjectRoom) => void): void {
    this.onRoomJoinedCallback = callback;
  }

  onRoomLeft(callback: (roomId: string) => void): void {
    this.onRoomLeftCallback = callback;
  }

  // Getters
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getUserName(): string {
    return this.userName;
  }

  isEncryptionEnabled(): boolean {
    return this.encryptionEnabled;
  }

  getActiveRooms(): string[] {
    return Array.from(this.activeRooms.keys());
  }

  disconnect(): void {
    this.stopPingInterval();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.activeRooms.clear();
    this.onConnectionStatusCallback?.(false);
  }
}

// Exportar una única instancia del servicio
export const multiRoomChatService = new MultiRoomChatService();
