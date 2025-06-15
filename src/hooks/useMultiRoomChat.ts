/**
 * Hook personalizado para gestionar el chat con múltiples salas
 * Ahora usa repositorios desacoplados y Event Bus para comunicación
 */
import { useState, useEffect, useCallback } from 'react';
import type { Message, User } from '../types/chat';
import type { Subject, SubjectRoom } from '../types/subject';
import { RepositoryFactory } from '../factories/RepositoryFactory';
import { EventBus } from '../utils/EventBus';
import type { IChatRepository } from '../interfaces/IChatRepository';
import type { ISubjectRepository } from '../interfaces/ISubjectRepository';

interface RoomMessages {
  [roomId: string]: Message[];
}

interface RoomUsers {
  [roomId: string]: User[];
}

export const useMultiRoomChat = () => {
  // Estados
  const [messages, setMessages] = useState<RoomMessages>({});
  const [users, setUsers] = useState<RoomUsers>({});
  const [activeRooms, setActiveRooms] = useState<SubjectRoom[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userName, setUserName] = useState('');
  const [encryptionStatus, setEncryptionStatus] = useState({
    enabled: true,
    lastCleanup: null as null | { timestamp: Date, count: number }
  });

  // Repositorios desacoplados
  const chatRepository: IChatRepository = RepositoryFactory.getChatRepository();
  const subjectRepository: ISubjectRepository = RepositoryFactory.getSubjectRepository();
  const eventBus = EventBus.getInstance();

  // Configurar listeners del Event Bus
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Escuchar mensajes del chat
    unsubscribers.push(
      eventBus.on(EventBus.Events.CHAT_MESSAGE_RECEIVED, ({ message, roomId }: { message: Message, roomId: string }) => {
        setMessages(prev => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), message]
        }));
      })
    );

    // Escuchar actualizaciones de usuarios
    unsubscribers.push(
      eventBus.on(EventBus.Events.CHAT_USERS_UPDATED, ({ users: roomUsers, roomId }: { users: User[], roomId: string }) => {
        setUsers(prev => ({
          ...prev,
          [roomId]: roomUsers
        }));
      })
    );

    // Escuchar cambios de conexión
    unsubscribers.push(
      eventBus.on(EventBus.Events.CHAT_CONNECTION_CHANGED, ({ status }: { status: boolean }) => {
        setIsConnected(status);
        setIsConnecting(false);
      })
    );

    // Escuchar cuando se une a una sala
    unsubscribers.push(
      eventBus.on(EventBus.Events.CHAT_ROOM_JOINED, ({ room }: { room: SubjectRoom }) => {
        setActiveRooms(prev => [...prev, room]);
      })
    );

    // Escuchar cuando se sale de una sala
    unsubscribers.push(
      eventBus.on(EventBus.Events.CHAT_ROOM_LEFT, ({ roomId }: { roomId: string }) => {
        setActiveRooms(prev => prev.filter(room => `subject-${room.subject.id}` !== roomId));
      })
    );

    return () => {
      // Limpiar todos los listeners
      unsubscribers.forEach(unsubscriber => unsubscriber());
      chatRepository.disconnect();
    };
  }, [chatRepository, subjectRepository, eventBus]);

  const connect = async (name?: string) => {
    if (!isConnected && !isConnecting) {
      setIsConnecting(true);
      
      if (name) {
        setUserName(name);
      }

      const success = await chatRepository.connect(name || userName);
      
      if (success) {
        setUserName(chatRepository.getUserName());
        setEncryptionStatus(prev => ({
          ...prev,
          enabled: chatRepository.isEncryptionEnabled()
        }));
        
        // Reconectar a las salas anteriores
        const previousRooms = subjectRepository.getJoinedRooms();
        for (const room of previousRooms) {
          await joinRoom(room.subject);
        }
      }

      return success;
    }
    return false;
  };

  const disconnect = useCallback(() => {
    chatRepository.disconnect();
    setMessages({});
    setUsers({});
    setActiveRooms([]);
  }, [chatRepository]);

  const sendMessage = async (message: string, roomId: string): Promise<boolean> => {
    if (!isConnected) return false;
    return await chatRepository.sendMessage(message, roomId);
  };

  const joinRoom = async (subject: Subject): Promise<boolean> => {
    if (!isConnected) return false;
    return await chatRepository.joinSubjectRoom(subject);
  };

  const leaveRoom = (subjectId: string): boolean => {
    if (!isConnected) return false;
    return chatRepository.leaveSubjectRoom(subjectId);
  };

  const clearHistory = (roomId?: string) => {
    try {
      if (roomId) {
        setMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[roomId];
          return newMessages;
        });
      } else {
        setMessages({});
      }
      return true;
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      return false;
    }
  };

  const getAvailableSubjects = useCallback(() => {
    return subjectRepository.getAllSubjects();
  }, [subjectRepository]);

  const getRoomUsers = useCallback((roomId: string) => {
    return users[roomId] || [];
  }, [users]);

  const getRoomMessages = useCallback((roomId: string) => {
    return messages[roomId] || [];
  }, [messages]);

  return {
    messages,
    users,
    activeRooms,
    isConnected,
    isConnecting,
    userName,
    encryptionStatus,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    clearHistory,
    getAvailableSubjects,
    getRoomUsers,
    getRoomMessages
  };
};
