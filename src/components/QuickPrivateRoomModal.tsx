import React, { useState } from 'react';
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface QuickPrivateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string;
  prefilledEmail?: string;
  onRoomCreated: (roomId: string) => void;
}

const QuickPrivateRoomModal: React.FC<QuickPrivateRoomModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
  prefilledEmail,
  onRoomCreated
}) => {
  const [roomName, setRoomName] = useState('');
  const [inviteEmail, setInviteEmail] = useState(prefilledEmail || '');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (prefilledEmail) {
      setInviteEmail(prefilledEmail);
      // Auto-generar nombre basado en el email invitado
      const displayName = extractDisplayName(prefilledEmail);
      setRoomName(`Chat con ${displayName}`);
    }
  }, [prefilledEmail]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@unavarra\.es$/;
    return emailRegex.test(email.toLowerCase());
  };

  const extractDisplayName = (email: string): string => {
    const localPart = email.split('@')[0];
    const [firstName, lastName] = localPart.split('.');
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  };

  const handleCreateRoom = async () => {
    setError('');
    
    if (!roomName.trim()) {
      setError('El nombre de la sala es obligatorio');
      return;
    }

    if (!inviteEmail.trim()) {
      setError('Introduce un email para invitar');
      return;
    }

    if (!validateEmail(inviteEmail)) {
      setError('Formato incorrecto. Usa: nombre.apellido@unavarra.es');
      return;
    }

    if (inviteEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
      setError('No puedes invitarte a ti mismo');
      return;
    }

    setIsCreating(true);

    try {
      // Crear la sala
      const newRoom = {
        id: `private_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: roomName.trim(),
        createdBy: currentUserEmail,
        members: [currentUserEmail, inviteEmail.toLowerCase()],
        createdAt: new Date()
      };

      // Guardar en localStorage
      const existingRooms = JSON.parse(localStorage.getItem('upn-private-rooms') || '[]');
      const updatedRooms = [...existingRooms, newRoom];
      localStorage.setItem('upn-private-rooms', JSON.stringify(updatedRooms));

      onRoomCreated(newRoom.id);
      onClose();
      
      // Resetear form
      setRoomName('');
      setInviteEmail('');
    } catch (error) {
      setError('Error al crear la sala. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setRoomName('');
      setInviteEmail('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chat Privado</h2>
              <p className="text-sm text-gray-500">Crear sala de 2 personas</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Email a invitar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invitar a:
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="nombre.apellido@unavarra.es"
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isCreating || !!prefilledEmail}
            />
          </div>

          {/* Nombre de la sala */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la sala:
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="ej: Coordinación Programación"
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isCreating}
            />
          </div>

          {/* Vista previa */}
          {inviteEmail && validateEmail(inviteEmail) && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center mb-2">
                <LockClosedIcon className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">
                  Vista Previa de la Sala
                </span>
              </div>
              <div className="text-sm text-purple-700">
                <p><strong>Miembros:</strong></p>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Tú ({currentUserEmail})</li>
                  <li>• {extractDisplayName(inviteEmail)} ({inviteEmail})</li>
                </ul>
              </div>
            </div>
          )}

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
            onClick={handleClose}
            disabled={isCreating}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || !roomName.trim() || !inviteEmail.trim() || !validateEmail(inviteEmail)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
          >
            {isCreating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creando...
              </div>
            ) : (
              <div className="flex items-center">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Crear Chat
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPrivateRoomModal;
