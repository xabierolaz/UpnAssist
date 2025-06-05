/**
 * Datos de ejemplo de asignaturas para pruebas
 */

import type { Subject } from '../types/subject';

export const sampleSubjects: Subject[] = [
  {
    id: 'prog1',
    code: 'CS101',
    name: 'Programación I',
    roomId: 'subject-prog1',
    semester: '2025-1',
    year: '2025',
    description: 'Fundamentos de programación y algoritmia'
  },
  {
    id: 'bd1',
    code: 'CS201',
    name: 'Bases de Datos I',
    roomId: 'subject-bd1',
    semester: '2025-1',
    year: '2025',
    description: 'Diseño y gestión de bases de datos relacionales'
  },
  {
    id: 'redes',
    code: 'CS301',
    name: 'Redes de Computadoras',
    roomId: 'subject-redes',
    semester: '2025-1',
    year: '2025',
    description: 'Fundamentos de redes y protocolos de comunicación'
  },
  {
    id: 'ia',
    code: 'CS401',
    name: 'Inteligencia Artificial',
    roomId: 'subject-ia',
    semester: '2025-1',
    year: '2025',
    description: 'Introducción a la IA y aprendizaje automático'
  },
  {
    id: 'sw',
    code: 'CS501',
    name: 'Ingeniería de Software',
    roomId: 'subject-sw',
    semester: '2025-1',
    year: '2025',
    description: 'Metodologías y procesos de desarrollo de software'
  }
];
