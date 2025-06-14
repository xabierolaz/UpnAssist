/**
 * Servicio de Generación de Calendarios iCal
 * 
 * Proporciona funcionalidades para:
 * - Generación de calendarios .ics estándar
 * - Enlaces webcal:// para suscripción automática
 * - Calendarios temáticos (horarios, eventos, reuniones)
 * - Sin acceso a datos personales del usuario
 */

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  category: 'horario' | 'reunion' | 'evento' | 'personal';
  recurring?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    until?: Date;
    days?: string[]; // ['MO', 'WE', 'FR']
  };
}

interface Calendar {
  id: string;
  name: string;
  description: string;
  color: string;
  category: string;
  events: CalendarEvent[];
  enabled: boolean;
  lastUpdated: Date;
}

interface CalendarLink {
  id: string;
  name: string;
  description: string;
  icsUrl: string;
  webcalUrl: string;
  googleUrl: string;
  outlookUrl: string;
  appleUrl: string;
}

class CalendarService {
  private calendars: Map<string, Calendar> = new Map();
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getBaseUrl();
    this.initializeDefaultCalendars();
  }

  /**
   * Obtiene la URL base para los calendarios
   */
  private getBaseUrl(): string {
    const { protocol, hostname, port } = window.location;
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portSuffix}`;
  }

  /**
   * Inicializa calendarios por defecto
   */
  private initializeDefaultCalendars() {
    const defaultCalendars: Omit<Calendar, 'events' | 'lastUpdated'>[] = [
      {
        id: 'horario-clases',
        name: 'Mi Horario de Clases',
        description: 'Horario personal de clases y asignaturas',
        color: '#1976d2',
        category: 'horario',
        enabled: true
      },
      {
        id: 'reuniones-departamento',
        name: 'Reuniones de Departamento',
        description: 'Reuniones, claustros y eventos departamentales',
        color: '#d32f2f',
        category: 'reunion',
        enabled: true
      },
      {
        id: 'eventos-academicos',
        name: 'Eventos Académicos UPN',
        description: 'Conferencias, seminarios y eventos académicos',
        color: '#388e3c',
        category: 'evento',
        enabled: true
      },
      {
        id: 'calendario-personal',
        name: 'Mi Calendario Personal',
        description: 'Recordatorios y eventos personales',
        color: '#f57c00',
        category: 'personal',
        enabled: false
      }
    ];

    defaultCalendars.forEach(cal => {
      this.calendars.set(cal.id, {
        ...cal,
        events: this.generateSampleEvents(cal.category as any),
        lastUpdated: new Date()
      });
    });
  }

  /**
   * Genera eventos de ejemplo para cada categoría
   */
  private generateSampleEvents(category: CalendarEvent['category']): CalendarEvent[] {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (category) {
      case 'horario':
        return [
          {
            id: 'clase-1',
            title: 'Programación I - Teoría',
            description: 'Clase teórica de Programación I - Tema: Estructuras de Control',
            start: new Date(tomorrow.setHours(9, 0, 0, 0)),
            end: new Date(tomorrow.setHours(10, 30, 0, 0)),
            location: 'Aula 201 - Los Encinas',
            category: 'horario',
            recurring: {
              frequency: 'WEEKLY',
              days: ['MO', 'WE', 'FR'],
              until: new Date(2025, 5, 30) // Fin de semestre
            }
          },
          {
            id: 'clase-2',
            title: 'Bases de Datos - Laboratorio',
            description: 'Práctica de laboratorio - SQL y diseño de BD',
            start: new Date(tomorrow.setHours(11, 0, 0, 0)),
            end: new Date(tomorrow.setHours(12, 30, 0, 0)),
            location: 'Lab. Informática B',
            category: 'horario',
            recurring: {
              frequency: 'WEEKLY',
              days: ['TU', 'TH']
            }
          }
        ];

      case 'reunion':
        return [
          {
            id: 'reunion-1',
            title: 'Reunión Departamento Informática',
            description: 'Reunión mensual - Orden del día: Planificación docente',
            start: new Date(nextWeek.setHours(16, 0, 0, 0)),
            end: new Date(nextWeek.setHours(18, 0, 0, 0)),
            location: 'Sala de Juntas - Edificio A',
            category: 'reunion'
          }
        ];

      case 'evento':
        return [
          {
            id: 'evento-1',
            title: 'Conferencia: IA en Educación',
            description: 'Conferencia magistral sobre Inteligencia Artificial aplicada a la educación',
            start: new Date(nextWeek.setHours(10, 0, 0, 0)),
            end: new Date(nextWeek.setHours(12, 0, 0, 0)),
            location: 'Aula Magna - Campus Arrosadía',
            category: 'evento'
          }
        ];

      case 'personal':
        return [
          {
            id: 'personal-1',
            title: 'Recordatorio: Entregar notas',
            description: 'Fecha límite para entregar calificaciones del primer parcial',
            start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            category: 'personal'
          }
        ];

      default:
        return [];
    }
  }

  /**
   * Obtiene todos los calendarios disponibles
   */
  getAvailableCalendars(): Calendar[] {
    return Array.from(this.calendars.values());
  }

  /**
   * Obtiene un calendario específico
   */
  getCalendar(id: string): Calendar | undefined {
    return this.calendars.get(id);
  }

  /**
   * Habilita o deshabilita un calendario
   */
  toggleCalendar(id: string, enabled: boolean): void {
    const calendar = this.calendars.get(id);
    if (calendar) {
      calendar.enabled = enabled;
      calendar.lastUpdated = new Date();
    }
  }

  /**
   * Genera enlaces para suscripción a calendarios
   */
  getCalendarLinks(calendarId: string): CalendarLink | null {
    const calendar = this.calendars.get(calendarId);
    if (!calendar) return null;

    const icsUrl = `${this.baseUrl}/api/calendar/${calendarId}.ics`;
    const webcalUrl = icsUrl.replace('http://', 'webcal://').replace('https://', 'webcal://');
    
    // URLs para diferentes proveedores
    const googleUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(webcalUrl)}`;
    const outlookUrl = `https://outlook.live.com/owa/?path=/calendar/action/compose&rru=addsubscription&url=${encodeURIComponent(icsUrl)}&name=${encodeURIComponent(calendar.name)}`;
    const appleUrl = webcalUrl; // Apple Calendar maneja webcal:// nativamente

    return {
      id: calendarId,
      name: calendar.name,
      description: calendar.description,
      icsUrl,
      webcalUrl,
      googleUrl,
      outlookUrl,
      appleUrl
    };
  }

  /**
   * Genera archivo iCal (.ics) para un calendario
   */
  generateICS(calendarId: string): string {
    const calendar = this.calendars.get(calendarId);
    if (!calendar) return '';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UpnAssist//Calendar Generator//ES',
      `X-WR-CALNAME:${calendar.name}`,
      `X-WR-CALDESC:${calendar.description}`,
      'X-WR-TIMEZONE:Europe/Madrid',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    calendar.events.forEach(event => {
      ics.push(...this.eventToICS(event));
    });

    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
  }

  /**
   * Convierte un evento a formato iCal
   */
  private eventToICS(event: CalendarEvent): string[] {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const lines = [
      'BEGIN:VEVENT',
      `UID:${event.id}@upnassist.local`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || ''}`,
      `CATEGORIES:${event.category.toUpperCase()}`,
      `CREATED:${formatDate(new Date())}`,
      `LAST-MODIFIED:${formatDate(new Date())}`
    ];

    // Agregar recurrencia si existe
    if (event.recurring) {
      let rrule = `FREQ=${event.recurring.frequency}`;
      
      if (event.recurring.days && event.recurring.days.length > 0) {
        rrule += `;BYDAY=${event.recurring.days.join(',')}`;
      }
      
      if (event.recurring.until) {
        rrule += `;UNTIL=${formatDate(event.recurring.until)}`;
      }
      
      lines.push(`RRULE:${rrule}`);
    }

    lines.push('END:VEVENT');
    return lines;
  }

  /**
   * Actualiza eventos de un calendario
   */
  updateCalendarEvents(calendarId: string, events: CalendarEvent[]): void {
    const calendar = this.calendars.get(calendarId);
    if (calendar) {
      calendar.events = events;
      calendar.lastUpdated = new Date();
    }
  }

  /**
   * Añade un evento a un calendario
   */
  addEvent(calendarId: string, event: CalendarEvent): void {
    const calendar = this.calendars.get(calendarId);
    if (calendar) {
      calendar.events.push(event);
      calendar.lastUpdated = new Date();
    }
  }

  /**
   * Elimina un evento de un calendario
   */
  removeEvent(calendarId: string, eventId: string): void {
    const calendar = this.calendars.get(calendarId);
    if (calendar) {
      calendar.events = calendar.events.filter(e => e.id !== eventId);
      calendar.lastUpdated = new Date();
    }
  }

  /**
   * Exporta la configuración de calendarios
   */
  exportConfiguration(): object {
    return {
      calendars: Array.from(this.calendars.values()),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  /**
   * Importa configuración de calendarios
   */
  importConfiguration(config: any): void {
    if (config.calendars && Array.isArray(config.calendars)) {
      config.calendars.forEach((cal: Calendar) => {
        this.calendars.set(cal.id, {
          ...cal,
          events: cal.events.map(e => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end)
          }))
        });
      });
    }
  }
}

// Exportar instancia singleton
export const calendarService = new CalendarService();
export type { Calendar, CalendarEvent, CalendarLink };
