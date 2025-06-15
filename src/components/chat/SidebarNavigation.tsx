import React from 'react';
import {
  AcademicCapIcon,
  UsersIcon,
  UserGroupIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface SidebarNavigationProps {
  currentView: 'subjects' | 'contacts' | 'private-rooms';
  onViewChange: (view: 'subjects' | 'contacts' | 'private-rooms') => void;
  currentPrivateRoom?: string | null;
  onBackToPrivateRooms?: () => void;
  privateRoomInfo?: {
    name: string;
    members: any[];
  } | null;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentView,
  onViewChange,
  currentPrivateRoom,
  onBackToPrivateRooms,
  privateRoomInfo
}) => {
  const navigationItems = [
    {
      id: 'subjects' as const,
      label: 'Asignaturas',
      icon: AcademicCapIcon,
      description: 'Salas por materia'
    },
    {
      id: 'contacts' as const,
      label: 'Contactos',
      icon: UsersIcon,
      description: 'Usuarios disponibles'
    },
    {
      id: 'private-rooms' as const,
      label: 'Salas Privadas',
      icon: UserGroupIcon,
      description: 'Conversaciones privadas'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Navigation menu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Navegación</h3>
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id && !currentPrivateRoom;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (item.id !== 'private-rooms' && onBackToPrivateRooms) {
                    onBackToPrivateRooms();
                  }
                }}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current private room info */}
      {currentPrivateRoom && privateRoomInfo && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <LockClosedIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h4 className="font-medium text-purple-900">Sala Privada Activa</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-purple-800">{privateRoomInfo.name}</p>
              <p className="text-xs text-purple-600">
                {privateRoomInfo.members.length} miembros conectados
              </p>
            </div>
            
            <div className="flex items-center text-xs text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              Cifrado de extremo a extremo activo
            </div>
          </div>
          
          {onBackToPrivateRooms && (
            <button
              onClick={onBackToPrivateRooms}
              className="mt-3 w-full text-sm text-purple-600 hover:text-purple-800 underline transition-colors"
            >
              ← Volver a lista de salas privadas
            </button>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Acciones Rápidas</h4>
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-white rounded">
            📝 Crear nueva sala
          </button>
          <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-white rounded">
            👥 Invitar contactos
          </button>
          <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-white rounded">
            🔧 Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
