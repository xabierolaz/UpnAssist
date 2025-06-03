import React, { useState } from 'react';
import {
  FolderIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlayIcon,
  SpeakerWaveIcon,
  ArchiveBoxIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface Resource {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive';
  size: string;
  lastModified: Date;
  category: string;
  url?: string;
}

const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const categories = [
    { id: 'all', name: 'Todos los Recursos', icon: FolderIcon, count: 24 },
    { id: 'documents', name: 'Documentos', icon: DocumentTextIcon, count: 12 },
    { id: 'presentations', name: 'Presentaciones', icon: PhotoIcon, count: 8 },
    { id: 'videos', name: 'Videos Educativos', icon: PlayIcon, count: 3 },
    { id: 'templates', name: 'Plantillas', icon: ArchiveBoxIcon, count: 1 }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      name: 'Manual de Evaluación Docente 2025.pdf',
      type: 'document',
      size: '2.4 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
      category: 'documents'
    },
    {
      id: '2',
      name: 'Plantilla de Syllabus.docx',
      type: 'document',
      size: '156 KB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 48),
      category: 'templates'
    },
    {
      id: '3',
      name: 'Presentación Metodologías Activas.pptx',
      type: 'document',
      size: '8.7 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 72),
      category: 'presentations'
    },
    {
      id: '4',
      name: 'Tutorial Plataforma Virtual.mp4',
      type: 'video',
      size: '45.2 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 120),
      category: 'videos'
    },
    {
      id: '5',
      name: 'Rúbricas de Evaluación.xlsx',
      type: 'document',
      size: '892 KB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 168),
      category: 'documents'
    },
    {
      id: '6',
      name: 'Guía de Investigación Académica.pdf',
      type: 'document',
      size: '3.1 MB',
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 240),
      category: 'documents'
    }
  ];
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return DocumentTextIcon;
      case 'image':
        return PhotoIcon;
      case 'video':
        return PlayIcon;
      case 'audio':
        return SpeakerWaveIcon;
      case 'archive':
        return ArchiveBoxIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-red-600 bg-red-100';
      case 'image':
        return 'text-green-600 bg-green-100';
      case 'video':
        return 'text-purple-600 bg-purple-100';
      case 'audio':
        return 'text-yellow-600 bg-yellow-100';
      case 'archive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recursos Académicos</h1>
          <p className="mt-2 text-gray-600">
            Biblioteca de recursos y materiales educativos
          </p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          Subir Archivo
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categorías</h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 mr-3" />
                    {category.name}
                  </div>
                  <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-1">
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Access */}
          <div className="bg-white shadow rounded-lg p-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acceso Rápido</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                📚 Biblioteca Digital UPN
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                🎓 Portal Académico
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                📋 Formularios Oficiales
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                🔬 Laboratorios Virtuales
              </a>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white shadow rounded-lg">
            {/* Search and filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar recursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Resources grid/list */}
            <div className="p-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <FolderIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recursos</h3>
                  <p className="text-gray-500">Intenta cambiar los filtros o el término de búsqueda</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredResources.map((resource) => {
                    const IconComponent = getResourceIcon(resource.type);
                    const colorClasses = getFileColor(resource.type);
                    
                    return (
                      <div
                        key={resource.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${colorClasses}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <ShareIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {resource.name}
                        </h4>
                        <div className="text-xs text-gray-500">
                          <p>{resource.size}</p>
                          <p>{formatDate(resource.lastModified)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResources.map((resource) => {
                    const IconComponent = getResourceIcon(resource.type);
                    const colorClasses = getFileColor(resource.type);
                    
                    return (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${colorClasses}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{resource.name}</h4>
                            <p className="text-xs text-gray-500">
                              {resource.size} • {formatDate(resource.lastModified)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <ShareIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
