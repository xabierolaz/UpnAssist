import React, { useState } from 'react';
import {
  EnvelopeIcon,
  InboxIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
}

const Email: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const emails: Email[] = [
    {
      id: '1',
      from: 'coordinacion@upn.edu',
      subject: 'Nuevos protocolos de evaluación - Semestre 2025-2',
      preview: 'Estimado profesor, le informamos sobre los nuevos protocolos que entrarán en vigor...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
      isStarred: true,
      isImportant: true
    },
    {
      id: '2',
      from: 'sistemas@upn.edu',
      subject: 'Mantenimiento programado del campus virtual',
      preview: 'El próximo sábado realizaremos mantenimiento en la plataforma educativa...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: true,
      isStarred: false,
      isImportant: false
    },
    {
      id: '3',
      from: 'biblioteca@upn.edu',
      subject: 'Nuevos recursos digitales disponibles',
      preview: 'Nos complace informarle que hemos adquirido nuevas bases de datos académicas...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
      isStarred: false,
      isImportant: false
    },
    {
      id: '4',
      from: 'rrhh@upn.edu',
      subject: 'Recordatorio: Evaluación de desempeño docente',
      preview: 'Le recordamos que el período de evaluación de desempeño docente finaliza...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      isRead: false,
      isStarred: false,
      isImportant: true
    }
  ];

  const folders = [
    { id: 'inbox', name: 'Bandeja de Entrada', icon: InboxIcon, count: emails.filter(e => !e.isRead).length },
    { id: 'starred', name: 'Destacados', icon: StarIcon, count: emails.filter(e => e.isStarred).length },
    { id: 'sent', name: 'Enviados', icon: PaperAirplaneIcon, count: 0 },
    { id: 'archive', name: 'Archivo', icon: ArchiveBoxIcon, count: 0 },
    { id: 'trash', name: 'Papelera', icon: TrashIcon, count: 0 }
  ];

  const filteredEmails = emails.filter(email => {
    if (selectedFolder === 'starred') return email.isStarred;
    if (selectedFolder === 'inbox') return true;
    return true;
  }).filter(email => 
    searchTerm === '' || 
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  const toggleStar = (emailId: string) => {
    // In a real app, this would update the email in the backend
    console.log('Toggle star for email:', emailId);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white shadow rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center">
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            Redactar
          </button>
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li key={folder.id}>
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <folder.icon className="h-5 w-5 mr-3" />
                    {folder.name}
                  </div>
                  {folder.count > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {folder.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Email redirect notice */}
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-start space-x-2">
            <EnvelopeIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Correo Redirigido</h4>
              <p className="text-xs text-blue-700 mt-1">
                Los correos se sincronizan automáticamente desde tu cuenta institucional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {folders.find(f => f.id === selectedFolder)?.name}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar correos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <EnvelopeIcon className="h-12 w-12 mb-4" />
              <p>No hay correos en esta carpeta</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredEmails.map((email) => (
                <li
                  key={email.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !email.isRead ? 'bg-blue-50' : ''
                  } ${selectedEmail === email.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
                  onClick={() => setSelectedEmail(selectedEmail === email.id ? null : email.id)}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      className="mt-1"
                    >
                      {email.isStarred ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-5 w-5 text-gray-300 hover:text-yellow-400" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {email.from}
                          </p>
                          {email.isImportant && (
                            <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTime(email.timestamp)}
                        </p>
                      </div>
                      
                      <p className={`text-sm mt-1 ${!email.isRead ? 'font-medium' : 'text-gray-600'}`}>
                        {email.subject}
                      </p>
                      
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {email.preview}
                      </p>
                    </div>
                  </div>
                  
                  {selectedEmail === email.id && (
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="prose max-w-none">
                        <p className="text-gray-700">
                          {email.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="mt-4 text-gray-700">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                          officia deserunt mollit anim id est laborum.
                        </p>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
                          Responder
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                          Reenviar
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                          Archivar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Email;
