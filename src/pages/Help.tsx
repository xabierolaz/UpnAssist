import React from 'react';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  ServerIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Centro de Ayuda - UpnAssist
        </h1>
        <p className="text-lg text-gray-600">
          Información legal, privacidad y uso responsable de la plataforma
        </p>
      </div>

      {/* Sección de Privacidad y Seguridad */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-green-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Privacidad y Protección de Datos
          </h2>
        </div>

        <div className="space-y-6">
          {/* No almacenamiento en servidores */}
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                ✅ Sin Almacenamiento en Servidores
              </h3>
            </div>
            <p className="text-gray-700">
              <strong>UpnAssist NO almacena ningún dato personal o académico en servidores externos.</strong> 
              Toda la información se mantiene exclusivamente en el almacenamiento local de tu navegador 
              (localStorage/sessionStorage), garantizando que solo tú tienes acceso a tus datos.
            </p>
          </div>

          {/* Cifrado local */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center mb-2">
              <LockClosedIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                🔒 Cifrado End-to-End Local
              </h3>
            </div>
            <p className="text-gray-700">
              Los datos almacenados localmente utilizan cifrado AES-256 antes de guardarse en tu navegador. 
              Esto significa que incluso si alguien accediera a tu dispositivo, la información estaría protegida 
              mediante algoritmos de seguridad de nivel militar.
            </p>
          </div>

          {/* Sin acceso a datos UPNA */}
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-center mb-2">
              <ServerIcon className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                🛡️ Sin Acceso a Sistemas UPNA
              </h3>
            </div>
            <p className="text-gray-700">
              UpnAssist <strong>NO accede, modifica ni manipula</strong> los sistemas oficiales de la Universidad Pública de Navarra. 
              No utilizamos credenciales universitarias ni interactuamos con bases de datos institucionales. 
              Somos una herramienta completamente independiente.
            </p>
          </div>
        </div>
      </div>

      {/* Sección del Calendario */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <CalendarIcon className="h-8 w-8 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Generación de Calendarios
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              📅 Calendarios Locales (.ics)
            </h3>
            <p className="text-purple-800">
              Nuestro sistema genera archivos de calendario estándar (.ics) que puedes importar 
              en cualquier aplicación de calendario. No requiere permisos especiales ni acceso 
              a tu cuenta de Google, Outlook o Apple Calendar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">✅ Lo que SÍ hacemos:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Generar archivos .ics localmente</li>
                <li>• Crear enlaces webcal:// para suscripción</li>
                <li>• Formatear eventos académicos</li>
                <li>• Proporcionar instrucciones de uso</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">❌ Lo que NO hacemos:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Acceder a tu cuenta de Google</li>
                <li>• Solicitar OAuth o permisos</li>
                <li>• Modificar calendarios existentes</li>
                <li>• Almacenar datos en la nube</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Declaración Legal */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Declaración Legal
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              📜 Responsabilidad y Uso
            </h3>
            
            <div className="space-y-3 text-blue-800">
              <p>
                <strong>1. Herramienta Independiente:</strong> UpnAssist es un proyecto educativo 
                independiente, no afiliado oficialmente con la Universidad Pública de Navarra (UPNA).
              </p>
              
              <p>
                <strong>2. Sin Manipulación de Datos:</strong> No accedemos, modificamos ni 
                interferimos con los sistemas informáticos oficiales de UPNA.
              </p>
              
              <p>
                <strong>3. Uso Responsable:</strong> Los usuarios son responsables del uso 
                adecuado de la información generada por esta herramienta.
              </p>
              
              <p>
                <strong>4. Sin Garantías:</strong> UpnAssist se proporciona "tal como está", 
                sin garantías de precisión o disponibilidad continua.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información Técnica */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <InformationCircleIcon className="h-8 w-8 text-indigo-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Información Técnica
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🔧 Tecnologías Utilizadas
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Frontend:</strong> React + TypeScript + Tailwind CSS</li>
              <li>• <strong>Almacenamiento:</strong> localStorage (navegador)</li>
              <li>• <strong>Cifrado:</strong> AES-256 (Web Crypto API)</li>
              <li>• <strong>Calendarios:</strong> Formato iCal estándar</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🌐 Compatibilidad
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Navegadores:</strong> Chrome, Firefox, Safari, Edge</li>
              <li>• <strong>Dispositivos:</strong> Desktop, tablet, móvil</li>
              <li>• <strong>Calendarios:</strong> Google, Outlook, Apple, Thunderbird</li>
              <li>• <strong>Formatos:</strong> .ics, webcal://, CalDAV</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contacto y Soporte */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Soporte y Contacto
          </h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 mb-3">
            <strong>Nota Importante:</strong> UpnAssist es un proyecto educativo desarrollado 
            por estudiantes para estudiantes. No somos un servicio comercial ni oficial de UPNA.
          </p>
          
          <div className="space-y-2 text-yellow-700">
            <p>
              <strong>Para consultas técnicas:</strong> Revisa la documentación en el repositorio del proyecto
            </p>
            <p>
              <strong>Para reportar problemas:</strong> Utiliza el sistema de issues del repositorio
            </p>
            <p>
              <strong>Código fuente:</strong> Disponible bajo licencia MIT en GitHub
            </p>
          </div>
        </div>
      </div>

      {/* Footer de la página de ayuda */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          UpnAssist v1.0 - Herramienta educativa independiente<br />
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
};

export default Help;
