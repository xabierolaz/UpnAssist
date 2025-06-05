/**
 * Servicio para interactuar con JPlag desde la interfaz de UpnAssist
 * Nota: En un entorno de navegador, la ejecución real de JPlag debe hacerse desde el servidor
 */
export class JPlagService {
  private readonly jplagPath: string = 'd:\\UpnAssist\\JPlag\\cli\\target\\jplag-cli-6.1.0-jar-with-dependencies.jar';
  
  /**
   * Ejecuta el análisis de JPlag con los archivos seleccionados
   * En un entorno de navegador, esto proporcionará instrucciones para ejecutar desde la línea de comandos
   * @param filesPath Ruta a la carpeta con los archivos a analizar
   * @param options Opciones adicionales para JPlag
   * @returns Resultado del análisis simulado
   */
  async runAnalysis(filesPath: string, options: JPlagOptions = {}): Promise<JPlagResult> {
    try {
      // En un entorno de navegador, simulamos el análisis
      // En una aplicación real, esto se haría a través de una API del servidor
      const command = this.buildCommand(filesPath, options);
      
      console.log('Comando JPlag que se ejecutaría:', command);
        // Devolver un resultado simulado
      return {
        success: true,
        averageSimilarity: 34.45,
        similarities: [
          {
            submission1: 'Entrega1.java',
            submission2: 'Entrega2.java',
            similarity: 45.8
          },
          {
            submission1: 'Entrega2.java',
            submission2: 'Entrega3.java',
            similarity: 23.1
          }
        ],
        outputPath: 'results/'
      };
    } catch (error) {
      console.error('Error en análisis de JPlag:', error);
      throw error;
    }
  }
  
  /**
   * Construye el comando para ejecutar JPlag
   */
  private buildCommand(filesPath: string, options: JPlagOptions): string {
    let command = `java -jar "${this.jplagPath}"`;
    
    // Añadir lenguaje
    command += ` -l ${options.language || 'java'}`;
    
    // Añadir umbral de similitud
    if (options.similarityThreshold) {
      command += ` -t ${options.similarityThreshold}`;
    }
    
    // Añadir tokens mínimos
    if (options.minTokenMatch) {
      command += ` -m ${options.minTokenMatch}`;
    }
    
    // Ruta de resultados
    if (options.resultPath) {
      command += ` -r "${options.resultPath}"`;
    }
    
    // Carpeta a analizar
    command += ` "${filesPath}"`;
    
    return command;
  }
  
  
}

/**
 * Opciones para la ejecución de JPlag
 */
export interface JPlagOptions {
  language?: string;
  similarityThreshold?: number;
  minTokenMatch?: number;
  resultPath?: string;
}

/**
 * Resultado del análisis de JPlag
 */
export interface JPlagResult {
  success: boolean;
  averageSimilarity: number;
  similarities: Similarity[];
  outputPath: string;
}

/**
 * Representa una similitud entre dos entregas
 */
export interface Similarity {
  submission1: string;
  submission2: string;
  similarity: number;
}

// Instancia singleton del servicio
export const jplagService = new JPlagService();
