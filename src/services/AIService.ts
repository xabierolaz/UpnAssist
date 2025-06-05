// Servicio de IA para UpnAssist
// Soporta Ollama (local) y OpenRouter (online) como fallback

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  source: 'ollama' | 'openrouter' | 'fallback';
  model?: string;
  error?: string;
}

class AIService {
  private baseKnowledge: string = '';
  private conversation: AIMessage[] = [];
  private ollamaUrl: string = 'http://localhost:11434';
  private openRouterKey: string = ''; // Usuario puede agregar su clave opcional

  constructor() {
    this.loadBaseKnowledge();
    this.initializeSystemPrompt();
  }

  private async loadBaseKnowledge(): Promise<void> {
    try {
      // En producción, esto se cargaría desde el servidor
      // Por ahora, incluimos el conocimiento base directamente
      this.baseKnowledge = `
Eres un asistente especializado en UpnAssist, una aplicación web para profesores universitarios de la UPN.

CONOCIMIENTO BASE:
- UpnAssist es desarrollado por Xabier Olaz Moratinos
- Es una herramienta de ayuda personal docente e investigador
- Web: https://upnassist.vercel.app/

FUNCIONALIDADES PRINCIPALES:
1. Dashboard con calendario de 6 clases semanales
2. Detector de Copias para análisis de plagios
3. Chat en tiempo real (máximo 50 usuarios)
4. Sistema de correo integrado
5. Gestión de recursos académicos
6. Herramientas de cálculo de notas

UBICACIONES UPN:
- A-329 Aulario
- E-201 Los Encinas  
- P-103 Los Pinos

HORARIOS:
- Lunes 08:00: Programación I (45 estudiantes)
- Martes 10:00: Estructuras de Datos (38 estudiantes)
- Miércoles 09:00: Bases de Datos (42 estudiantes)
- Jueves 14:00: Programación I (45 estudiantes)
- Viernes 11:00: Estructuras de Datos (38 estudiantes)
- Sábado 08:00: Bases de Datos (42 estudiantes)

TECNOLOGÍAS:
- React 18 + TypeScript
- Tailwind CSS
- Vite
- Socket.io para chat

INSTRUCCIONES:
- Responde siempre en español
- Sé conciso pero informativo
- Si no sabes algo específico, sugiere dónde podría encontrarse
- Ayuda con funcionalidades como imprimir, exportar, subir archivos
- Proporciona pasos claros y precisos
`;
    } catch (error) {
      console.warn('No se pudo cargar el conocimiento base:', error);
    }
  }

  private initializeSystemPrompt(): void {
    this.conversation = [{
      role: 'system',
      content: this.baseKnowledge,
      timestamp: new Date()
    }];
  }

  // Intentar con Ollama primero (local, gratuito)
  private async queryOllama(message: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b', // Modelo pequeño pero eficiente
          prompt: this.buildPrompt(message),
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      });

      if (!response.ok) throw new Error('Ollama no disponible');      const data = await response.json();
      return {
        message: data.response,
        source: 'ollama',
        model: 'llama3.2:3b'
      };
    } catch (error) {
      throw new Error(`Ollama error: ${error}`);
    }
  }

  // Fallback a OpenRouter (online, gratuito con límites)
  private async queryOpenRouter(message: string): Promise<AIResponse> {
    try {
      // Usar modelo gratuito de OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterKey || 'sk-or-v1-free'}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://upnassist.vercel.app',
          'X-Title': 'UpnAssist AI Assistant'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free', // Modelo gratuito
          messages: [
            { role: 'system', content: this.baseKnowledge },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('OpenRouter no disponible');      const data = await response.json();
      return {
        message: data.choices[0].message.content,
        source: 'openrouter',
        model: 'mistral-7b-instruct'
      };
    } catch (error) {
      throw new Error(`OpenRouter error: ${error}`);
    }
  }

  // Respuestas predefinidas como último recurso
  private getFallbackResponse(message: string): AIResponse {
    const lowercaseMessage = message.toLowerCase();
    
    // Respuestas específicas de UpnAssist
    if (lowercaseMessage.includes('imprimir')) {
      return {
        message: '🖨️ Para imprimir en UpnAssist:\n\n1. Presiona Ctrl+P en tu teclado\n2. O ve al menú del navegador → Imprimir\n3. En Dashboard y Recursos verás opciones específicas de exportación\n\n¿Te ayudo con algo más específico?',
        source: 'fallback'
      };
    }

    if (lowercaseMessage.includes('exportar') || lowercaseMessage.includes('descargar')) {
      return {
        message: '📊 Para exportar datos en UpnAssist:\n\n• **Dashboard**: Exporta horarios y estadísticas desde los botones de acción\n• **Detector de Copias**: Descarga reportes de análisis\n• **Recursos**: Botón "Descargar" en cada archivo\n• **Correo**: Función de exportar conversaciones\n\n¿Qué específicamente quieres exportar?',
        source: 'fallback'
      };
    }

    if (lowercaseMessage.includes('subir') || lowercaseMessage.includes('archivo')) {
      return {
        message: '📁 Para subir archivos en UpnAssist:\n\n• **Detector de Copias**: Arrastra archivos o usa "Seleccionar Archivos" (PDF, DOC, DOCX, TXT máx. 10MB)\n• **Recursos**: Botón "Subir" en la biblioteca\n• **Chat**: Solo texto, no soporta archivos\n\n¿En qué sección necesitas subir archivos?',
        source: 'fallback'
      };
    }

    if (lowercaseMessage.includes('horario') || lowercaseMessage.includes('clase')) {
      return {
        message: '📅 **Horarios de Clases en UpnAssist:**\n\n• Lunes 08:00 - Programación I (A-329 Aulario, 45 estudiantes)\n• Martes 10:00 - Estructuras de Datos (E-201 Los Encinas, 38 estudiantes)\n• Miércoles 09:00 - Bases de Datos (P-103 Los Pinos, 42 estudiantes)\n• Jueves 14:00 - Programación I (A-329 Aulario, 45 estudiantes)\n• Viernes 11:00 - Estructuras de Datos (E-201 Los Encinas, 38 estudiantes)\n• Sábado 08:00 - Bases de Datos (P-103 Los Pinos, 42 estudiantes)\n\nVe al Dashboard para ver el calendario completo.',
        source: 'fallback'
      };
    }

    if (lowercaseMessage.includes('chat') || lowercaseMessage.includes('mensaje')) {
      return {
        message: '💬 **Chat en UpnAssist:**\n\n• Tiempo real hasta 50 usuarios concurrentes\n• Funciona entre diferentes redes (WiFi, móviles)\n• Solo texto, no archivos\n• Acceso desde cualquier dispositivo\n• Sin necesidad de registro\n\nVe a la pestaña "Chat" para empezar a conversar.',
        source: 'fallback'
      };
    }

    if (lowercaseMessage.includes('móvil') || lowercaseMessage.includes('celular') || lowercaseMessage.includes('telefono')) {
      return {
        message: '📱 **UpnAssist en Móvil:**\n\n• Accede desde cualquier navegador: https://upnassist.vercel.app/\n• 100% responsivo y táctil\n• Navegación optimizada por pestañas\n• Todas las funciones disponibles\n• Compatible con Android e iOS\n\n¡Úsalo desde donde estés!',
        source: 'fallback'
      };
    }

    // Respuesta genérica
    return {
      message: '🤖 ¡Hola! Soy el asistente de UpnAssist.\n\n**Puedo ayudarte con:**\n• Funcionalidades de la aplicación\n• Cómo imprimir, exportar o subir archivos\n• Información sobre horarios y clases\n• Guía del chat y herramientas\n• Navegación en móvil y desktop\n\n**Pregúntame cosas como:**\n"¿Cómo imprimir mi horario?"\n"¿Dónde subo archivos al detector de copias?"\n"¿Cuáles son mis clases de esta semana?"\n\n¿En qué te puedo ayudar?',
      source: 'fallback'
    };
  }

  private buildPrompt(userMessage: string): string {
    return `${this.baseKnowledge}

CONVERSACIÓN ANTERIOR:
${this.conversation.slice(-3).map(msg => 
  msg.role === 'user' ? `Usuario: ${msg.content}` : 
  msg.role === 'assistant' ? `Asistente: ${msg.content}` : ''
).filter(Boolean).join('\n')}

NUEVA PREGUNTA:
Usuario: ${userMessage}

Asistente: `;
  }

  async sendMessage(message: string): Promise<AIResponse> {
    // Agregar mensaje del usuario a la conversación
    this.conversation.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    try {
      // Intentar Ollama primero (local, ilimitado)
      const response = await this.queryOllama(message);
      
      // Agregar respuesta a la conversación
      this.conversation.push({
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      });

      return response;
    } catch (ollamaError) {
      try {
        // Fallback a OpenRouter (online, límites generosos)
        const response = await this.queryOpenRouter(message);
        
        this.conversation.push({
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        });

        return response;
      } catch (openRouterError) {
        // Último recurso: respuestas predefinidas
        const response = this.getFallbackResponse(message);
        
        this.conversation.push({
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        });

        return response;
      }
    }
  }
  // Limpiar conversación
  clearConversation(): void {
    this.initializeSystemPrompt();
  }

  // Alias para compatibilidad
  clearContext(): void {
    this.clearConversation();
  }

  // Obtener conversación actual
  getConversation(): AIMessage[] {
    return this.conversation.filter(msg => msg.role !== 'system');
  }

  // Configurar clave de OpenRouter (opcional)
  setOpenRouterKey(key: string): void {
    this.openRouterKey = key;
  }

  // Verificar si Ollama está disponible
  async checkOllamaAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/version`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Obtener servicios disponibles
  async getAvailableServices(): Promise<{ollama: boolean, openrouter: boolean}> {
    const ollama = await this.checkOllamaAvailability();
    const openrouter = !!this.openRouterKey;
    return { ollama, openrouter };
  }
}

export default AIService;

const aiService = new AIService();
export { aiService };
