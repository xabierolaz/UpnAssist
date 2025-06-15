// Types for the chat system

export interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  encrypted?: boolean; // Indica si el mensaje está cifrado
  delivered?: boolean; // Indica si el mensaje fue entregado
  roomId?: string; // ID de la sala donde se envió el mensaje
}

export interface User {
  id: string;
  name: string;
  joinedAt: Date;
  device?: string; // Tipo de dispositivo: 'mobile', 'desktop', 'unknown'
}
