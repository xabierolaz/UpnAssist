import React, { useEffect, useRef } from 'react';
import { LockClosedIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Message } from '../../types/chat';

interface MessageAreaProps {
  messages: Message[];
  currentUserName: string;
  isPrivateRoom?: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  currentUserName,
  isPrivateRoom = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            {isPrivateRoom ? 'Sala privada lista' : 'Inicio de conversación'}
          </h3>
          <p className="text-sm text-gray-400">
            {isPrivateRoom 
              ? 'Los mensajes están cifrados de extremo a extremo'
              : 'Envía un mensaje para comenzar la conversación'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.user === currentUserName ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.user === currentUserName
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
            }`}
          >
            <div className="flex items-center mb-1">
              {message.user !== currentUserName && (
                <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <span className={`text-xs font-medium ${
                message.user === currentUserName ? 'text-primary-100' : 'text-gray-600'
              }`}>
                {message.user === currentUserName ? 'Tú' : message.user}
              </span>
              {message.encrypted && (
                <LockClosedIcon className={`h-3 w-3 ml-2 ${
                  message.user === currentUserName ? 'text-primary-200' : 'text-gray-400'
                }`} />
              )}
            </div>
            <p className="text-sm leading-relaxed">{message.message}</p>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${
                message.user === currentUserName ? 'text-primary-200' : 'text-gray-500'
              }`}>
                <ClockIcon className="h-3 w-3 inline mr-1" />
                {formatTime(new Date(message.timestamp))}
              </span>
              {message.user === currentUserName && (
                <span className={`text-xs ${
                  message.delivered ? 'text-primary-200' : 'text-primary-300'
                }`}>
                  {message.delivered ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
