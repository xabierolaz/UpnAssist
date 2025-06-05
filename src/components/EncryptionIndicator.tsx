import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export interface EncryptionIndicatorProps {
  isEnabled: boolean;
  timestamp: Date;
  count: number;
  onClick?: () => void;
}

/**
 * Componente que muestra el estado del cifrado y la limpieza de mensajes
 */
const EncryptionIndicator: React.FC<EncryptionIndicatorProps> = ({ 
  isEnabled,
  timestamp,
  count,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center text-sm ${
        isEnabled ? 'text-green-600' : 'text-gray-500'
      } cursor-pointer`}
      title="Estado del cifrado"
    >
      <LockClosedIcon className="h-4 w-4 mr-1" />
      <span>
        {count} {count === 1 ? 'usuario' : 'usuarios'} · Cifrado activo
      </span>
    </div>
  );
};

export default EncryptionIndicator;
