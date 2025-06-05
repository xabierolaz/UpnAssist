/**
 * Configuración del sistema de chat de UpnAssist
 * 
 * Contiene constantes y valores de configuración para el chat
 * que afectan a seguridad, rendimiento y experiencia de usuario
 */

// Configuración de cifrado
export const ENCRYPTION_CONFIG = {
  // Algoritmo AES-GCM con clave de 256 bits
  ALGORITHM: 'AES-GCM',
  KEY_LENGTH: 256,
  IV_LENGTH: 12, // Bytes
  
  // Derivación de claves con PBKDF2
  KEY_DERIVATION: {
    ALGORITHM: 'PBKDF2',
    ITERATIONS: 100000,
    HASH: 'SHA-256'
  },
  
  // Prefijo para evitar colisión de nombres
  KEY_PREFIX: 'upn-secure-chat',
  SALT: 'upn-chat-salt'
};

// Configuración de almacenamiento local
export const STORAGE_CONFIG = {
  // Claves para localStorage
  KEYS: {
    MESSAGES: 'upn-chat-messages',
    LAST_CLEANED: 'upn-chat-last-cleaned',
    SETTINGS: 'upn-chat-settings'
  },
  
  // Límites de mensajes y tiempos
  LIMITS: {
    MAX_STORED_MESSAGES: 100,
    MAX_MESSAGE_AGE_DAYS: 7,
    CLEANUP_INTERVAL_HOURS: 24
  }
};

// Configuración de red y conexión
export const NETWORK_CONFIG = {
  // Datos del servidor Socket.io
  SERVER: {
    URL: 'https://socket-io-realtime.herokuapp.com',
    ROOM_NAME: 'upn-professors',
    TIMEOUT_MS: 20000,
    RECONNECTION_ATTEMPTS: 10,
    RECONNECTION_DELAY_MS: 1000
  },
  
  // Intervalos para operaciones de red
  INTERVALS: {
    PING_INTERVAL_MS: 15000,
    USER_LIST_REFRESH_MS: 10000
  }
};

// Configuración de interfaz de usuario
export const UI_CONFIG = {
  // Tiempos de animación y notificaciones
  ANIMATIONS: {
    MESSAGE_FADE_MS: 300,
    NOTIFICATION_DURATION_MS: 3000
  },
  
  // Límites de interfaz
  LIMITS: {
    MAX_MESSAGE_LENGTH: 500,
    MAX_USERNAME_LENGTH: 30
  }
};

// Configuración de privacidad
export const PRIVACY_CONFIG = {
  // No se almacenan mensajes en el servidor
  SERVER_STORAGE: false,
  
  // Se cifran mensajes de extremo a extremo
  END_TO_END_ENCRYPTION: true,
  
  // No se guarda información de perfil permanente
  PERSISTENT_PROFILES: false
};
