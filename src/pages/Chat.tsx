import React, { useState, useEffect, useRef } from 'react';
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  WifiIcon,
  XCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useMultiRoomChat } from '../hooks/useMultiRoomChat';
import { useChatRooms } from '../context/ChatRoomsContext';
import type { SubjectRoom } from '../types/subject';
import type { Message } from '../types/chat';
import SecurityInfoModal from '../components/SecurityInfoModal';
import EncryptionIndicator from '../components/EncryptionIndicator';
import ChatRoomList from '../components/ChatRoomList';

const Chat: React.FC = () => {  const {
    messages,
    users,
    isConnected,
    isConnecting,
    userName,
    encryptionStatus,
    connect,
    joinRoom,
    sendMessage,
    clearHistory
  } = useMultiRoomChat();

  const { selectedRoom } = useChatRooms();
  const [newMessage, setNewMessage] = useState('');
  const [showSecurityInfoModal, setShowSecurityInfoModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedRoom?.subject.roomId]);
  // Conectar al chat si hay nombre de usuario
  useEffect(() => {
    if (userName && !isConnected && !isConnecting) {
      connect(userName);
    }
  }, [userName, isConnected, isConnecting, connect]);

  // Cuando se selecciona una sala
  const handleRoomSelect = async (room: SubjectRoom) => {
    if (isConnected) {
      await joinRoom(room.subject);
    }
  };
  // Manejar envío de mensajes
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected && selectedRoom) {
      try {
        const success = await sendMessage(newMessage.trim(), selectedRoom.subject.roomId);
        if (success) {
          setNewMessage('');
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConnectionIcon = () => {
    if (isConnecting) return ArrowPathIcon;
    if (isConnected) return WifiIcon;
    return XCircleIcon;
  };

  const getConnectionColor = () => {
    if (isConnecting) return 'text-yellow-500';
    if (isConnected) return 'text-green-500';
    return 'text-red-500';
  };

  const getConnectionText = () => {
    if (isConnecting) return 'Conectando...';
    if (isConnected) return 'Conectado';
    return 'Desconectado';
  };

  const ConnectionIcon = getConnectionIcon();

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Lista de salas */}
      <div className="col-span-1">
        <ChatRoomList onRoomSelect={handleRoomSelect} />
      </div>

      {/* Chat principal */}
      <div className="col-span-3 bg-white shadow rounded-lg overflow-hidden flex flex-col h-[calc(100vh-theme(spacing.32))]">
        {/* Header con info de sala */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedRoom ? selectedRoom.subject.name : 'Chat Académico'}
                </h2>
              </div>
              <div className={`flex items-center ${getConnectionColor()}`}>
                <ConnectionIcon className="h-5 w-5 mr-1" />
                <span className="text-sm">{getConnectionText()}</span>
              </div>
            </div>

            {/* Información de conexión/sala */}
            {isConnected && selectedRoom && (
              <div className="flex items-center justify-between mt-2">                <p className="text-sm text-gray-600">
                  Sala: <span className="font-medium">{selectedRoom.subject.name}</span>
                  {' · '}
                  <span className="font-medium">{users[selectedRoom.subject.roomId]?.length || 0} participantes</span>
                </p>
                <div className="flex items-center space-x-3">                  <EncryptionIndicator
                    isEnabled={encryptionStatus.enabled}
                    timestamp={encryptionStatus.lastCleanup?.timestamp || new Date()}
                    count={users[selectedRoom.subject.roomId]?.length || 0}
                  />                  <div
                    className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-primary-600"
                    onClick={() => selectedRoom && clearHistory(selectedRoom.subject.roomId)}
                    title="Limpiar historial de esta sala"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {selectedRoom && messages[selectedRoom.subject.roomId]?.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                {!message.isOwn && (
                  <div className="text-xs font-semibold mb-1 opacity-75">
                    {message.user}
                  </div>
                )}
                <div className="text-sm">{message.message}</div>
                <div className={`text-xs mt-1 flex items-center justify-end ${
                  message.isOwn ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.encrypted && (
                    <LockClosedIcon
                      className={`h-3 w-3 ml-2 ${
                        message.isOwn ? 'text-primary-200' : 'text-gray-400'
                      }`}
                      title="Mensaje cifrado"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensaje */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Escribe tu mensaje..." : "Conecta para enviar mensajes"}
              maxLength={500}
              disabled={!isConnected || !selectedRoom}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected || !selectedRoom}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      <SecurityInfoModal
        isOpen={showSecurityInfoModal}
        onClose={() => setShowSecurityInfoModal(false)}
        isEncryptionEnabled={encryptionStatus.enabled}
      />
    </div>
  );
};

export default Chat;
