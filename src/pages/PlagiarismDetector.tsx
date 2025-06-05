import React, { useState, useRef } from 'react';
import { ArrowPathIcon, DocumentTextIcon, FolderIcon } from '@heroicons/react/24/outline';
import type { JPlagResult } from '../services/JPlagService';

const PlagiarismDetector: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JPlagResult | null>(null);
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');
  const [language, setLanguage] = useState<string>('java');
  const [threshold, setThreshold] = useState<number>(50);
  const directoryInputRef = useRef<HTMLInputElement>(null);
  
  const handleDirectorySelect = () => {
    if (directoryInputRef.current) {
      directoryInputRef.current.click();
    }
  };
  
  const handleDirectoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // En un entorno real, aquí procesaríamos la carpeta seleccionada
      setSelectedDirectory(files[0].name.split('\\').pop() || '');
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedDirectory) {
      alert('Por favor, seleccione una carpeta con entregas para analizar');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // En un entorno real, esto conectaría con el JPlag traducido
      // const result = await jplagService.runAnalysis(selectedDirectory, {
      //   language,
      //   similarityThreshold: threshold / 100,
      // });
      
      // Simulamos la respuesta para la demo
      setTimeout(() => {
        const mockResult: JPlagResult = {
          success: true,
          averageSimilarity: 35.8,
          similarities: [
            { submission1: 'estudiante01', submission2: 'estudiante04', similarity: 95.2 },
            { submission1: 'estudiante01', submission2: 'estudiante03', similarity: 82.5 },
            { submission1: 'estudiante03', submission2: 'estudiante08', similarity: 78.1 },
            { submission1: 'estudiante06', submission2: 'estudiante18', similarity: 65.3 },
            { submission1: 'estudiante09', submission2: 'estudiante15', similarity: 60.0 },
            { submission1: 'estudiante02', submission2: 'estudiante07', similarity: 45.2 },
          ],
          outputPath: 'd:\\UpnAssist\\plagiarism-report.jplag'
        };
        
        setResults(mockResult);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error al ejecutar análisis:', error);
      alert('Error al ejecutar el análisis. Consulte la consola para más detalles.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Detector de Plagios (JPlag)</h1>
          <p className="text-gray-600 mb-6">
            Esta herramienta utiliza JPlag para detectar similitudes entre entregas de estudiantes.
            Seleccione la carpeta que contiene las entregas a analizar.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FolderIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Seleccione la carpeta con las entregas a analizar
              </p>              <input
                type="file"
                // @ts-ignore - webkitdirectory no está en los tipos de TypeScript pero es compatible con navegadores
                webkitdirectory="true"
                // @ts-ignore - directory no está en los tipos de TypeScript pero es compatible con navegadores
                directory=""
                ref={directoryInputRef}
                onChange={handleDirectoryChange}
                className="hidden"
                id="directory-upload"
              />
              <button
                type="button"
                onClick={handleDirectorySelect}
                className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
              >
                Seleccionar carpeta
              </button>
              {selectedDirectory && (
                <div className="mt-4 text-sm text-left">
                  <p className="font-medium">Carpeta seleccionada:</p>
                  <p className="text-gray-600">{selectedDirectory}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Lenguaje de programación
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="cpp">C/C++</option>
                  <option value="csharp">C#</option>
                  <option value="javascript">JavaScript</option>
                  <option value="text">Texto</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                  Umbral de similitud: {threshold}%
                </label>
                <input
                  type="range"
                  id="threshold"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedDirectory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Analizar entregas
                  </>
                )}
              </button>
            </div>
          </form>
          
          {results && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-md">
              <h2 className="text-xl font-medium text-blue-800 mb-4">Resultados del análisis</h2>
              
              <div className="mb-4 p-3 bg-white rounded-md shadow-sm">
                <p className="text-gray-700 font-medium">
                  Similitud promedio: <span className="text-blue-600 font-bold">{results.averageSimilarity.toFixed(1)}%</span>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Reporte completo generado en: <span className="font-mono text-xs">{results.outputPath}</span>
                </p>
              </div>
              
              <h3 className="text-lg font-medium text-blue-700 mb-2">Coincidencias principales:</h3>
              <div className="space-y-2 mb-4">
                {results.similarities.map((similarity, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-2 rounded-md"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${similarity.similarity / 100})`
                    }}
                  >
                    <span className="font-medium text-gray-800">
                      {similarity.submission1} - {similarity.submission2}
                    </span>
                    <span className="font-bold text-red-900">
                      {similarity.similarity.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                <button 
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  onClick={() => setResults(null)}
                >
                  Nuevo análisis
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Ver reporte completo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlagiarismDetector;
