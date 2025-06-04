import React, { useState } from 'react';
import {
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChartBarIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: Date;
  status: 'analyzing' | 'completed' | 'error';
  similarityPercentage?: number;
  sources?: SimilaritySource[];
}

interface SimilaritySource {
  id: string;
  title: string;
  url?: string;
  similarity: number;
  type: 'web' | 'academic' | 'student_work' | 'database';
  matchedText: string;
}

const PlagiarismDetector: React.FC = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: '1',
      name: 'Ensayo_Programacion_Juan_Perez.docx',
      size: '1.2 MB',
      uploadDate: new Date('2024-01-15'),
      status: 'completed',
      similarityPercentage: 23,
      sources: [
        {
          id: '1',
          title: 'Wikipedia - Programación orientada a objetos',
          url: 'https://es.wikipedia.org/wiki/Programación_orientada_a_objetos',
          similarity: 15,
          type: 'web',
          matchedText: 'La programación orientada a objetos es un paradigma de programación...'
        },
        {
          id: '2',
          title: 'Trabajo anterior - María García (2023)',
          similarity: 8,
          type: 'student_work',
          matchedText: 'Los principios fundamentales de la POO incluyen encapsulación...'
        }
      ]
    },
    {
      id: '2',
      name: 'Proyecto_BaseDatos_Ana_Lopez.pdf',
      size: '2.8 MB',
      uploadDate: new Date('2024-01-14'),
      status: 'completed',
      similarityPercentage: 67,
      sources: [
        {
          id: '3',
          title: 'GitHub - Sistema de gestión universitaria',
          url: 'https://github.com/university/management-system',
          similarity: 45,
          type: 'web',
          matchedText: 'CREATE TABLE estudiantes (id INT PRIMARY KEY...'
        },
        {
          id: '4',
          title: 'Stack Overflow - SQL Queries for University System',
          url: 'https://stackoverflow.com/questions/12345',
          similarity: 22,
          type: 'web',
          matchedText: 'SELECT * FROM cursos WHERE profesor_id = ?'
        }
      ]
    },
    {
      id: '3',
      name: 'Algoritmos_Carlos_Martinez.docx',
      size: '956 KB',
      uploadDate: new Date('2024-01-13'),
      status: 'analyzing',
      similarityPercentage: undefined
    }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file, index) => {
      const newDoc: UploadedDocument = {
        id: Date.now().toString() + index,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date(),
        status: 'analyzing'
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      
      // Simular análisis
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { 
                ...doc, 
                status: 'completed' as const, 
                similarityPercentage: Math.floor(Math.random() * 70) + 10,
                sources: generateMockSources()
              }
            : doc
        ));
      }, 3000 + Math.random() * 2000);
    });
  };

  const generateMockSources = (): SimilaritySource[] => {
    const sources = [
      { title: 'Wikipedia - Algoritmos de ordenamiento', url: 'https://es.wikipedia.org/wiki/Algoritmo_de_ordenamiento', type: 'web' as const },
      { title: 'GeeksforGeeks - Data Structures', url: 'https://www.geeksforgeeks.org/data-structures/', type: 'web' as const },
      { title: 'Trabajo anterior - Estudiante UPN', type: 'student_work' as const },
      { title: 'IEEE Paper - Complexity Analysis', type: 'academic' as const },
      { title: 'Stack Overflow - Programming Solutions', url: 'https://stackoverflow.com', type: 'web' as const }
    ];
    
    return sources.slice(0, Math.floor(Math.random() * 3) + 1).map((source, index) => ({
      id: index.toString(),
      title: source.title,
      url: source.url,
      similarity: Math.floor(Math.random() * 30) + 5,
      type: source.type,
      matchedText: 'Texto coincidente de ejemplo que muestra la similitud encontrada...'
    }));
  };

  const getSimilarityColor = (percentage: number) => {
    if (percentage < 15) return 'text-green-600 bg-green-100';
    if (percentage < 30) return 'text-yellow-600 bg-yellow-100';
    if (percentage < 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSimilarityIcon = (percentage: number) => {
    if (percentage < 15) return CheckCircleIcon;
    if (percentage < 30) return InformationCircleIcon;
    return ExclamationTriangleIcon;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return '🌐';
      case 'academic': return '📚';
      case 'student_work': return '👥';
      case 'database': return '🗄️';
      default: return '📄';
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <DocumentDuplicateIcon className="h-8 w-8 mr-3 text-blue-600" />
          Detector de Copias
        </h1>
        <p className="mt-2 text-gray-600">
          Analiza documentos académicos para detectar posibles plagios y similitudes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area & Document List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subir Documentos</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arrastra documentos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Soporta: PDF, DOC, DOCX, TXT (Máximo 10MB por archivo)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Seleccionar Archivos
              </label>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Documentos Analizados</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => {
                const SimilarityIcon = doc.similarityPercentage ? getSimilarityIcon(doc.similarityPercentage) : InformationCircleIcon;
                
                return (
                  <div key={doc.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <DocumentTextIcon className="h-8 w-8 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate max-w-md">
                            {doc.name}
                          </h4>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.uploadDate.toLocaleDateString('es-ES')}</span>
                          </div>
                          
                          {doc.status === 'analyzing' && (
                            <div className="mt-2 flex items-center space-x-2">
                              <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
                              <span className="text-sm text-blue-600">Analizando...</span>
                            </div>
                          )}
                          
                          {doc.status === 'completed' && doc.similarityPercentage !== undefined && (
                            <div className="mt-2 flex items-center space-x-2">
                              <SimilarityIcon className={`h-4 w-4 ${getSimilarityColor(doc.similarityPercentage).split(' ')[0]}`} />
                              <span className={`text-sm px-2 py-1 rounded-full ${getSimilarityColor(doc.similarityPercentage)}`}>
                                {doc.similarityPercentage}% similitud
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {doc.status === 'completed' && (
                          <button
                            onClick={() => setSelectedDocument(doc)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {documents.length === 0 && (
                <div className="p-8 text-center">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay documentos para analizar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedDocument ? 'Detalles del Análisis' : 'Estadísticas Generales'}
            </h3>
          </div>
          
          {selectedDocument ? (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2 truncate" title={selectedDocument.name}>
                  {selectedDocument.name}
                </h4>
                {selectedDocument.similarityPercentage !== undefined && (
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedDocument.similarityPercentage < 15 ? 'bg-green-500' :
                          selectedDocument.similarityPercentage < 30 ? 'bg-yellow-500' :
                          selectedDocument.similarityPercentage < 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedDocument.similarityPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {selectedDocument.similarityPercentage}%
                    </span>
                  </div>
                )}
              </div>

              {selectedDocument.sources && selectedDocument.sources.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Fuentes Detectadas:</h5>
                  <div className="space-y-3">
                    {selectedDocument.sources.map((source) => (
                      <div key={source.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getTypeIcon(source.type)}</span>
                          <div className="flex-1">
                            <h6 className="text-sm font-medium text-gray-900 mb-1">
                              {source.title}
                            </h6>
                            {source.url && (
                              <p className="text-xs text-blue-600 mb-2 truncate">
                                {source.url}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 mb-2">
                              "{source.matchedText}"
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 capitalize">
                                {source.type.replace('_', ' ')}
                              </span>
                              <span className="text-xs font-medium text-red-600">
                                {source.similarity}% coincidencia
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900">
                    {documents.length}
                  </p>
                  <p className="text-xs text-blue-600">Documentos analizados</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-900">
                    {documents.filter(d => d.similarityPercentage && d.similarityPercentage < 15).length}
                  </p>
                  <p className="text-xs text-green-600">Sin problemas</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-red-900">
                    {documents.filter(d => d.similarityPercentage && d.similarityPercentage >= 50).length}
                  </p>
                  <p className="text-xs text-red-600">Alta similitud</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Guía de Interpretación</h5>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>0-15%: Aceptable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>15-30%: Revisar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>30-50%: Preocupante</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>50%+: Muy alta</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlagiarismDetector;
