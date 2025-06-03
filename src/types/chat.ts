// Types for the chat system

export interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface User {
  id: string;
  name: string;
  joinedAt: Date;
}
