import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const FloatingAIButton: React.FC = () => {
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);  const [messages, setMessages] = useState<{id: number, text: string, isBot: boolean}[]>([
    {
      id: 1,
      text: "¡Hola! Soy alAI 🤖 Tu asistente inteligente de UpnAssist. Aunque todavía estoy esperando a que Xabi termine su doctorado para estar completamente implementado... 😅",
      isBot: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const funnyResponses = [
    "🎓 Soy alAI, esperando a que Xabi termine su doctorado para poder ayudarte mejor. Mientras tanto, ¿has probado apagar y encender la universidad? 😄",
    "🤔 Mi base de conocimientos alAI está en pausa hasta que Xabi defienda su tesis. Pero puedo confirmar que el café de la cafetería sigue siendo malo.",
    "⏳ Soy alAI en modo 'estudiante de doctorado': mucho café, poco sueño, y esperando que Xabi termine para activar mis funciones completas.",
    "🧠 Mi sistema alAI está programado para activarse cuando Xabi obtenga su título. Mientras tanto, ¿sabías que 'debugging' significa literalmente 'quitar bichos'?",
    "📚 Soy alAI leyendo todos los papers de Xabi para prepararme. Spoiler: hay muchos y muy complicados. ¿Tú entiendes machine learning?",
    "🎯 alAI - Función principal: Ayudar con UpnAssist. Estado actual: Esperando el doctorado de Xabi. Nivel de ansiedad: Igual que el de Xabi.",
    "🤖 alAI Error 404: Doctorado not found. Por favor, contacte con Xabi para resolverlo. Mientras tanto, ¿necesitas ayuda para encontrar el aula?",
    "☕ Mi algoritmo alAI está optimizado para: 1) Esperar 2) Tomar café 3) Hacer bromas 4) Repetir hasta que Xabi termine.",    "🎉 ¡Función experimental alAI activada! Puedo hacer chistes mientras esperamos el doctorado. ¿Por qué los programadores prefieren el modo oscuro? ¡Porque la luz atrae a los bugs!",
    "🔮 Predicción del futuro alAI: Cuando Xabi termine, seré el mejor asistente de UpnAssist. Predicción actual: Seguimos esperando... ⏰"
  ];

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simular respuesta de la IA después de un delay
    setTimeout(() => {
      const randomResponse = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 2000); // Entre 1-3 segundos
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button        onClick={() => setIsAIPopupOpen(true)}        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
        title="alAI - Asistente Inteligente"
      >        <img 
          src="/assets/alai.png" 
          alt="alAI Avatar" 
          className="h-8 w-8 rounded-full object-cover border border-white/20"
        />
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
          IA
        </span>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            alAI • Asistente Inteligente
            <div className="absolute top-full right-4 -mt-1 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </button>

      {/* Popup de alAI - Chat funcional */}
      {isAIPopupOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsAIPopupOpen(false)}
          />
          
          {/* Popup */}
          <div className="fixed right-4 top-4 bottom-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
            {/* Header */}            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center">                <img 
                  src="/assets/alai.png" 
                  alt="alAI Avatar" 
                  className="h-6 w-6 mr-2 rounded-full object-cover border border-white/20"
                />
                <h3 className="text-lg font-semibold">alAI</h3>
              </div>
              <button
                onClick={() => setIsAIPopupOpen(false)}
                className="p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
              {/* Content - Chat Interface */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-purple-600 text-white'
                      }`}
                    >                      {message.isBot && (
                        <div className="flex items-center mb-1">                          <img 
                            src="/assets/alai.png" 
                            alt="alAI" 
                            className="h-4 w-4 mr-1 rounded-full object-cover"
                          />
                          <span className="text-xs font-medium">alAI</span>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregúntale algo a alAI..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </div>                <p className="text-xs text-gray-500 mt-2 text-center">
                  alAI está en desarrollo • Respuestas experimentales
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIButton;
