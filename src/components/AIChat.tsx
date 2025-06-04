import React, { useState, useEffect, useRef } from 'react';
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { aiService } from '../services/AIService';
import type { AIResponse } from '../services/AIService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  source?: 'ollama' | 'openrouter' | 'fallback';
  model?: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [services, setServices] = useState({ ollama: false, openrouter: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar API key existente
    const savedKey = localStorage.getItem('openrouter_api_key');
    if (savedKey) {
      setOpenRouterKey(savedKey);
    }

    // Verificar servicios disponibles
    checkServices();

    // Mensaje de bienvenida
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkServices = async () => {
    const availableServices = await aiService.getAvailableServices();
    setServices(availableServices);
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `¡Hola! Soy AmaIA, tu asistente IA para UpnAssist. Puedo ayudarte con:

🎓 **Funcionalidades de UpnAssist**
• Información sobre las 15 aplicaciones disponibles
• Cómo usar herramientas específicas
• Horarios y ubicaciones de UPN

📱 **Soporte Técnico**
• Cómo imprimir documentos
• Exportar datos a PDF/Excel
• Uso en móviles y tablets

💡 **Consejos y Trucos**
• Mejores prácticas
• Atajos de teclado
• Optimización del flujo de trabajo

¿En qué puedo ayudarte hoy?`,
      isUser: false,
      timestamp: new Date(),
      source: 'fallback'
    };

    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response: AIResponse = await aiService.sendMessage(newMessage.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        source: response.source,
        model: response.model
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.',
        isUser: false,
        timestamp: new Date(),
        source: 'fallback'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    aiService.setOpenRouterKey(openRouterKey);
    setShowSettings(false);
    checkServices();
  };

  const clearChat = () => {
    setMessages([]);
    aiService.clearContext();
    addWelcomeMessage();
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'ollama':
        return <CpuChipIcon className="h-4 w-4 text-green-600" />;
      case 'openrouter':
        return <SparklesIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceText = (source?: string, model?: string) => {
    switch (source) {
      case 'ollama':
        return `Local AI${model ? ` (${model})` : ''}`;
      case 'openrouter':
        return `Cloud AI${model ? ` (${model})` : ''}`;
      default:
        return 'Respuesta inteligente';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Modal de configuración */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Configuración de IA</h3>
            
            {/* Estado de servicios */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Estado de Servicios</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Ollama (Local)</span>
                  {services.ollama ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">OpenRouter (Cloud)</span>
                  {services.openrouter ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Configuración OpenRouter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenRouter API Key (Opcional)
              </label>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtén una gratis en <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">openrouter.ai</a>
              </p>
            </div>

            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h5 className="font-medium text-blue-800 mb-1">Niveles de IA:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Ollama (Local, ilimitado)</li>
                <li>2. OpenRouter (Online, 15k+ tokens/día gratis)</li>
                <li>3. Respuestas inteligentes (Siempre disponible)</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-12rem)] bg-white shadow rounded-lg overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2" />
                AmaIA - UpnAssist
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
                  title="Configuración"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={clearChat}
                  className="px-3 py-1 text-sm bg-primary-500 hover:bg-primary-400 rounded-lg transition-colors"
                >
                  Limpiar Chat
                </button>
              </div>
            </div>
            <p className="text-primary-100 text-sm mt-1">
              Pregúntame sobre UpnAssist, horarios UPN, o cómo usar las herramientas
            </p>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                  
                  {/* Metadata */}
                  <div className={`flex items-center mt-1 space-x-2 text-xs ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-gray-500">{formatTime(message.timestamp)}</span>
                    {!message.isUser && message.source && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          {getSourceIcon(message.source)}
                          <span>{getSourceText(message.source, message.model)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm shadow-sm px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Pregúntame sobre UpnAssist, horarios, herramientas..."
                maxLength={500}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
            
            {/* Input info */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{newMessage.length}/500 caracteres</span>
              <div className="flex items-center space-x-2">
                {services.ollama && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Local AI</span>
                  </span>
                )}
                {services.openrouter && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Cloud AI</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>Smart Fallback</span>
                </span>
              </div>
            </div>

            {/* Sugerencias rápidas */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['¿Cómo imprimir?', '¿Horario de clases?', '¿Aplicaciones disponibles?', '¿Uso en móvil?'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setNewMessage(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
