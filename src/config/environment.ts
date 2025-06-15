/**
 * Environment Configuration Service
 * Maneja todas las variables de entorno de forma segura
 */

interface EnvConfig {
  // Authentication
  authSecretKey: string;
  sessionTimeout: number;
  
  // Chat System  
  socketServerUrl: string;
  chatRoomPassword: string;
  chatMaxUsers: number;
  
  // AI Services
  openRouterApiKey?: string;
  ollamaEndpoint: string;
  
  // Email System
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  
  // Security
  encryptionKey: string;
  csrfTokenExpiry: number;
  
  // Features
  enableDebug: boolean;
  enableAnalytics: boolean;
  maxFileSize: number;
}

class EnvironmentService {
  private config: EnvConfig;
  
  constructor() {
    this.config = this.loadConfiguration();
    this.validateRequired();
  }
  
  private loadConfiguration(): EnvConfig {
    return {
      // Authentication
      authSecretKey: import.meta.env.VITE_AUTH_SECRET_KEY || this.generateFallbackKey(),
      sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000,
      
      // Chat System
      socketServerUrl: import.meta.env.VITE_SOCKET_SERVER_URL || 'https://socket-io-realtime.herokuapp.com',
      chatRoomPassword: import.meta.env.VITE_CHAT_ROOM_PASSWORD || '',
      chatMaxUsers: parseInt(import.meta.env.VITE_CHAT_MAX_USERS) || 50,
      
      // AI Services
      openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
      ollamaEndpoint: import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434',
      
      // Email System
      smtpHost: import.meta.env.VITE_SMTP_HOST || 'smtp.unavarra.es',
      smtpPort: parseInt(import.meta.env.VITE_SMTP_PORT) || 587,
      smtpUser: import.meta.env.VITE_SMTP_USER || '',
      smtpPass: import.meta.env.VITE_SMTP_PASS || '',
      
      // Security
      encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || this.generateFallbackKey(),
      csrfTokenExpiry: parseInt(import.meta.env.VITE_CSRF_TOKEN_EXPIRY) || 1800000,
      
      // Features
      enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    };
  }
  
  private validateRequired(): void {
    const requiredFields = [
      'authSecretKey',
      'encryptionKey'
    ];
    
    const missing = requiredFields.filter(field => 
      !this.config[field as keyof EnvConfig] || 
      this.config[field as keyof EnvConfig] === ''
    );
    
    if (missing.length > 0) {
      console.warn('⚠️ Missing environment variables:', missing);
      console.warn('Using fallback values for security keys');
    }
  }
  
  private generateFallbackKey(): string {
    // Generar clave aleatoria de 32 bytes para uso de desarrollo
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Getters públicos
  get auth() {
    return {
      secretKey: this.config.authSecretKey,
      sessionTimeout: this.config.sessionTimeout
    };
  }
  
  get chat() {
    return {
      serverUrl: this.config.socketServerUrl,
      roomPassword: this.config.chatRoomPassword,
      maxUsers: this.config.chatMaxUsers
    };
  }
  
  get ai() {
    return {
      openRouterKey: this.config.openRouterApiKey,
      ollamaEndpoint: this.config.ollamaEndpoint
    };
  }
  
  get email() {
    return {
      host: this.config.smtpHost,
      port: this.config.smtpPort,
      user: this.config.smtpUser,
      password: this.config.smtpPass
    };
  }
  
  get security() {
    return {
      encryptionKey: this.config.encryptionKey,
      csrfTokenExpiry: this.config.csrfTokenExpiry
    };
  }
  
  get features() {
    return {
      debug: this.config.enableDebug,
      analytics: this.config.enableAnalytics,
      maxFileSize: this.config.maxFileSize
    };
  }
  
  // Método para debugging (solo en desarrollo)
  getConfig(): EnvConfig | null {
    if (import.meta.env.DEV) {
      return { ...this.config };
    }
    return null;
  }
}

// Singleton para uso global
export const envConfig = new EnvironmentService();
export default envConfig;
