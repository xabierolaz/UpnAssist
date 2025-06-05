// ChatService.ts - Sistema de chat multi-sala
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import type { Message, User } from '../types/chat';
import type { Subject } from '../types/subject';
import { generateRoomKey, encryptMessage, decryptMessage, isCryptoAvailable } from '../utils/chatEncryption';

interface RoomState {
  encryptionKey: CryptoKey | null;
  messages: Message[];
}

export class ChatService {
  private socket: Socket | null = null;
  private userId: string;
  private userName: string;
  private isConnected: boolean = false;
  private readonly SERVER_URL = 'https://socket-io-realtime.herokuapp.com';
  
  // Multi-room support
  private currentRoomId: string | null = null;
  private rooms: Map<string, RoomState> = new Map();
  private pingInterval: number | null = null;
  private encryptionEnabled: boolean = false;
  
  private onMessageCallback: ((message: Message, roomId: string) => void) | null = null;
  private onUsersUpdateCallback: ((users: User[], roomId: string) => void) | null = null;
  private onConnectionStatusCallback: ((status: boolean) => void) | null = null;

  constructor() {
    this.userId = uuidv4();
    this.userName = 'Profesor'; // Por defecto
    this.encryptionEnabled = isCryptoAvailable();
  }

  private getRoomState(roomId: string): RoomState {
    let roomState = this.rooms.get(roomId);
    if (!roomState) {
      roomState = {
        encryptionKey: null,
        messages: []
      };
      this.rooms.set(roomId, roomState);
    }
    return roomState;
  }

  // Conexión inicial al servidor de chat
  connect(userName?: string): Promise<boolean> {
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
          }
        });

        this.socket.on('connect', () => {
          console.log('✅ Conectado al chat');
          this.isConnected = true;
          this.onConnectionStatusCallback?.(true);
          resolve(true);
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Desconectado del chat');
          this.isConnected = false;
          this.onConnectionStatusCallback?.(false);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Error de conexión:', error);
          this.isConnected = false;
          this.onConnectionStatusCallback?.(false);
          resolve(false);
        });

        // Manejar mensajes entrantes con soporte multi-sala
        this.socket.on('message', async (data) => {
          const roomId = data.roomId;
          const roomState = this.getRoomState(roomId);

          try {
            let messageContent = data.message;
            if (data.encrypted && roomState.encryptionKey) {
              messageContent = await this.decryptMessage(messageContent, roomState.encryptionKey);
            }

            const message: Message = {
              id: data.id || uuidv4(),
              user: data.userName,
              message: messageContent,
              timestamp: new Date(data.timestamp),
              isOwn: data.userId === this.userId,
              encrypted: data.encrypted
            };

            roomState.messages.push(message);
            this.onMessageCallback?.(message, roomId);

          } catch (error) {
            console.error('Error al procesar mensaje:', error);
          }
        });

        // Actualización de usuarios por sala
        this.socket.on('users-update', (data) => {
          const { roomId, users } = data;
          const userList: User[] = users
            .map((user: any) => ({
              id: user.userId,
              name: user.userName,
              joinedAt: new Date(user.joinedAt || new Date()),
              device: user.device || 'unknown'
            }))
            .sort((a: User, b: User) => a.name.localeCompare(b.name));

          this.onUsersUpdateCallback?.(userList, roomId);
        });

      } catch (error) {
        console.error('Error al conectar:', error);
        this.isConnected = false;
        this.onConnectionStatusCallback?.(false);
        resolve(false);
      }
    });
  }

  // Unirse a una sala específica
  async joinRoom(subject: Subject): Promise<boolean> {
    if (!this.socket || !this.isConnected) return false;

    const roomId = `subject-${subject.id}`;
    
    try {
      // Inicializar cifrado para la sala
      const roomState = this.getRoomState(roomId);
      if (this.encryptionEnabled && !roomState.encryptionKey) {
        roomState.encryptionKey = await generateRoomKey(roomId);
      }

      this.socket.emit('join-room', {
        roomId,
        userId: this.userId,
        userName: this.userName,
        timestamp: new Date().toISOString(),
        device: this.detectDeviceType(),
        platform: navigator.platform
      });

      this.currentRoomId = roomId;
      return true;

    } catch (error) {
      console.error('Error al unirse a la sala:', error);
      return false;
    }
  }

  // Salir de una sala
  leaveRoom(roomId: string): void {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('leave-room', {
      roomId,
      userId: this.userId
    });

    if (this.currentRoomId === roomId) {
      this.currentRoomId = null;
    }
  }

  // Enviar mensaje en la sala actual
  async sendMessage(message: string): Promise<boolean> {
    if (!this.socket || !this.isConnected || !this.currentRoomId || !message.trim()) {
      return false;
    }

    try {
      const roomState = this.getRoomState(this.currentRoomId);
      let finalMessage = message.trim();
      let isEncrypted = false;

      if (this.encryptionEnabled && roomState.encryptionKey) {
        finalMessage = await encryptMessage(finalMessage, roomState.encryptionKey);
        isEncrypted = true;
      }

      const messageData = {
        id: uuidv4(),
        roomId: this.currentRoomId,
        userId: this.userId,
        userName: this.userName,
        message: finalMessage,
        timestamp: new Date().toISOString(),
        device: this.detectDeviceType(),
        encrypted: isEncrypted
      };

      this.socket.emit('send-message', messageData);
      return true;

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return false;
    }
  }

  // Métodos privados auxiliares
  private async decryptMessage(message: string, key: CryptoKey): Promise<string> {
    try {
      return await decryptMessage(message, key);
    } catch (error) {
      console.error('Error al descifrar mensaje:', error);
      return message;
    }
  }

  private detectDeviceType(): string {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|iPad|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) 
      ? 'mobile' 
      : 'desktop';
  }

  // Event handlers
  onMessage(callback: (message: Message, roomId: string) => void): void {
    this.onMessageCallback = callback;
  }

  onUsersUpdate(callback: (users: User[], roomId: string) => void): void {
    this.onUsersUpdateCallback = callback;
  }

  onConnectionStatus(callback: (status: boolean) => void): void {
    this.onConnectionStatusCallback = callback;
  }

  // Getters y utilidades
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getUserName(): string {
    return this.userName;
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  isEncryptionEnabled(): boolean {
    return this.encryptionEnabled;
  }

  // Actualizar nombre de usuario
  setUserName(name: string): void {
    this.userName = name;
    
    if (this.socket && this.isConnected && this.currentRoomId) {
      this.socket.emit('update-user', {
        roomId: this.currentRoomId,
        userId: this.userId,
        userName: name
      });
    }
  }

  // Solicitar lista de usuarios actualizada para una sala
  requestUserList(roomId: string): void {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('request-users', {
      roomId,
      requesterId: this.userId
    });

    // Enviar nuestra presencia para asegurar visibilidad
    this.socket.emit('user-presence', {
      roomId,
      userId: this.userId,
      userName: this.userName,
      timestamp: new Date().toISOString(),
      device: this.detectDeviceType(),
      platform: navigator.platform,
      clientInfo: `UpnAssist-${this.detectDeviceType()}`
    });
  }

  // Obtener los mensajes de una sala específica
  getRoomMessages(roomId: string): Message[] {
    return this.getRoomState(roomId).messages;
  }

  // Limpiar el historial de mensajes de una sala
  clearRoomHistory(roomId: string): void {
    const roomState = this.getRoomState(roomId);
    roomState.messages = [];
  }

  // Obtener información sobre la sala actual
  getCurrentRoom(): { roomId: string, encrypted: boolean } | null {
    if (!this.currentRoomId) return null;
    
    const roomState = this.getRoomState(this.currentRoomId);
    return {
      roomId: this.currentRoomId,
      encrypted: Boolean(roomState.encryptionKey)
    };
  }

  // Limpiar recursos al desconectar
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentRoomId = null;
    this.rooms.clear();
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.onConnectionStatusCallback?.(false);
  }
}
