import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Servicio para interactuar con JPlag desde la interfaz de UpnAssist
 */
export class JPlagService {
  private readonly jplagPath: string = 'd:\\UpnAssist\\JPlag\\cli\\target\\jplag-cli-6.1.0-jar-with-dependencies.jar';
  
  /**
   * Ejecuta el análisis de JPlag con los archivos seleccionados
   * @param filesPath Ruta a la carpeta con los archivos a analizar
   * @param options Opciones adicionales para JPlag
   * @returns Resultado del análisis
   */
  async runAnalysis(filesPath: string, options: JPlagOptions = {}): Promise<JPlagResult> {
    try {
      // Construir comando con opciones
      const command = this.buildCommand(filesPath, options);
      
      // Ejecutar JPlag
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes('INFO')) {
        throw new Error(`Error al ejecutar JPlag: ${stderr}`);
      }
      
      // Analizar la salida para extraer resultados
      return this.parseOutput(stdout);
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
  
  /**
   * Analiza la salida de JPlag para extraer resultados
   */
  private parseOutput(output: string): JPlagResult {
    // Extraer información de similitud
    const similarities: Similarity[] = [];
    const lines = output.split('\n');
    
    // Detectar líneas que contienen resultados de comparaciones
    for (const line of lines) {
      if (line.includes('matches averaged')) {
        const match = line.match(/(\d+\.\d+)%/);
        if (match) {
          const avgSimilarity = parseFloat(match[1]);
          return {
            success: true,
            averageSimilarity: avgSimilarity,
            similarities,
            outputPath: this.extractOutputPath(output)
          };
        }
      } else if (line.includes(':') && line.includes('%')) {
        // Línea de comparación entre entregas
        const parts = line.trim().split(':');
        if (parts.length >= 2) {
          const submissions = parts[0].trim();
          const [sub1, sub2] = submissions.split('-').map(s => s.trim());
          
          const percentMatch = parts[1].match(/(\d+\.\d+)%/);
          if (percentMatch && sub1 && sub2) {
            similarities.push({
              submission1: sub1,
              submission2: sub2,
              similarity: parseFloat(percentMatch[1])
            });
          }
        }
      }
    }
    
    return {
      success: true,
      averageSimilarity: this.calculateAverage(similarities),
      similarities,
      outputPath: this.extractOutputPath(output)
    };
  }
  
  /**
   * Extrae la ruta del archivo de resultados
   */
  private extractOutputPath(output: string): string {
    const match = output.match(/Resultado escrito exitosamente en: (.+\.jplag)/);
    return match ? match[1] : '';
  }
  
  /**
   * Calcula la similitud promedio
   */
  private calculateAverage(similarities: Similarity[]): number {
    if (similarities.length === 0) return 0;
    
    const sum = similarities.reduce((acc, curr) => acc + curr.similarity, 0);
    return sum / similarities.length;
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
