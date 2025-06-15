import React, { useState, useEffect, useRef } from 'react';
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  WifiIcon,
  XCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useMultiRoomChat } from '../hooks/useMultiRoomChat';
import { useChatStore } from '../stores/chatStore';
// import { useUserStore } from '../stores/userStore'; // Will be used later
import type { SubjectRoom } from '../types/subject';
import type { Message } from '../types/chat';
import SecurityInfoModal from '../components/SecurityInfoModal';
import EncryptionIndicator from '../components/EncryptionIndicator';
import ChatRoomList from '../components/ChatRoomList';
import UserRegistration from '../components/UserRegistration';
import ContactsList from '../components/ContactsList';
import PrivateRoomsManager from '../components/PrivateRoomsManager';
import CreatePrivateRoom from '../components/CreatePrivateRoom';
import QuickPrivateRoomModal from '../components/QuickPrivateRoomModal';

const Chat: React.FC = () => {
  const {
    messages,
    users,
    isConnected,
    isConnecting,
    encryptionStatus,
    connect,
    joinRoom,
    sendMessage,
    clearHistory
  } = useMultiRoomChat();
  const { selectedRoom } = useChatStore();
  // const { isAuthenticated, user } = useUserStore(); // Commented out for now
  const [newMessage, setNewMessage] = useState('');
  const [showSecurityInfoModal, setShowSecurityInfoModal] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState<'subjects' | 'contacts' | 'private-rooms'>('subjects');
  const [showCreatePrivateRoom, setShowCreatePrivateRoom] = useState(false);
  const [showQuickPrivateRoom, setShowQuickPrivateRoom] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [currentPrivateRoom, setCurrentPrivateRoom] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verificar si el usuario ya está registrado al cargar el componente
  useEffect(() => {
    const savedEmail = localStorage.getItem('upn-chat-email');
    const savedDisplayName = localStorage.getItem('upn-chat-displayname');
    
    if (savedEmail && savedDisplayName) {
      setIsUserRegistered(true);
      setUserDisplayName(savedDisplayName);
      setUserEmail(savedEmail);
    }
  }, []);

  // Función para manejar el registro del usuario
  const handleUserRegistration = (displayName: string) => {
    const email = localStorage.getItem('upn-chat-email') || '';
    setIsUserRegistered(true);
    setUserDisplayName(displayName);
    setUserEmail(email);
  };

  // Función para cerrar sesión/cambiar usuario
  const handleLogout = () => {
    localStorage.removeItem('upn-chat-email');
    localStorage.removeItem('upn-chat-displayname');
    setIsUserRegistered(false);
    setUserDisplayName('');
    setUserEmail('');
    setCurrentView('subjects');
    setCurrentPrivateRoom(null);
  };

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedRoom?.subject.roomId, currentPrivateRoom]);

  // Conectar al chat si el usuario está registrado
  useEffect(() => {
    if (isUserRegistered && userDisplayName && !isConnected && !isConnecting) {
      connect(userDisplayName);
    }
  }, [isUserRegistered, userDisplayName, isConnected, isConnecting, connect]);

  // Handlers para salas privadas
  const handleCreatePrivateRoom = (invitedEmail: string) => {
    setPrefilledEmail(invitedEmail);
    setShowQuickPrivateRoom(true);
  };

  const handleOpenPrivateRoom = (roomId: string) => {
    setCurrentPrivateRoom(roomId);
    setCurrentView('private-rooms');
  };

  const handlePrivateRoomCreated = (roomId: string) => {
    setCurrentPrivateRoom(roomId);
    setCurrentView('private-rooms');
    setShowCreatePrivateRoom(false);
    setShowQuickPrivateRoom(false);
  };

  // Cuando se selecciona una sala de asignatura
  const handleRoomSelect = async (room: SubjectRoom) => {
    if (isConnected) {
      setCurrentPrivateRoom(null);
      await joinRoom(room.subject);
    }
  };

  // Manejar envío de mensajes
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      try {
        let success = false;
        
        if (currentPrivateRoom) {
          // Enviar mensaje a sala privada (simulado)
          const privateMessages = JSON.parse(localStorage.getItem('upn-private-messages') || '{}');
          const roomMessages = privateMessages[currentPrivateRoom] || [];
          
          const newMsg = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: newMessage.trim(),
            user: userDisplayName,
            timestamp: new Date(),
            isOwn: true,
            encrypted: true
          };
          
          roomMessages.push(newMsg);
          privateMessages[currentPrivateRoom] = roomMessages;
          localStorage.setItem('upn-private-messages', JSON.stringify(privateMessages));
          success = true;
        } else if (selectedRoom) {
          // Enviar mensaje a sala de asignatura
          success = await sendMessage(newMessage.trim(), selectedRoom.subject.roomId);
        }
        
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

  // Obtener mensajes de sala privada
  const getPrivateRoomMessages = () => {
    if (!currentPrivateRoom) return [];
    const privateMessages = JSON.parse(localStorage.getItem('upn-private-messages') || '{}');
    return privateMessages[currentPrivateRoom] || [];
  };

  // Obtener info de sala privada
  const getPrivateRoomInfo = () => {
    if (!currentPrivateRoom) return null;
    const rooms = JSON.parse(localStorage.getItem('upn-private-rooms') || '[]');
    return rooms.find((room: any) => room.id === currentPrivateRoom);
  };

  const ConnectionIcon = getConnectionIcon();
  const privateRoomInfo = getPrivateRoomInfo();
  const currentMessages = currentPrivateRoom 
    ? getPrivateRoomMessages() 
    : (selectedRoom ? messages[selectedRoom.subject.roomId] || [] : []);

  return (
    <div>
      {/* Mostrar registro si el usuario no está registrado */}
      {!isUserRegistered ? (
        <UserRegistration onUserRegistered={handleUserRegistration} />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {/* Panel lateral */}
          <div className="col-span-1 space-y-4">
            {/* Selector de vista */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentView('subjects');
                    setCurrentPrivateRoom(null);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'subjects' && !currentPrivateRoom
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Asignaturas
                </button>
                <button
                  onClick={() => {
                    setCurrentView('contacts');
                    setCurrentPrivateRoom(null);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'contacts'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UsersIcon className="h-5 w-5 mr-2" />
                  Contactos
                </button>
                <button
                  onClick={() => {
                    setCurrentView('private-rooms');
                    setCurrentPrivateRoom(null);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'private-rooms'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Salas Privadas
                </button>
              </div>
            </div>

            {/* Contenido según la vista */}
            {currentView === 'subjects' && !currentPrivateRoom && (
              <ChatRoomList onRoomSelect={handleRoomSelect} />
            )}
            
            {currentView === 'contacts' && (
              <ContactsList
                currentUserEmail={userEmail}
                onCreatePrivateRoom={handleCreatePrivateRoom}
                onOpenPrivateRoom={handleOpenPrivateRoom}
                onCreateNewPrivateRoom={() => setShowCreatePrivateRoom(true)}
              />
            )}

            {currentView === 'private-rooms' && !currentPrivateRoom && (
              <div className="space-y-4">
                <PrivateRoomsManager
                  currentUserEmail={userEmail}
                  onRoomSelect={handleOpenPrivateRoom}
                  onCreateRoom={() => setShowCreatePrivateRoom(true)}
                />
              </div>
            )}

            {/* Info de sala privada actual */}
            {currentPrivateRoom && privateRoomInfo && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <LockClosedIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-medium text-purple-900">Sala Privada</h4>
                </div>
                <p className="text-sm text-purple-700 mb-2">{privateRoomInfo.name}</p>
                <p className="text-xs text-purple-600">
                  {privateRoomInfo.members.length} miembros
                </p>
                <button
                  onClick={() => setCurrentPrivateRoom(null)}
                  className="mt-3 text-xs text-purple-600 hover:text-purple-800 underline"
                >
                  ← Volver a salas privadas
                </button>
              </div>
            )}
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
                      {currentPrivateRoom && privateRoomInfo
                        ? privateRoomInfo.name
                        : selectedRoom 
                        ? selectedRoom.subject.name 
                        : `Chat Académico - ${userDisplayName}`
                      }
                    </h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center ${getConnectionColor()}`}>
                      <ConnectionIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">{getConnectionText()}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
                      title="Cambiar usuario"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                      Cambiar usuario
                    </button>
                  </div>
                </div>

                {/* Información de conexión/sala */}
                {isConnected && (selectedRoom || currentPrivateRoom) && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-600">
                      {currentPrivateRoom && privateRoomInfo ? (
                        <>
                          Sala: <span className="font-medium">{privateRoomInfo.name}</span>
                          {' · '}
                          <span className="font-medium">{privateRoomInfo.members.length} miembros</span>
                          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            PRIVADA
                          </span>
                        </>
                      ) : selectedRoom ? (
                        <>
                          Sala: <span className="font-medium">{selectedRoom.subject.name}</span>
                          {' · '}
                          <span className="font-medium">{users[selectedRoom.subject.roomId]?.length || 0} participantes</span>
                        </>
                      ) : null}
                    </p>
                    <div className="flex items-center space-x-3">
                      <EncryptionIndicator
                        isEnabled={encryptionStatus.enabled}
                        timestamp={encryptionStatus.lastCleanup?.timestamp || new Date()}
                        count={currentPrivateRoom 
                          ? (privateRoomInfo?.members.length || 0)
                          : (users[selectedRoom?.subject.roomId || '']?.length || 0)
                        }
                      />
                      <div
                        className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-primary-600"
                        onClick={() => {
                          if (currentPrivateRoom) {
                            // Limpiar mensajes de sala privada
                            const privateMessages = JSON.parse(localStorage.getItem('upn-private-messages') || '{}');
                            delete privateMessages[currentPrivateRoom];
                            localStorage.setItem('upn-private-messages', JSON.stringify(privateMessages));
                            window.location.reload(); // Forzar refresh para mostrar mensajes limpiados
                          } else if (selectedRoom) {
                            clearHistory(selectedRoom.subject.roomId);
                          }
                        }}
                        title="Limpiar historial de esta sala"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentMessages.map((message: Message) => (
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
                      <span>{formatTime(new Date(message.timestamp))}</span>
                      {(message.encrypted || currentPrivateRoom) && (
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
                  placeholder={
                    isConnected && (selectedRoom || currentPrivateRoom)
                      ? "Escribe tu mensaje..." 
                      : "Selecciona una sala para enviar mensajes"
                  }
                  maxLength={500}
                  disabled={!isConnected || (!selectedRoom && !currentPrivateRoom)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected || (!selectedRoom && !currentPrivateRoom)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Modales */}
          <SecurityInfoModal
            isOpen={showSecurityInfoModal}
            onClose={() => setShowSecurityInfoModal(false)}
            isEncryptionEnabled={encryptionStatus.enabled}
          />

          {showCreatePrivateRoom && (
            <CreatePrivateRoom
              userEmail={userEmail}
              onRoomCreated={(room) => handlePrivateRoomCreated(room.id)}
              onClose={() => setShowCreatePrivateRoom(false)}
            />
          )}

          <QuickPrivateRoomModal
            isOpen={showQuickPrivateRoom}
            onClose={() => {
              setShowQuickPrivateRoom(false);
              setPrefilledEmail('');
            }}
            currentUserEmail={userEmail}
            prefilledEmail={prefilledEmail}
            onRoomCreated={handlePrivateRoomCreated}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
