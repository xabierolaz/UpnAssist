import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  WifiIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import EncryptionIndicator from '../EncryptionIndicator';

interface ChatHeaderProps {
  currentRoom?: {
    name: string;
    type: 'subject' | 'private';
    memberCount: number;
    isPrivate?: boolean;
  };
  connectionStatus: {
    isConnected: boolean;
    isConnecting: boolean;
  };
  encryptionStatus: {
    enabled: boolean;
    lastCleanup?: {
      timestamp: Date;
    };
  };
  userDisplayName: string;
  onLogout: () => void;
  onClearHistory: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentRoom,
  connectionStatus,
  encryptionStatus,
  userDisplayName,
  onLogout,
  onClearHistory
}) => {
  const getConnectionIcon = () => {
    if (connectionStatus.isConnecting) return ArrowPathIcon;
    if (connectionStatus.isConnected) return WifiIcon;
    return XCircleIcon;
  };

  const getConnectionColor = () => {
    if (connectionStatus.isConnecting) return 'text-yellow-500';
    if (connectionStatus.isConnected) return 'text-green-500';
    return 'text-red-500';
  };

  const getConnectionText = () => {
    if (connectionStatus.isConnecting) return 'Conectando...';
    if (connectionStatus.isConnected) return 'Conectado';
    return 'Desconectado';
  };

  const ConnectionIcon = getConnectionIcon();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              {currentRoom?.name || `Chat Académico - ${userDisplayName}`}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${getConnectionColor()}`}>
              <ConnectionIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">{getConnectionText()}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
              title="Cambiar usuario"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
              Cambiar usuario
            </button>
          </div>
        </div>

        {/* Información de conexión/sala */}
        {connectionStatus.isConnected && currentRoom && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600">
              Sala: <span className="font-medium">{currentRoom.name}</span>
              {' · '}
              <span className="font-medium">{currentRoom.memberCount} {
                currentRoom.type === 'private' ? 'miembros' : 'participantes'
              }</span>
              {currentRoom.isPrivate && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  PRIVADA
                </span>
              )}
            </p>
            <div className="flex items-center space-x-3">
              <EncryptionIndicator
                isEnabled={encryptionStatus.enabled}
                timestamp={encryptionStatus.lastCleanup?.timestamp || new Date()}
                count={currentRoom.memberCount}
              />
              <button
                onClick={onClearHistory}
                className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-primary-600"
                title="Limpiar historial de esta sala"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
