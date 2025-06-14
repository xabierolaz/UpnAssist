import React, { useState } from 'react';
import {
  UserPlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  UsersIcon,
  LockClosedIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface PrivateRoom {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
}

interface CreatePrivateRoomProps {
  userEmail: string;
  onRoomCreated: (room: PrivateRoom) => void;
  onClose: () => void;
}

const CreatePrivateRoom: React.FC<CreatePrivateRoomProps> = ({ 
  userEmail, 
  onRoomCreated, 
  onClose 
}) => {
  const [roomName, setRoomName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@unavarra\.es$/;
    return emailRegex.test(email.toLowerCase());
  };

  const handleAddInvite = () => {
    setError('');
    
    if (!inviteEmail.trim()) {
      setError('Introduce un email válido');
      return;
    }

    if (!validateEmail(inviteEmail)) {
      setError('Formato incorrecto. Usa: nombre.apellido@unavarra.es');
      return;
    }

    if (inviteEmail.toLowerCase() === userEmail.toLowerCase()) {
      setError('No puedes invitarte a ti mismo');
      return;
    }

    if (invitedEmails.includes(inviteEmail.toLowerCase())) {
      setError('Este usuario ya está invitado');
      return;
    }

    setInvitedEmails([...invitedEmails, inviteEmail.toLowerCase()]);
    setInviteEmail('');
  };

  const handleRemoveInvite = (email: string) => {
    setInvitedEmails(invitedEmails.filter(e => e !== email));
  };

  const handleCreateRoom = async () => {
    setError('');
    
    if (!roomName.trim()) {
      setError('El nombre de la sala es obligatorio');
      return;
    }

    if (invitedEmails.length === 0) {
      setError('Debes invitar al menos a una persona');
      return;
    }

    setIsCreating(true);

    try {
      // Crear la sala
      const newRoom: PrivateRoom = {
        id: `private_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: roomName.trim(),
        createdBy: userEmail,
        members: [userEmail, ...invitedEmails],
        createdAt: new Date()
      };

      // Guardar en localStorage
      const existingRooms = JSON.parse(localStorage.getItem('upn-private-rooms') || '[]');
      const updatedRooms = [...existingRooms, newRoom];
      localStorage.setItem('upn-private-rooms', JSON.stringify(updatedRooms));

      // Enviar invitaciones (simulado - en producción sería real)
      console.log(`Sala "${roomName}" creada con invitaciones para:`, invitedEmails);

      onRoomCreated(newRoom);
      onClose();
    } catch (error) {
      setError('Error al crear la sala. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const extractDisplayName = (email: string): string => {
    const localPart = email.split('@')[0];
    const [firstName, lastName] = localPart.split('.');
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <LockClosedIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear Sala Privada</h2>
              <p className="text-sm text-gray-500">Solo para miembros invitados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Nombre de la sala */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Sala
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UsersIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="ej: Coordinación Programación I"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isCreating}
              />
            </div>
          </div>

          {/* Invitar usuarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invitar Colaboradores
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="nombre.apellido@unavarra.es"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInvite()}
                  disabled={isCreating}
                />
              </div>
              <button
                onClick={handleAddInvite}
                disabled={isCreating}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
              >
                <UserPlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Lista de invitados */}
          {invitedEmails.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miembros Invitados ({invitedEmails.length})
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {invitedEmails.map((email) => (
                  <div key={email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{extractDisplayName(email)}</p>
                      <p className="text-sm text-gray-500">{email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveInvite(email)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                      disabled={isCreating}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información sobre privacidad */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start">
              <EyeSlashIcon className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-purple-800 mb-1">
                  Sala Privada
                </h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Solo los miembros invitados pueden ver y acceder</li>
                  <li>• La sala permanece aunque te desconectes</li>
                  <li>• Ideal para coordinadores de asignatura</li>
                  <li>• Los mensajes se cifran localmente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || !roomName.trim() || invitedEmails.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
          >
            {isCreating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creando...
              </div>
            ) : (
              'Crear Sala'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePrivateRoom;
