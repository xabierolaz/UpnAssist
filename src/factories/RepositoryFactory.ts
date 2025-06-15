import type { IChatRepository } from '../interfaces/IChatRepository';
import type { ISubjectRepository } from '../interfaces/ISubjectRepository';
import { SocketChatRepository } from '../repositories/SocketChatRepository';
import { LocalStorageSubjectRepository } from '../repositories/LocalStorageSubjectRepository';

/**
 * Factory para crear instancias de repositorios
 * Centraliza la creación y configuración de dependencias
 */
export class RepositoryFactory {
  private static chatRepository: IChatRepository | null = null;
  private static subjectRepository: ISubjectRepository | null = null;

  /**
   * Obtiene una instancia singleton del repositorio de chat
   */  static getChatRepository(): IChatRepository {
    if (!this.chatRepository) {
      this.chatRepository = new SocketChatRepository();
    }
    return this.chatRepository!;
  }

  /**
   * Obtiene una instancia singleton del repositorio de asignaturas
   */
  static getSubjectRepository(): ISubjectRepository {
    if (!this.subjectRepository) {
      this.subjectRepository = new LocalStorageSubjectRepository();
    }
    return this.subjectRepository;
  }

  /**
   * Permite inyectar repositorios personalizados (útil para testing)
   */
  static setChatRepository(repository: IChatRepository): void {
    this.chatRepository = repository;
  }

  static setSubjectRepository(repository: ISubjectRepository): void {
    this.subjectRepository = repository;
  }

  /**
   * Resetea todas las instancias (útil para testing)
   */
  static reset(): void {
    this.chatRepository = null;
    this.subjectRepository = null;
  }
}
