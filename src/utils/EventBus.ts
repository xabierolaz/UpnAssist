/**
 * Event Bus para desacoplar comunicación entre servicios
 * Permite comunicación sin dependencias directas
 */
export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Emite un evento
   */
  emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Registra un listener para un evento
   */
  on(event: string, listener: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push(listener);

    // Retorna función para desregistrar
    return () => this.off(event, listener);
  }

  /**
   * Elimina un listener específico
   */
  off(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Elimina todos los listeners de un evento
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Lista de eventos disponibles
   */
  static readonly Events = {
    // Chat events
    CHAT_CONNECTION_CHANGED: 'chat:connection:changed',
    CHAT_MESSAGE_RECEIVED: 'chat:message:received',
    CHAT_ROOM_JOINED: 'chat:room:joined',
    CHAT_ROOM_LEFT: 'chat:room:left',
    CHAT_USERS_UPDATED: 'chat:users:updated',

    // Subject events
    SUBJECT_ADDED: 'subject:added',
    SUBJECT_REMOVED: 'subject:removed',
    SUBJECT_UPDATED: 'subject:updated',

    // Auth events
    AUTH_LOGIN: 'auth:login',
    AUTH_LOGOUT: 'auth:logout',

    // UI events
    UI_MODAL_OPEN: 'ui:modal:open',
    UI_MODAL_CLOSE: 'ui:modal:close',
    UI_NOTIFICATION: 'ui:notification',

    // Calendar events
    CALENDAR_EVENT_ADDED: 'calendar:event:added',
    CALENDAR_EVENT_UPDATED: 'calendar:event:updated',
    CALENDAR_EVENT_DELETED: 'calendar:event:deleted'
  } as const;
}
