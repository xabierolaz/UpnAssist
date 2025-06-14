import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface Contact {
  email: string;
  displayName: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
}

interface ContactsListProps {
  currentUserEmail: string;
  onCreatePrivateRoom: (invitedEmail: string) => void;
  onOpenPrivateRoom: (roomId: string) => void;
  onCreateNewPrivateRoom: () => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  currentUserEmail, 
  onCreatePrivateRoom,
  onOpenPrivateRoom,
  onCreateNewPrivateRoom
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [privateRooms, setPrivateRooms] = useState<any[]>([]);

  // Simular contactos de UPNA (PDI)
  useEffect(() => {
    const loadContacts = () => {
      // Simular algunos contactos de ejemplo (PDI)
      const mockContacts: Contact[] = [
        {
          email: 'maria.gonzalez@unavarra.es',
          displayName: 'María González',
          status: 'online',
          lastSeen: new Date()
        },
        {
          email: 'jose.martinez@unavarra.es',
          displayName: 'José Martínez',
          status: 'busy',
          lastSeen: new Date(Date.now() - 15 * 60 * 1000) // 15 min ago
        },
        {
          email: 'ana.lopez@unavarra.es',
          displayName: 'Ana López',
          status: 'offline',
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          email: 'carlos.ruiz@unavarra.es',
          displayName: 'Carlos Ruiz',
          status: 'online',
          lastSeen: new Date()
        },
        {
          email: 'laura.sanchez@unavarra.es',
          displayName: 'Laura Sánchez',
          status: 'offline',
          lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        }
      ];

      // Filtrar al usuario actual
      const filteredContacts = mockContacts.filter(
        contact => contact.email !== currentUserEmail
      );

      setContacts(filteredContacts);
      setIsLoading(false);
    };

    loadContacts();
  }, [currentUserEmail]);

  // Cargar salas privadas
  useEffect(() => {
    const loadPrivateRooms = () => {
      const savedRooms = JSON.parse(localStorage.getItem('upn-private-rooms') || '[]');
      const userRooms = savedRooms.filter((room: any) => 
        room.members.includes(currentUserEmail)
      );
      setPrivateRooms(userRooms);
    };

    loadPrivateRooms();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadPrivateRooms, 30000);
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-orange-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Conectado';
      case 'busy': return 'Ocupado';
      case 'offline': return 'Desconectado';
      default: return 'Desconocido';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contactos PDI</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateNewPrivateRoom}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Crear sala privada"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Salas Privadas */}
      {privateRooms.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <LockClosedIcon className="h-4 w-4 mr-2" />
            Salas Privadas ({privateRooms.length})
          </h4>
          <div className="space-y-2">
            {privateRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onOpenPrivateRoom(room.id)}
                className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <LockClosedIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {room.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {room.members.length} miembros
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Contactos */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.email}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="relative">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}
                ></span>
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {contact.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {contact.email}
                </p>
                <p className="text-xs text-gray-400">
                  {getStatusText(contact.status)}
                  {contact.status !== 'online' && contact.lastSeen && (
                    <span> • {formatLastSeen(contact.lastSeen)}</span>
                  )}
                </p>
              </div>

              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onCreatePrivateRoom(contact.email)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Crear sala privada"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-8">
            <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron contactos' : 'No hay contactos disponibles'}
            </p>
          </div>
        )}
      </div>

      {/* Footer con info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Contactos del Personal Docente e Investigador de UPNA
        </p>
      </div>
    </div>
  );
};

export default ContactsList;
