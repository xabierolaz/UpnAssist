import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  Squares2X2Icon, 
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import ChatAccessControl from '../ChatAccessControl';

interface QuickActionsProps {
  onOpenChat: () => void;
  onOpenApps: () => void;
  onOpenHelp: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onOpenChat, 
  onOpenApps, 
  onOpenHelp 
}) => {
  const [showChatAccess, setShowChatAccess] = useState(false);

  const openEmail = () => {
    window.open('https://outlook.office.com', '_blank');
  };
  const handleChatClick = () => {
    // Verificar si ya tiene acceso autorizado
    const accessGranted = localStorage.getItem('upn-chat-access-granted');
    const accessTimestamp = localStorage.getItem('upn-chat-access-timestamp');
    
    if (accessGranted === 'true' && accessTimestamp) {
      const now = Date.now();
      const grantedAt = parseInt(accessTimestamp);
      const sessionDuration = parseInt(import.meta.env.VITE_CHAT_SESSION_DURATION_HOURS || '24');
      const hoursElapsed = (now - grantedAt) / (1000 * 60 * 60);
      
      // Si han pasado menos horas que las configuradas, permitir acceso directo
      if (hoursElapsed < sessionDuration) {
        onOpenChat();
        return;
      } else {
        // Limpiar acceso expirado
        localStorage.removeItem('upn-chat-access-granted');
        localStorage.removeItem('upn-chat-access-timestamp');
      }
    }
    
    // Mostrar pantalla de acceso
    setShowChatAccess(true);
  };

  const handleAccessGranted = () => {
    setShowChatAccess(false);
    onOpenChat();
  };

  const actions = [
    {
      id: 'chat',
      title: 'Chat Académico',
      description: 'Comunicación en tiempo real',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
      onClick: handleChatClick
    },
    {
      id: 'apps',
      title: 'Aplicaciones',
      description: 'Herramientas disponibles',
      icon: Squares2X2Icon,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
      onClick: onOpenApps
    },
    {
      id: 'email',
      title: 'Email UPN',
      description: 'Correo institucional',
      icon: EnvelopeIcon,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
      onClick: openEmail,
      external: true
    },
    {
      id: 'help',
      title: 'Ayuda',
      description: 'Guías y soporte',
      icon: QuestionMarkCircleIcon,
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
      iconColor: 'text-amber-600',
      onClick: onOpenHelp
    }
  ];
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Acciones Rápidas</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`${action.color} border-2 rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-md text-left group`}
            >
              <div className="flex items-start justify-between mb-2">
                <action.icon className={`h-8 w-8 ${action.iconColor} group-hover:scale-110 transition-transform`} />
                {action.external && (
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Control de Acceso al Chat */}
      {showChatAccess && (
        <ChatAccessControl
          onAccessGranted={handleAccessGranted}
          onCancel={() => setShowChatAccess(false)}
        />
      )}
    </>
  );
};

export default QuickActions;
