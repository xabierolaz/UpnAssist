/**
 * Servicio de Generación de Calendarios iCal - UpnAssist
 * 
 * Funcionalidades:
 * - Genera UN calendario unificado con todos los eventos UPN
 * - Formato .ics estándar compatible con cualquier calendario
 * - Enlaces webcal:// para suscripción automática
 * - Diferentes formatos para clases vs reuniones
 * - SIN acceso a datos personales del usuario
 * - SIN OAuth - solo generación de enlaces
 */

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  type: 'class' | 'meeting' | 'event';
  subject?: string;
  professor?: string;
  attendees?: string[];
}

interface CalendarSyncStatus {
  isGenerated: boolean;
  lastGenerated: Date | null;
  eventsCount: number;
  calendarUrl: string | null;
}

class CalendarGeneratorService {
  constructor() {
    // Servicio para generar calendarios locales
  }

  /**
   * Genera el calendario principal de UPN
   */
  generateMainCalendar(): CalendarSyncStatus {
    const events = this.getAllUpnEvents();
    const icsContent = this.generateICSFile(events);
    const calendarUrl = this.createCalendarUrl(icsContent, 'upn-calendario-academico');

    // Guardar información localmente
    const status: CalendarSyncStatus = {
      isGenerated: true,
      lastGenerated: new Date(),
      eventsCount: events.length,
      calendarUrl
    };

    localStorage.setItem('upn-calendar-status', JSON.stringify(status));
    return status;
  }

  /**
   * Obtiene todos los eventos UPN (simulados para demo)
   */
  private getAllUpnEvents(): CalendarEvent[] {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      // Clases regulares
      {
        id: 'class-prog1-001',
        title: 'Programación I - Teoría',
        description: 'Clase magistral de Programación I\nTema: Estructuras de control\nProfesor: Dr. García López',
        start: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Mañana
        end: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 horas después
        location: 'Aula 101 - Edificio Los Encinas',
        type: 'class',
        subject: 'Programación I',
        professor: 'Dr. García López'
      },
      {
        id: 'class-bd-002',
        title: 'Bases de Datos - Laboratorio',
        description: 'Práctica de SQL\nTema: Consultas complejas y subconsultas\nProfesor: Dra. Martín Ruiz',
        start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 horas
        location: 'Lab. Informática 2 - Los Encinas',
        type: 'class',
        subject: 'Bases de Datos',
        professor: 'Dra. Martín Ruiz'
      },

      // Reuniones y eventos
      {
        id: 'meeting-dept-001',
        title: 'Reunión Departamento - Evaluación Continua',
        description: '📅 Reunión mensual del Departamento de Informática\n\n🎯 Agenda:\n• Revisión de evaluaciones\n• Nuevas metodologías\n• Calendario de exámenes\n\n👥 Asistentes: Todo el profesorado',
        start: new Date(nextWeek.setHours(10, 0, 0, 0)),
        end: new Date(nextWeek.setHours(12, 0, 0, 0)),
        location: 'Sala de Juntas - Edificio A',
        type: 'meeting',
        attendees: ['Dr. Director', 'Secretario Académico', 'Profesorado']
      },
      {
        id: 'event-conference-001',
        title: 'Conferencia: IA en la Educación Superior',
        description: '🎓 Conferencia magistral\n\n🔬 Ponente: Dr. Experto en IA\n📍 Universidad Invitada\n\n💡 Temas:\n• Machine Learning en evaluación\n• Chatbots educativos\n• Futuro de la enseñanza',
        start: new Date(nextMonth.setHours(16, 0, 0, 0)),
        end: new Date(nextMonth.setHours(18, 30, 0, 0)),
        location: 'Aula Magna - Campus Arrosadía',
        type: 'event',
        attendees: ['Comunidad Universitaria']
      },
      {
        id: 'meeting-tutoring-001',
        title: 'Tutorías Académicas - Programación I',
        description: '👨‍🎓 Sesión de tutorías individuales\n\n📝 Para estudiantes con dificultades\n🕐 Citas de 30 minutos\n📧 Confirmar asistencia por email',
        start: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // En 5 días a las 9:00
        end: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // Hasta las 12:00
        location: 'Despacho 207 - Los Encinas',
        type: 'meeting',
        professor: 'Dr. García López'
      }
    ];
  }

  /**
   * Genera el contenido del archivo .ics
   */
  private generateICSFile(events: CalendarEvent[]): string {
    const icsHeader = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UpnAssist//Calendario Académico UPN//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:📚 UPN - Calendario Académico',
      'X-WR-CALDESC:Calendario unificado con clases, reuniones y eventos de la Universidad Pública de Navarra',
      'X-WR-TIMEZONE:Europe/Madrid'
    ].join('\r\n');

    const icsFooter = 'END:VCALENDAR';

    const icsEvents = events.map(event => this.formatEventForICS(event)).join('\r\n');

    return `${icsHeader}\r\n${icsEvents}\r\n${icsFooter}`;
  }

  /**
   * Formatea un evento individual para el formato .ics
   */
  private formatEventForICS(event: CalendarEvent): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeText = (text: string): string => {
      return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
    };

    // Diferentes prefijos según el tipo
    const prefix = this.getEventPrefix(event.type);
    const formattedTitle = `${prefix} ${event.title}`;

    const lines = [
      'BEGIN:VEVENT',
      `UID:${event.id}@upnassist.local`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${escapeText(formattedTitle)}`,
      `DESCRIPTION:${escapeText(event.description || '')}`,
      `LOCATION:${escapeText(event.location || '')}`,
      `CATEGORIES:${this.getEventCategory(event.type)}`,
      `STATUS:CONFIRMED`,
      `TRANSP:OPAQUE`,
      `CREATED:${formatDate(new Date())}`,
      `LAST-MODIFIED:${formatDate(new Date())}`,
      'END:VEVENT'
    ];

    return lines.join('\r\n');
  }

  /**
   * Obtiene el prefijo según el tipo de evento
   */
  private getEventPrefix(type: string): string {
    switch (type) {
      case 'class':
        return '📚'; // Emoji de libros para clases
      case 'meeting':
        return '👥'; // Emoji de personas para reuniones
      case 'event':
        return '🎓'; // Emoji de graduación para eventos especiales
      default:
        return '📅'; // Emoji de calendario por defecto
    }
  }

  /**
   * Obtiene la categoría del evento
   */
  private getEventCategory(type: string): string {
    switch (type) {
      case 'class':
        return 'EDUCATION,CLASS';
      case 'meeting':
        return 'MEETING,WORK';
      case 'event':
        return 'EVENT,CONFERENCE';
      default:
        return 'OTHER';
    }
  }

  /**
   * Crea la URL del calendario (simulada para demo)
   */
  private createCalendarUrl(icsContent: string, filename: string): string {    // En producción, esto se subiría a un servidor y se devolvería la URL real
    // También guardamos el contenido para descarga directa
    localStorage.setItem('upn-calendar-ics-content', icsContent);
    
    // URL simulada que en producción sería real
    const webcalUrl = `webcal://${window.location.hostname}/calendarios/${filename}.ics`;
    
    return webcalUrl;
  }
  /**
   * Obtiene el estado actual del calendario
   */
  getCalendarStatus(): CalendarSyncStatus {
    const savedStatus = localStorage.getItem('upn-calendar-status');
    
    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      // Verificar que lastGenerated sea válido antes de convertirlo a Date
      if (status.lastGenerated) {
        status.lastGenerated = new Date(status.lastGenerated);
        // Verificar que la fecha sea válida
        if (isNaN(status.lastGenerated.getTime())) {
          status.lastGenerated = null;
        }
      } else {
        status.lastGenerated = null;
      }
      return status;
    }

    return {
      isGenerated: false,
      lastGenerated: null,
      eventsCount: 0,
      calendarUrl: null
    };
  }

  /**
   * Descarga directa del archivo .ics
   */
  downloadCalendar(): void {
    const icsContent = localStorage.getItem('upn-calendar-ics-content');
    
    if (!icsContent) {
      // Si no hay contenido, generar primero
      this.generateMainCalendar();
      const newContent = localStorage.getItem('upn-calendar-ics-content');
      if (!newContent) return;
      
      this.downloadICSFile(newContent);
    } else {
      this.downloadICSFile(icsContent);
    }
  }

  /**
   * Descarga el archivo .ics
   */
  private downloadICSFile(content: string): void {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'upn-calendario-academico.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Copia la URL del calendario al portapapeles
   */
  async copyCalendarUrl(): Promise<boolean> {
    const status = this.getCalendarStatus();
    
    if (!status.calendarUrl) {
      // Generar primero si no existe
      const newStatus = this.generateMainCalendar();
      if (!newStatus.calendarUrl) return false;
      
      try {
        await navigator.clipboard.writeText(newStatus.calendarUrl);
        return true;
      } catch {
        return false;
      }
    }

    try {
      await navigator.clipboard.writeText(status.calendarUrl);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Regenera el calendario con eventos actualizados
   */
  refreshCalendar(): CalendarSyncStatus {
    // Limpiar datos anteriores
    localStorage.removeItem('upn-calendar-status');
    localStorage.removeItem('upn-calendar-ics-content');
    
    // Generar nuevo calendario
    return this.generateMainCalendar();
  }

  /**
   * Obtiene instrucciones de uso para diferentes plataformas
   */
  getUsageInstructions(): { platform: string; steps: string[]; }[] {
    return [
      {
        platform: 'Google Calendar',
        steps: [
          '1. Haz clic en "📋 Copiar Enlace"',
          '2. Ve a Google Calendar (calendar.google.com)',
          '3. En el menú izquierdo, haz clic en "+" junto a "Otros calendarios"',
          '4. Selecciona "Desde URL"',
          '5. Pega el enlace copiado',
          '6. Haz clic en "Agregar calendario"',
          '7. ¡Listo! Se sincronizará automáticamente'
        ]
      },
      {
        platform: 'Outlook / Office 365',
        steps: [
          '1. Haz clic en "📋 Copiar Enlace"',
          '2. Ve a Outlook en la web',
          '3. Haz clic en "Agregar calendario" → "Suscribirse desde web"',
          '4. Pega el enlace en "URL del calendario"',
          '5. Asigna un nombre: "UPN - Calendario Académico"',
          '6. Haz clic en "Importar"',
          '7. ¡Aparecerá en tu lista de calendarios!'
        ]
      },
      {
        platform: 'Apple Calendar (Mac/iPhone)',
        steps: [
          '1. Haz clic en "📋 Copiar Enlace"',
          '2. Abre la app Calendario',
          '3. Ve a Archivo → Nueva suscripción a calendario (Mac)',
          '4. O Configuración → Cuentas → Agregar cuenta (iPhone)',
          '5. Pega el enlace copiado',
          '6. Configura nombre y color',
          '7. ¡Se sincronizará automáticamente!'
        ]
      },
      {
        platform: 'Descargar archivo .ics',
        steps: [
          '1. Haz clic en "💾 Descargar .ics"',
          '2. Guarda el archivo en tu dispositivo',
          '3. Haz doble clic en el archivo descargado',
          '4. Se abrirá automáticamente tu app de calendario',
          '5. Confirma la importación',
          '6. ¡Todos los eventos aparecerán!'
        ]
      }
    ];
  }
}

// Exportar instancia singleton
export const calendarGeneratorService = new CalendarGeneratorService();
export type { CalendarEvent, CalendarSyncStatus };
