import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ChatBubbleLeftRightIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface ChatAccessControlProps {
  onAccessGranted: () => void;
  onCancel: () => void;
}

const ChatAccessControl: React.FC<ChatAccessControlProps> = ({ onAccessGranted, onCancel }) => {
  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de verificación
    setTimeout(() => {
      if (accessCode === '2580') {
        // Guardar acceso autorizado en localStorage
        localStorage.setItem('upn-chat-access-granted', 'true');
        localStorage.setItem('upn-chat-access-timestamp', Date.now().toString());
        onAccessGranted();
      } else {
        setError('Código de acceso incorrecto');
        setAccessCode('');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full">
              <LockClosedIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Acceso al Chat Académico
          </h2>
          <p className="text-gray-600 text-center text-sm">
            Ingresa el código de acceso para usar el sistema de chat
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Acceso
              </label>
              <div className="relative">
                <input
                  id="accessCode"
                  type={showCode ? 'text' : 'password'}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ingresa el código de 4 dígitos"
                  maxLength={4}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showCode ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !accessCode}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Verificando...
                  </div>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                    Acceder al Chat
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Sistema de Chat Académico</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Comunicación segura para el personal académico de la universidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAccessControl;
