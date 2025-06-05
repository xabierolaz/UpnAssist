import { User } from './chat';
import { Subject } from './subject';

export interface ChatRoom {
  id: string;
  name: Subject; // Name of the subject (used as room name)
  users: User[];
  lastActivity?: Date;
  isEncrypted: boolean;
}

export interface RoomInfo {
  id: string; 
  name: Subject;
  userCount: number;
  isEncrypted: boolean;
  isJoined: boolean;
}

export interface JoinRoomResponse {
  success: boolean;
  room?: ChatRoom;
  error?: string;
}

// Events for multi-room chat
export type RoomEvent = {
  type: 'join' | 'leave' | 'message' | 'users-update';
  roomId: string;
  user?: User;
  data?: any;
  timestamp: Date;
};
