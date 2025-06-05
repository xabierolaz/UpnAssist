import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../services/ChatService';
import type { Message, User } from '../types/chat';
import type { Subject } from '../types/subject';

interface RoomMessages {
  [roomId: string]: Message[];
}

interface RoomUsers {
  [roomId: string]: User[];
}

export const useMultiRoomChat = (initialUserName: string = '') => {
  const [messages, setMessages] = useState<RoomMessages>({});
  const [users, setUsers] = useState<RoomUsers>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [encryptionStatus, setEncryptionStatus] = useState({
    enabled: false,
    lastCleanup: new Date()
  });

  const chatServiceRef = useRef<ChatService | null>(null);

  useEffect(() => {
    // Inicializar el servicio de chat
    if (!chatServiceRef.current) {
      chatServiceRef.current = new ChatService();
      initializeChatService();
    }

    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect();
      }
    };
  }, []);

  const initializeChatService = () => {
    if (!chatServiceRef.current) return;

    chatServiceRef.current.onMessage((message: Message, roomId: string) => {
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), message]
      }));
    });

    chatServiceRef.current.onUsersUpdate((updatedUsers: User[], roomId: string) => {
      setUsers(prev => ({
        ...prev,
        [roomId]: updatedUsers
      }));
    });

    chatServiceRef.current.onConnectionStatus((status: boolean) => {
      setIsConnected(status);
      setIsConnecting(false);
    });
  };

  const connect = async (name?: string): Promise<boolean> => {
    if (!chatServiceRef.current) return false;
    
    setIsConnecting(true);
    try {
      const success = await chatServiceRef.current.connect(name || userName);
      if (success) {
        setUserName(chatServiceRef.current.getUserName());
        setEncryptionStatus(prev => ({
          ...prev,
          enabled: chatServiceRef.current?.isEncryptionEnabled() || false
        }));
      }
      return success;
    } catch (error) {
      console.error('Error al conectar:', error);
      setIsConnecting(false);
      return false;
    }
  };

  const disconnect = () => {
    if (chatServiceRef.current) {
      chatServiceRef.current.disconnect();
    }
  };

  const joinRoom = async (subject: Subject): Promise<boolean> => {
    if (!chatServiceRef.current || !isConnected) return false;

    const roomId = `subject-${subject.id}`;
    const success = await chatServiceRef.current.joinRoom(subject);
    
    if (success) {
      setCurrentRoomId(roomId);
      // Inicializar arreglos vacíos para la nueva sala si no existen
      setMessages(prev => ({
        ...prev,
        [roomId]: prev[roomId] || []
      }));
      setUsers(prev => ({
        ...prev,
        [roomId]: prev[roomId] || []
      }));
    }

    return success;
  };

  const leaveRoom = (roomId: string) => {
    if (!chatServiceRef.current || !isConnected) return;

    chatServiceRef.current.leaveRoom(roomId);
    if (currentRoomId === roomId) {
      setCurrentRoomId(null);
    }
  };

  const sendMessage = async (message: string): Promise<boolean> => {
    if (!chatServiceRef.current || !isConnected) return false;
    return await chatServiceRef.current.sendMessage(message);
  };

  const changeUserName = (newName: string) => {
    if (chatServiceRef.current) {
      setUserName(newName);
      chatServiceRef.current.setUserName(newName);
    }
  };

  const refreshUserList = (roomId: string) => {
    if (!chatServiceRef.current || !isConnected) return;
    chatServiceRef.current.requestUserList(roomId);
  };

  const clearHistory = (roomId: string) => {
    setMessages(prev => ({
      ...prev,
      [roomId]: []
    }));
  };

  return {
    messages,
    users,
    isConnected,
    isConnecting,
    userName,
    currentRoomId,
    encryptionStatus,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    changeUserName,
    refreshUserList,
    clearHistory
  };
};
