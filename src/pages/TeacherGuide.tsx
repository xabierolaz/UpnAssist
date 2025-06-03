import React, { useState } from 'react';
import {
  BookOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TeacherGuide: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const guideContent = [
    {
      id: 'bienvenida',
      title: 'Bienvenida y Orientación',
      icon: AcademicCapIcon,
      items: [
        'Introducción a la UPN y sus valores',
        'Estructura organizativa de la universidad',
        'Misión, visión y objetivos institucionales',
        'Recursos disponibles para profesores',
        'Contactos importantes y directorios'
      ]
    },
    {
      id: 'normativas',
      title: 'Normativas y Procedimientos',
      icon: DocumentTextIcon,
      items: [
        'Reglamento interno del profesorado',
        'Procedimientos académicos',
        'Protocolos de evaluación',
        'Normativas de conducta y ética',
        'Políticas de investigación'
      ]
    },
    {
      id: 'recursos',
      title: 'Recursos Académicos',
      icon: BookOpenIcon,
      items: [
        'Plataforma educativa virtual',
        'Biblioteca digital y recursos',
        'Laboratorios y equipamiento',
        'Software y herramientas digitales',
        'Material didáctico disponible'
      ]
    },
    {
      id: 'estudiantes',
      title: 'Gestión de Estudiantes',
      icon: UserGroupIcon,
      items: [
        'Sistema de calificaciones',
        'Registro de asistencia',
        'Comunicación con estudiantes',
        'Seguimiento académico',
        'Programas de tutoría'
      ]
    },
    {
      id: 'desarrollo',
      title: 'Desarrollo Profesional',
      icon: ClockIcon,
      items: [
        'Programas de capacitación',
        'Oportunidades de investigación',
        'Conferencias y seminarios',
        'Redes de colaboración',
        'Evaluación del desempeño'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <BookOpenIcon className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guía del Profesorado</h1>
            <p className="mt-2 text-gray-600">
              Manual completo para profesores de la Universidad
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-blue-900">Horarios de Atención</h3>
          </div>
          <p className="mt-2 text-blue-700">Lunes a Viernes: 8:00 - 18:00</p>
          <p className="text-blue-700">Sábados: 8:00 - 14:00</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <UserGroupIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-green-900">Soporte Técnico</h3>
          </div>
          <p className="mt-2 text-green-700">Ext. 1234</p>
          <p className="text-green-700">soporte@upn.edu</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <AcademicCapIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-purple-900">Coordinación Académica</h3>
          </div>
          <p className="mt-2 text-purple-700">Ext. 5678</p>
          <p className="text-purple-700">academico@upn.edu</p>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Contenido de la Guía</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {guideContent.map((section) => (
            <div key={section.id} className="p-6">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <section.icon className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections[section.id] && (
                <div className="mt-4 ml-9">
                  <ul className="space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Nota:</strong> Esta sección contiene información detallada basada en la documentación oficial de la universidad. 
                      Para más detalles, consulte los documentos específicos o contacte con el departamento correspondiente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recursos Descargables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Manual Completo PDF</h4>
                <p className="text-sm text-gray-500">Guía completa del profesorado</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Formularios Académicos</h4>
                <p className="text-sm text-gray-500">Plantillas y formularios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherGuide;
