/**
 * Utilidades para gestión del caché local de mensajes
 * 
 * Permite gestionar el almacenamiento local de mensajes del chat
 * para garantizar privacidad y gestión eficiente del espacio
 */

import type { Message } from '../types';

// Claves para almacenamiento
const MESSAGE_STORAGE_KEY = 'upn-chat-messages';
const STORAGE_LAST_CLEANED_KEY = 'upn-chat-last-cleaned';

// Configuración de tiempo para limpieza
const MAX_MESSAGE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
const CLEAN_INTERVAL_MS = 24 * 60 * 60 * 1000; // 1 día en milisegundos

/**
 * Guarda mensajes en el almacenamiento local del navegador
 * @param messages Lista de mensajes a guardar
 */
export function saveMessagesToLocalStorage(messages: Message[]): void {
  try {
    // Limitamos a máximo 100 mensajes para evitar uso excesivo de memoria
    const limitedMessages = messages.slice(-100);
    
    // Convertimos las fechas a strings para almacenamiento
    const messagesForStorage = limitedMessages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }));
    
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messagesForStorage));
  } catch (error) {
    console.error('Error al guardar mensajes en caché local:', error);
  }
}

/**
 * Recupera mensajes del almacenamiento local
 * @returns Lista de mensajes almacenados
 */
export function getMessagesFromLocalStorage(): Message[] {
  try {
    const storedMessages = localStorage.getItem(MESSAGE_STORAGE_KEY);
    if (!storedMessages) return [];
    
    // Convertimos de nuevo las fechas a objetos Date
    const parsedMessages = JSON.parse(storedMessages);    return parsedMessages.map((msg: { timestamp: string; [key: string]: unknown }) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Error al recuperar mensajes del caché local:', error);
    return [];
  }
}

/**
 * Elimina todos los mensajes del almacenamiento local
 * @returns true si la operación fue exitosa
 */
export function clearChatHistory(): boolean {
  try {
    localStorage.removeItem(MESSAGE_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error al limpiar historial de chat:', error);
    return false;
  }
}

/**
 * Elimina mensajes antiguos del almacenamiento local
 * @returns Número de mensajes eliminados
 */
export function cleanupOldMessages(): number {
  try {
    const messages = getMessagesFromLocalStorage();
    if (messages.length === 0) return 0;
    
    const now = new Date();
    const oldMessagesCount = messages.length;
    
    // Filtrar mensajes más recientes que MAX_MESSAGE_AGE_MS
    const recentMessages = messages.filter(msg => 
      (now.getTime() - msg.timestamp.getTime()) < MAX_MESSAGE_AGE_MS
    );
    
    // Guardar mensajes filtrados
    saveMessagesToLocalStorage(recentMessages);
    
    // Actualizar timestamp de última limpieza
    localStorage.setItem(STORAGE_LAST_CLEANED_KEY, now.toISOString());
    
    return oldMessagesCount - recentMessages.length;
  } catch (error) {
    console.error('Error al limpiar mensajes antiguos:', error);
    return 0;
  }
}

/**
 * Comprueba si es necesario ejecutar la limpieza automática
 * @returns true si se debe ejecutar la limpieza
 */
export function shouldRunCleanup(): boolean {
  try {
    const lastCleaned = localStorage.getItem(STORAGE_LAST_CLEANED_KEY);
    if (!lastCleaned) return true;
    
    const lastCleanedDate = new Date(lastCleaned);
    const now = new Date();
    
    // Verificar si ha pasado el intervalo de limpieza
    return (now.getTime() - lastCleanedDate.getTime()) > CLEAN_INTERVAL_MS;
  } catch (error) {
    console.error('Error al verificar limpieza de caché:', error);
    return false;
  }
}

/**
 * Verifica la integridad de los mensajes almacenados
 * @returns true si la verificación fue exitosa
 */
export function verifyMessageIntegrity(): boolean {
  try {
    const messages = getMessagesFromLocalStorage();
    
    // Verificar que cada mensaje tenga todos los campos requeridos
    const isValid = messages.every(msg => 
      msg.id && 
      msg.user && 
      msg.message && 
      msg.timestamp instanceof Date
    );
    
    if (!isValid) {
      console.warn('Se detectaron mensajes con estructura incorrecta - limpiando caché');
      clearChatHistory();
    }
    
    return isValid;
  } catch (error) {
    console.error('Error al verificar integridad de mensajes:', error);
    clearChatHistory(); // En caso de error, limpiar para evitar problemas
    return false;
  }
}
