import React, { useState } from 'react';
import { 
  UserIcon, 
  AtSymbolIcon, 
  ShieldCheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface UserRegistrationProps {
  onUserRegistered: (displayName: string) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onUserRegistered }) => {
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@unavarra\.es$/;
    return emailRegex.test(email.toLowerCase());
  };

  const extractDisplayName = (email: string): string => {
    const localPart = email.split('@')[0];
    const [firstName, lastName] = localPart.split('.');
    
    // Capitalizar nombres
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');

    // Simular validación
    setTimeout(() => {
      if (!email.trim()) {
        setError('Por favor, introduce tu email institucional');
        setIsValidating(false);
        return;
      }

      if (!validateEmail(email)) {
        setError('Formato incorrecto. Usa: nombre.apellido@unavarra.es');
        setIsValidating(false);
        return;
      }

      const displayName = extractDisplayName(email);
      
      // Guardar en localStorage para sesiones futuras
      localStorage.setItem('upn-chat-email', email);
      localStorage.setItem('upn-chat-displayname', displayName);
      
      onUserRegistered(displayName);
      setIsValidating(false);
    }, 1000);
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso al Chat Académico
          </h2>
          <p className="text-gray-600 text-sm">
            Introduce tu email institucional para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSymbolIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre.apellido@unavarra.es"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isValidating}
              />
            </div>
            {error && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isValidating || !email.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isValidating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Validando...
              </div>
            ) : (
              'Acceder al Chat'
            )}
          </button>
        </form>

        {/* Información de privacidad */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-1">
                Privacidad Garantizada
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Tu email NO se almacena en servidores</li>
                <li>• Solo se guarda en la caché local del dispositivo</li>
                <li>• Los emails son públicos en la web de UPNA</li>
                <li>• Deberás introducirlo una vez por dispositivo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-4 flex items-start text-xs text-gray-500">
          <InformationCircleIcon className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0" />
          <span>
            El email se usa únicamente para mostrar tu nombre en el chat académico.
            Al continuar, aparecerás como "Nombre Apellido" en las conversaciones.
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
