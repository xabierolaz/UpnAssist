import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../services/ChatService';
import type { Message, User } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userName, setUserName] = useState('');
  
  const chatServiceRef = useRef<ChatService | null>(null);

  useEffect(() => {
    // Inicializar el servicio de chat
    chatServiceRef.current = new ChatService();

    // Configurar callbacks
    chatServiceRef.current.onMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    chatServiceRef.current.onUsersUpdate((userList: User[]) => {
      setUsers(userList);
    });

    chatServiceRef.current.onConnectionStatus((status: boolean) => {
      setIsConnected(status);
      setIsConnecting(false);
    });

    // Cleanup al desmontar el componente
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect();
      }
    };
  }, []);

  const connect = async (name?: string) => {
    if (!chatServiceRef.current || isConnected || isConnecting) return false;

    setIsConnecting(true);
    
    if (name) {
      setUserName(name);
    }

    try {
      const success = await chatServiceRef.current.connect(name || userName);
      if (success) {
        setUserName(chatServiceRef.current.getUserName());
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
    setMessages([]);
    setUsers([]);
  };

  const sendMessage = (message: string): boolean => {
    if (!chatServiceRef.current || !isConnected) return false;
    return chatServiceRef.current.sendMessage(message);
  };

  const changeUserName = (newName: string) => {
    if (chatServiceRef.current) {
      chatServiceRef.current.setUserName(newName);
      setUserName(newName);
    }
  };

  return {
    messages,
    users,
    isConnected,
    isConnecting,
    userName,
    connect,
    disconnect,
    sendMessage,
    changeUserName
  };
};
