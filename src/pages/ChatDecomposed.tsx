import React, { useState, useEffect } from 'react';
import { useMultiRoomChat } from '../hooks/useMultiRoomChat';
import { useChatStore } from '../stores/chatStore';
import type { SubjectRoom } from '../types/subject';
import SecurityInfoModal from '../components/SecurityInfoModal';
import ChatRoomList from '../components/ChatRoomList';
import UserRegistration from '../components/UserRegistration';
import ContactsList from '../components/ContactsList';
import PrivateRoomsManager from '../components/PrivateRoomsManager';
import CreatePrivateRoom from '../components/CreatePrivateRoom';
import QuickPrivateRoomModal from '../components/QuickPrivateRoomModal';

// New decomposed components
import ChatHeader from '../components/chat/ChatHeader';
import MessageArea from '../components/chat/MessageArea';
import MessageInput from '../components/chat/MessageInput';
import SidebarNavigation from '../components/chat/SidebarNavigation';

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
  const [showSecurityInfoModal, setShowSecurityInfoModal] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState<'subjects' | 'contacts' | 'private-rooms'>('subjects');
  const [showCreatePrivateRoom, setShowCreatePrivateRoom] = useState(false);
  const [showQuickPrivateRoom, setShowQuickPrivateRoom] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [currentPrivateRoom, setCurrentPrivateRoom] = useState<string | null>(null);

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
  const handleSendMessage = async (message: string) => {
    if (message.trim() && isConnected) {
      try {
        if (currentPrivateRoom) {
          // Enviar mensaje a sala privada (simulado)
          const privateMessages = JSON.parse(localStorage.getItem('upn-private-messages') || '{}');
          const roomMessages = privateMessages[currentPrivateRoom] || [];
          
          const newMsg = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: message.trim(),
            user: userDisplayName,
            timestamp: new Date(),
            isOwn: true,
            encrypted: true
          };
          
          roomMessages.push(newMsg);
          privateMessages[currentPrivateRoom] = roomMessages;
          localStorage.setItem('upn-private-messages', JSON.stringify(privateMessages));
        } else if (selectedRoom) {
          // Enviar mensaje a sala de asignatura
          await sendMessage(message.trim(), selectedRoom.subject.roomId);
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    }
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

  const handleClearHistory = () => {
    if (currentPrivateRoom) {
      // Limpiar mensajes de sala privada
      const privateMessages = JSON.parse(localStorage.getItem('upn-private-messages') || '{}');
      delete privateMessages[currentPrivateRoom];
      localStorage.setItem('upn-private-messages', JSON.stringify(privateMessages));
      window.location.reload(); // Forzar refresh para mostrar mensajes limpiados
    } else if (selectedRoom) {
      clearHistory(selectedRoom.subject.roomId);
    }
  };

  const privateRoomInfo = getPrivateRoomInfo();
  const currentMessages = currentPrivateRoom 
    ? getPrivateRoomMessages() 
    : (selectedRoom ? messages[selectedRoom.subject.roomId] || [] : []);

  // Preparar datos para el header
  const currentRoom = currentPrivateRoom && privateRoomInfo ? {
    name: privateRoomInfo.name,
    type: 'private' as const,
    memberCount: privateRoomInfo.members.length,
    isPrivate: true
  } : selectedRoom ? {
    name: selectedRoom.subject.name,
    type: 'subject' as const,
    memberCount: users[selectedRoom.subject.roomId]?.length || 0,
    isPrivate: false
  } : undefined;

  return (
    <div>
      {/* Mostrar registro si el usuario no está registrado */}
      {!isUserRegistered ? (
        <UserRegistration onUserRegistered={handleUserRegistration} />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {/* Panel lateral con navegación */}
          <div className="col-span-1">
            <SidebarNavigation
              currentView={currentView}
              onViewChange={setCurrentView}
              currentPrivateRoom={currentPrivateRoom}
              onBackToPrivateRooms={() => setCurrentPrivateRoom(null)}
              privateRoomInfo={privateRoomInfo}
            />

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
          </div>

          {/* Chat principal */}
          <div className="col-span-3 bg-white shadow rounded-lg overflow-hidden flex flex-col h-[calc(100vh-theme(spacing.32))]">
            {/* Header con info de sala */}            <ChatHeader
              currentRoom={currentRoom}
              connectionStatus={{ isConnected, isConnecting }}
              encryptionStatus={{
                enabled: encryptionStatus.enabled,
                lastCleanup: encryptionStatus.lastCleanup ? {
                  timestamp: encryptionStatus.lastCleanup.timestamp
                } : undefined
              }}
              userDisplayName={userDisplayName}
              onLogout={handleLogout}
              onClearHistory={handleClearHistory}
            />

            {/* Área de mensajes */}
            <MessageArea
              messages={currentMessages}
              currentUserName={userDisplayName}
              isPrivateRoom={!!currentPrivateRoom}
            />

            {/* Input de mensajes */}
            <MessageInput
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
              placeholder={currentPrivateRoom 
                ? "Escribe un mensaje privado..."
                : selectedRoom 
                ? `Mensaje en ${selectedRoom.subject.name}...`
                : "Selecciona una sala para chatear..."
              }
              disabled={!selectedRoom && !currentPrivateRoom}
            />
          </div>
        </div>
      )}

      {/* Modales */}      {showSecurityInfoModal && (
        <SecurityInfoModal 
          isOpen={showSecurityInfoModal}
          onClose={() => setShowSecurityInfoModal(false)} 
          isEncryptionEnabled={encryptionStatus.enabled}
        />
      )}

      {showCreatePrivateRoom && (        <CreatePrivateRoom 
          userEmail={userEmail}
          onClose={() => setShowCreatePrivateRoom(false)}
          onRoomCreated={(room) => handlePrivateRoomCreated(room.id)}
        />
      )}

      {showQuickPrivateRoom && (        <QuickPrivateRoomModal 
          isOpen={showQuickPrivateRoom}
          currentUserEmail={userEmail}
          prefilledEmail={prefilledEmail}
          onClose={() => setShowQuickPrivateRoom(false)}
          onRoomCreated={(roomId: string) => handlePrivateRoomCreated(roomId)}
        />
      )}
    </div>
  );
};

export default Chat;
