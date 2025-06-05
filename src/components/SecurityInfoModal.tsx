import React from 'react';
import { XMarkIcon, LockClosedIcon, ShieldCheckIcon, ClockIcon, ServerIcon } from '@heroicons/react/24/outline';

interface SecurityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEncryptionEnabled: boolean;
}

const SecurityInfoModal: React.FC<SecurityInfoModalProps> = ({ isOpen, onClose, isEncryptionEnabled }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <LockClosedIcon className="h-6 w-6 mr-2 text-primary-600" />
              Información de Seguridad del Chat
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-full ${isEncryptionEnabled ? 'bg-green-100' : 'bg-yellow-100'} mr-3`}>
                <ShieldCheckIcon className={`h-5 w-5 ${isEncryptionEnabled ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
              <h3 className="text-lg font-semibold">Estado del Cifrado</h3>
            </div>
            <p className="ml-12 text-gray-700">
              {isEncryptionEnabled 
                ? "✅ Cifrado de extremo a extremo activo (AES-GCM)" 
                : "⚠️ Cifrado no disponible en este navegador"}
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🔒 Cifrado de Extremo a Extremo</h3>
              <p className="text-gray-700 mb-2">
                Todos los mensajes enviados a través del chat están protegidos mediante cifrado 
                AES-GCM de 256 bits. Esto significa que:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Los mensajes se cifran en tu dispositivo antes de enviarse</li>
                <li>Solo los participantes del chat pueden descifrarlos</li>
                <li>Ni siquiera el servidor puede leer el contenido de tus mensajes</li>
                <li>Cada sala tiene su propia clave de cifrado única</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🔐 Generación Segura de Claves</h3>
              <p className="text-gray-700 mb-2">
                Las claves de cifrado se derivan mediante PBKDF2 con las siguientes características:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Generación local en tu dispositivo (nunca se transmiten)</li>
                <li>100,000 iteraciones para resistencia a ataques</li>
                <li>Función hash SHA-256</li>
                <li>Derivadas del nombre de la sala de chat</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <ServerIcon className="h-5 w-5 text-gray-700 mr-2 mt-0.5" />
                <h3 className="font-semibold text-gray-900">Sin Almacenamiento en Servidores</h3>
              </div>
              <p className="text-gray-700 mb-2">
                Los mensajes nunca se almacenan en servidores:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>El servidor solo transmite mensajes entre participantes</li>
                <li>No hay base de datos para el historial de conversaciones</li>
                <li>Los mensajes solo existen mientras el chat está activo</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <ClockIcon className="h-5 w-5 text-gray-700 mr-2 mt-0.5" />
                <h3 className="font-semibold text-gray-900">Almacenamiento Temporal Local</h3>
              </div>
              <p className="text-gray-700 mb-2">
                Los mensajes se guardan temporalmente solo en tu dispositivo:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Se almacenan en el caché local de tu navegador</li>
                <li>Solo se mantienen los últimos 100 mensajes</li>
                <li>Se eliminan automáticamente después de 7 días</li>
                <li>Puedes borrar manualmente el historial en cualquier momento</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">⚙️ Detalles Técnicos</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Algoritmo: AES-GCM (Galois/Counter Mode)</li>
                <li>Longitud de clave: 256 bits</li>
                <li>Vector de inicialización (IV): 12 bytes, generado aleatoriamente para cada mensaje</li>
                <li>Transmisión: Mensajes codificados en Base64</li>
                <li>WebCrypto API: Utiliza APIs nativas del navegador para operaciones criptográficas</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nota: Este sistema está diseñado para ofrecer privacidad en las comunicaciones entre profesores de la UPN.
              Los mensajes solo son visibles para los participantes activos en el chat.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfoModal;
