import React, { useState, useEffect } from 'react';
import {
  LockClosedIcon,
  UsersIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface PrivateRoom {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
  lastActivity?: Date;
}

interface PrivateRoomsManagerProps {
  currentUserEmail: string;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: () => void;
}

const PrivateRoomsManager: React.FC<PrivateRoomsManagerProps> = ({
  currentUserEmail,
  onRoomSelect,
  onCreateRoom
}) => {
  const [privateRooms, setPrivateRooms] = useState<PrivateRoom[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadPrivateRooms();
  }, [currentUserEmail]);

  const loadPrivateRooms = () => {
    const savedRooms = JSON.parse(localStorage.getItem('upn-private-rooms') || '[]');
    const userRooms = savedRooms
      .filter((room: any) => room.members.includes(currentUserEmail))
      .map((room: any) => ({
        ...room,
        createdAt: new Date(room.createdAt),
        lastActivity: room.lastActivity ? new Date(room.lastActivity) : undefined
      }))
      .sort((a: any, b: any) => {
        // Ordenar por última actividad, luego por fecha de creación
        const aTime = a.lastActivity || a.createdAt;
        const bTime = b.lastActivity || b.createdAt;
        return bTime.getTime() - aTime.getTime();
      });
    
    setPrivateRooms(userRooms);
  };

  const extractDisplayName = (email: string): string => {
    const localPart = email.split('@')[0];
    const [firstName, lastName] = localPart.split('.');
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  };

  const handleDeleteRoom = (roomId: string) => {
    const savedRooms = JSON.parse(localStorage.getItem('upn-private-rooms') || '[]');
    const updatedRooms = savedRooms.filter((room: any) => room.id !== roomId);
    localStorage.setItem('upn-private-rooms', JSON.stringify(updatedRooms));
    
    // También limpiar mensajes de la sala
    const savedMessages = JSON.parse(localStorage.getItem('upn-chat-messages') || '{}');
    if (savedMessages[roomId]) {
      delete savedMessages[roomId];
      localStorage.setItem('upn-chat-messages', JSON.stringify(savedMessages));
    }
    
    loadPrivateRooms();
    setShowDeleteConfirm(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  const isRoomCreator = (room: PrivateRoom) => {
    return room.createdBy === currentUserEmail;
  };

  if (privateRooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-4">
          <LockClosedIcon className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tienes salas privadas
        </h3>
        <p className="text-gray-500 mb-6">
          Crea tu primera sala privada para colaborar con otros docentes
        </p>
        <button
          onClick={onCreateRoom}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Primera Sala
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <LockClosedIcon className="h-6 w-6 text-purple-600 mr-2" />
          Salas Privadas
        </h2>
        <button
          onClick={onCreateRoom}
          className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nueva Sala
        </button>
      </div>

      {/* Lista de salas */}
      <div className="grid gap-4">
        {privateRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-2">
                      {room.name}
                    </h3>
                    {isRoomCreator(room) && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        Creador
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    <span>{room.members.length} miembros</span>
                    <span className="mx-2">•</span>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>
                      {room.lastActivity 
                        ? `Última actividad: ${formatDate(room.lastActivity)}`
                        : `Creada: ${formatDate(room.createdAt)}`
                      }
                    </span>
                  </div>

                  {/* Miembros */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Miembros:</p>
                    <div className="flex flex-wrap gap-2">
                      {room.members.slice(0, 3).map((email) => (
                        <div key={email} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <UserIcon className="h-3 w-3 text-gray-500 mr-1" />
                          <span className="text-xs text-gray-700">
                            {email === currentUserEmail ? 'Tú' : extractDisplayName(email)}
                          </span>
                        </div>
                      ))}
                      {room.members.length > 3 && (
                        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-xs text-gray-500">
                            +{room.members.length - 3} más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2 ml-4">
                  {isRoomCreator(room) && (
                    <button
                      onClick={() => setShowDeleteConfirm(room.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar sala"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Botón de acceso */}
              <button
                onClick={() => onRoomSelect(room.id)}
                className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                Acceder a la Sala
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Eliminar Sala Privada
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar esta sala? Esta acción no se puede deshacer 
                y se perderán todos los mensajes.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteRoom(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Eliminar Sala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateRoomsManager;
