import React, { useState } from 'react';
import { PaperAirplaneIcon, FaceSmileIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isConnected,
  disabled = false,
  placeholder = "Escribe tu mensaje..."
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = !isConnected || disabled || !message.trim();

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={!isConnected ? "Conectando..." : placeholder}
            disabled={!isConnected || disabled}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-500 text-sm"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              overflowY: message.length > 100 ? 'auto' : 'hidden'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          
          {/* Character counter */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-3 text-xs text-gray-400">
              {message.length}/500
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Emoji button */}
          <button
            type="button"
            disabled={!isConnected || disabled}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            title="Emojis"
            onClick={() => {
              // Simple emoji insertion
              const emojis = ['😊', '👍', '❤️', '😂', '🎉', '👏', '🔥', '💡'];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              setMessage(prev => prev + randomEmoji);
            }}
          >
            <FaceSmileIcon className="h-5 w-5" />
          </button>

          {/* Attachment button */}
          <button
            type="button"
            disabled={!isConnected || disabled}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            title="Adjuntar archivo"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`p-3 rounded-lg transition-all duration-200 ${
              isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 active:scale-95'
            }`}
            title={isDisabled ? 'Escribe un mensaje para enviar' : 'Enviar mensaje'}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Connection status */}
      {!isConnected && (
        <div className="mt-2 flex items-center justify-center">
          <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
            Conectando al chat...
          </div>
        </div>
      )}

      {/* Typing indicator placeholder */}
      <div className="mt-2 min-h-[20px]">
        {/* This could be enhanced to show when other users are typing */}
      </div>
    </div>
  );
};

export default MessageInput;
