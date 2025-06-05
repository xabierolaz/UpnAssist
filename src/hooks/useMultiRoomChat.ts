/**
 * Hook personalizado para gestionar el chat con múltiples salas
 */

import { useState, useEffect, useCallback } from 'react';
import { Message, User } from '../types';
import { Subject, SubjectRoom } from '../types/subject';
import { multiRoomChatService } from '../services/MultiRoomChatService';
import { subjectService } from '../services/SubjectService';
import { saveMessagesToLocalStorage, getMessagesFromLocalStorage, clearChatHistory } from '../utils/chatStorage';

interface RoomMessages {
  [roomId: string]: Message[];
}

interface RoomUsers {
  [roomId: string]: User[];
}

export const useMultiRoomChat = () => {
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

  // Cargar mensajes del almacenamiento local al inicio
  useEffect(() => {
    const loadMessages = () => {
      const savedMessages = getMessagesFromLocalStorage();
      const messagesByRoom: RoomMessages = {};
      
      savedMessages.forEach(message => {
        const roomId = message.roomId || 'general';
        if (!messagesByRoom[roomId]) {
          messagesByRoom[roomId] = [];
        }
        messagesByRoom[roomId].push(message);
      });

      setMessages(messagesByRoom);
    };

    loadMessages();
    setActiveRooms(subjectService.getJoinedRooms());
  }, []);

  // Configurar los callbacks del servicio de chat
  useEffect(() => {
    multiRoomChatService.onMessage((message: Message, roomId: string) => {
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), message]
      }));
    });

    multiRoomChatService.onUsersUpdate((roomUsers: User[], roomId: string) => {
      setUsers(prev => ({
        ...prev,
        [roomId]: roomUsers
      }));
    });

    multiRoomChatService.onConnectionStatus((status: boolean) => {
      setIsConnected(status);
      setIsConnecting(false);
    });

    multiRoomChatService.onRoomJoined((room: SubjectRoom) => {
      setActiveRooms(prev => [...prev, room]);
    });

    multiRoomChatService.onRoomLeft((roomId: string) => {
      setActiveRooms(prev => prev.filter(room => `subject-${room.subject.id}` !== roomId));
    });

    return () => {
      multiRoomChatService.disconnect();
    };
  }, []);

  // Guardar mensajes en almacenamiento local cuando cambian
  useEffect(() => {
    const allMessages = Object.values(messages).flat();
    if (allMessages.length > 0) {
      saveMessagesToLocalStorage(allMessages);
    }
  }, [messages]);

  const connect = async (name?: string) => {
    if (!isConnected && !isConnecting) {
      setIsConnecting(true);
      
      if (name) {
        setUserName(name);
      }

      const success = await multiRoomChatService.connect(name || userName);
      
      if (success) {
        setUserName(multiRoomChatService.getUserName());
        setEncryptionStatus(prev => ({
          ...prev,
          enabled: multiRoomChatService.isEncryptionEnabled()
        }));
        
        // Reconectar a las salas anteriores
        const previousRooms = subjectService.getJoinedRooms();
        for (const room of previousRooms) {
          await joinRoom(room.subject);
        }
      }

      return success;
    }
    return false;
  };

  const disconnect = useCallback(() => {
    multiRoomChatService.disconnect();
    setMessages({});
    setUsers({});
    setActiveRooms([]);
  }, []);

  const sendMessage = async (message: string, roomId: string): Promise<boolean> => {
    if (!isConnected) return false;
    return await multiRoomChatService.sendMessage(message, roomId);
  };

  const joinRoom = async (subject: Subject): Promise<boolean> => {
    if (!isConnected) return false;
    return await multiRoomChatService.joinSubjectRoom(subject);
  };

  const leaveRoom = (subjectId: string): boolean => {
    if (!isConnected) return false;
    return multiRoomChatService.leaveSubjectRoom(subjectId);
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
        const clearedOk = clearChatHistory();
        if (clearedOk) {
          setMessages({});
        }
      }
      return true;
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      return false;
    }
  };

  const getAvailableSubjects = useCallback(() => {
    return subjectService.getAllSubjects();
  }, []);

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
