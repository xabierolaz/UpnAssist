import React, { useState, useEffect, useRef } from 'react';
import {
  PaperAirplaneIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  WifiIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserPlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useChat } from '../hooks/useChat';
import AIChat from '../components/AIChat';

const Chat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'ai'>('realtime');

  return (
    <>
      <div className="space-y-4">
        {/* Pestañas de navegación */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('realtime')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'realtime'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Chat en Tiempo Real
                </div>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ai'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Asistente IA
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Gratis
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'realtime' ? <RealtimeChat /> : <AIChat />}
      </div>
    </>
  );
};

const RealtimeChat: React.FC = () => {
  const {
    messages,
    users,
    isConnected,
    isConnecting,
    userName,
    connect,
    disconnect,
    sendMessage
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');
  const [showNameModal, setShowNameModal] = useState(!userName);
  const [tempUserName, setTempUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = async () => {
    if (tempUserName.trim()) {
      setShowNameModal(false);
      await connect(tempUserName.trim());
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      const success = sendMessage(newMessage.trim());
      if (success) {
        setNewMessage('');
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
    <>
      {/* Modal para nombre de usuario */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Configurar Perfil</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre para el chat:
              </label>
              <input
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                placeholder="Ej: Dr. García, Prof. López..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={30}
                onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setTempUserName('Profesor')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Usar "Profesor"
              </button>
              <button
                onClick={handleConnect}
                disabled={!tempUserName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-16rem)] bg-white shadow rounded-lg overflow-hidden">
        {/* Sidebar with online users */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Online ({users.length})
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {users.length === 0 && isConnected && (
              <div className="text-center text-gray-500 text-sm">
                <UserPlusIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Eres el primero en conectarse</p>
                <p className="text-xs mt-1">Comparte la URL con otros profesores</p>
              </div>
            )}
            
            <ul className="space-y-2">
              {users.map((user, index) => (
                <li key={user.id || index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${user.name === userName ? 'font-semibold text-primary-600' : 'text-gray-700'}`}>
                    {user.name} {user.name === userName && '(tú)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connection status */}
          <div className="p-4 bg-gray-100 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <ConnectionIcon className={`h-4 w-4 ${getConnectionColor()} ${isConnecting ? 'animate-spin' : ''}`} />
              <span className={`text-sm ${getConnectionColor()}`}>
                {getConnectionText()}
              </span>
            </div>
            
            {isConnected && (
              <button
                onClick={disconnect}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Desconectar
              </button>
            )}
            
            {!isConnected && !isConnecting && (
              <button
                onClick={() => setShowNameModal(true)}
                className="text-xs text-primary-600 hover:text-primary-800"
              >
                Reconectar
              </button>
            )}
          </div>
          
          {/* Chat Guidelines */}
          <div className="p-4 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Recordatorio</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Chat público entre profesores. Solo texto plano. Máximo 50 usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-primary-600" />
                Chat Profesorado UPN
              </h2>
              <div className="flex items-center space-x-2">
                <ConnectionIcon className={`h-5 w-5 ${getConnectionColor()} ${isConnecting ? 'animate-spin' : ''}`} />
                <span className={`text-sm ${getConnectionColor()}`}>
                  {getConnectionText()}
                </span>
              </div>
            </div>
            {userName && (
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600">
                  Conectado como: <span className="font-medium">{userName}</span>
                </p>
                {isConnected && (
                  <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    <span>{users.length} usuarios conectados</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isConnected && !isConnecting && (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bienvenido al Chat UPN</h3>
                <p className="text-gray-500 mb-6">Conecta para chatear con otros profesores en tiempo real</p>
                
                {/* Instrucciones para uso entre dispositivos */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Chat Multi-Dispositivo</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Funciona entre PC y móviles</li>
                    <li>• No requiere cuentas ni instalaciones</li>
                    <li>• Conexión automática por internet</li>
                    <li>• Máximo 50 usuarios simultáneos</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => setShowNameModal(true)}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  🚀 Conectar al Chat
                </button>
              </div>
            )}

            {isConnecting && (
              <div className="text-center py-12">
                <ArrowPathIcon className="h-8 w-8 mx-auto text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600">Conectando al servidor...</p>
              </div>
            )}

            {isConnected && messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay mensajes aún. ¡Sé el primero en escribir algo!</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {!message.isOwn && (
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {message.user}
                    </div>
                  )}
                  <div className="text-sm">{message.message}</div>
                  <div className={`text-xs mt-1 ${message.isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isConnected ? "Escribe tu mensaje..." : "Conecta para enviar mensajes"}
                maxLength={500}
                disabled={!isConnected}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500">
              {newMessage.length}/500 caracteres {!isConnected && '• Conecta para enviar mensajes'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
