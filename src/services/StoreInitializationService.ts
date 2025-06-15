import { useChatStore } from '../stores/chatStore';
import { useDashboardStore } from '../stores/dashboardStore';
import { useUserStore } from '../stores/userStore';
import { useAppStore } from '../stores/appStore';
import { RepositoryFactory } from '../factories/RepositoryFactory';
import { EventBus } from '../utils/EventBus';
import { sampleSubjects } from '../data/sampleSubjects';

/**
 * Service to initialize Zustand stores with data and sync with repositories
 */
export class StoreInitializationService {
  private static instance: StoreInitializationService;
  private initialized = false;

  private constructor() {}

  static getInstance(): StoreInitializationService {
    if (!StoreInitializationService.instance) {
      StoreInitializationService.instance = new StoreInitializationService();
    }
    return StoreInitializationService.instance;
  }

  /**
   * Initialize all stores with initial data
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.initializeChatStore();
      this.initializeUserStore();
      this.initializeDashboardStore();
      this.initializeAppStore();
      
      this.setupEventListeners();
      
      this.initialized = true;
      console.log('[StoreInit] All stores initialized successfully');
    } catch (error) {
      console.error('[StoreInit] Error initializing stores:', error);
      throw error;
    }
  }

  /**
   * Initialize chat store with subjects and rooms
   */
  private async initializeChatStore(): Promise<void> {
    const chatStore = useChatStore.getState();
    const subjectRepository = RepositoryFactory.getSubjectRepository();

    // Load subjects from repository
    let subjects = subjectRepository.getAllSubjects();
    
    // If no subjects, load sample data
    if (subjects.length === 0) {
      sampleSubjects.forEach(subject => {
        subjectRepository.addSubject(subject);
      });
      subjects = subjectRepository.getAllSubjects();
    }

    // Load active rooms
    const activeRooms = subjectRepository.getJoinedRooms();

    // Update chat store
    chatStore.setSubjects(subjects);
    chatStore.setActiveRooms(activeRooms);

    console.log('[StoreInit] Chat store initialized with', subjects.length, 'subjects and', activeRooms.length, 'active rooms');
  }
  /**
   * Initialize user store
   */
  private initializeUserStore(): void {
    const userStore = useUserStore.getState();
    
    // Set default user (since password login is disabled)
    const defaultUser = {
      id: 'default-user',
      name: 'Usuario PDI',
      email: 'usuario@unavarra.es',
      role: 'teacher' as const,
      isOnline: true,
    };
    
    userStore.setUser(defaultUser);
    
    // Load user preferences from localStorage if available
    const savedPreferences = localStorage.getItem('user-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        userStore.updatePreferences(preferences);
      } catch (error) {
        console.warn('[StoreInit] Could not load user preferences:', error);
      }
    }

    console.log('[StoreInit] User store initialized');
  }

  /**
   * Initialize dashboard store
   */
  private initializeDashboardStore(): void {
    const dashboardStore = useDashboardStore.getState();
    
    // Load calendar status from localStorage if available
    const savedCalendarStatus = localStorage.getItem('calendar-status');
    if (savedCalendarStatus) {
      try {
        const status = JSON.parse(savedCalendarStatus);
        dashboardStore.setCalendarStatus(status);
      } catch (error) {
        console.warn('[StoreInit] Could not load calendar status:', error);
      }
    }

    console.log('[StoreInit] Dashboard store initialized');
  }
  /**
   * Initialize app store
   */
  private initializeAppStore(): void {
    const appStore = useAppStore.getState();
    
    // Set system as ready
    appStore.setSystemStatus({ 
      isOnline: true,
      lastUpdate: new Date(),
      maintenanceMode: false
    });
    
    // Add welcome notification
    appStore.addNotification({
      type: 'info',
      title: 'Bienvenido a UpnAssist',
      message: 'Sistema modular inicializado correctamente',
      read: false,
    });

    console.log('[StoreInit] App store initialized');
  }
  /**
   * Setup event listeners for cross-store communication
   */
  private setupEventListeners(): void {
    const eventBus = EventBus.getInstance();
    // const chatStore = useChatStore.getState(); // Will be used when implementing sync

    // Listen for subject changes and update chat store
    eventBus.on(EventBus.Events.SUBJECT_ADDED, () => {
      this.syncChatStoreWithRepository();
    });

    eventBus.on(EventBus.Events.SUBJECT_REMOVED, () => {
      this.syncChatStoreWithRepository();
    });

    console.log('[StoreInit] Event listeners setup complete');
  }

  /**
   * Sync chat store with repository data
   */
  private syncChatStoreWithRepository(): void {
    const chatStore = useChatStore.getState();
    const subjectRepository = RepositoryFactory.getSubjectRepository();

    const subjects = subjectRepository.getAllSubjects();
    const activeRooms = subjectRepository.getJoinedRooms();

    chatStore.setSubjects(subjects);
    chatStore.setActiveRooms(activeRooms);
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset all stores (useful for testing)
   */
  reset(): void {
    this.initialized = false;
    console.log('[StoreInit] Stores reset');
  }
}
