import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import type { Message, User } from '../types';

export class ChatService {
  private socket: Socket | null = null;
  private userId: string;
  private userName: string;
  private isConnected: boolean = false;
  // Servidor Socket.io público más confiable para chat entre redes
  private readonly SERVER_URL = 'https://socket-io-chat.herokuapp.com';
  
  private onMessageCallback: ((message: Message) => void) | null = null;
  private onUsersUpdateCallback: ((users: User[]) => void) | null = null;
  private onConnectionStatusCallback: ((status: boolean) => void) | null = null;

  constructor() {
    this.userId = uuidv4();
    this.userName = 'Profesor'; // Por defecto
  }

  connect(userName?: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (userName) {
        this.userName = userName;
      }

      try {        this.socket = io(this.SERVER_URL, {
          transports: ['websocket', 'polling'],
          timeout: 15000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          upgrade: true,
          rememberUpgrade: true
        });

        this.socket.on('connect', () => {
          console.log('✅ Conectado al chat');
          this.isConnected = true;
          this.onConnectionStatusCallback?.(true);
          
          // Unirse a la sala de profesores
          this.socket?.emit('join-room', {
            roomId: 'upn-professors',
            userId: this.userId,
            userName: this.userName
          });
          
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

        this.socket.on('message', (data) => {
          const message: Message = {
            id: data.id || uuidv4(),
            user: data.userName,
            message: data.message,
            timestamp: new Date(data.timestamp),
            isOwn: data.userId === this.userId
          };
          this.onMessageCallback?.(message);
        });

        this.socket.on('users-update', (users) => {
          const userList: User[] = users.map((user: any) => ({
            id: user.userId,
            name: user.userName,
            joinedAt: new Date(user.joinedAt)
          }));
          this.onUsersUpdateCallback?.(userList);
        });

      } catch (error) {
        console.error('Error al conectar:', error);
        this.isConnected = false;
        this.onConnectionStatusCallback?.(false);
        resolve(false);
      }
    });
  }

  sendMessage(message: string): boolean {
    if (!this.socket || !this.isConnected || !message.trim()) {
      return false;
    }

    const messageData = {
      id: uuidv4(),
      roomId: 'upn-professors',
      userId: this.userId,
      userName: this.userName,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    this.socket.emit('send-message', messageData);
    return true;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.onConnectionStatusCallback?.(false);
  }

  onMessage(callback: (message: Message) => void): void {
    this.onMessageCallback = callback;
  }

  onUsersUpdate(callback: (users: User[]) => void): void {
    this.onUsersUpdateCallback = callback;
  }

  onConnectionStatus(callback: (status: boolean) => void): void {
    this.onConnectionStatusCallback = callback;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getUserName(): string {
    return this.userName;
  }

  setUserName(name: string): void {
    this.userName = name;
  }
}
