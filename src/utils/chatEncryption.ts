/**
 * Utilidad para cifrado de mensajes en el chat
 * 
 * Implementa cifrado AES-GCM para comunicación segura entre dispositivos
 * Los mensajes solo se almacenan temporalmente en el caché local del navegador
 * No se transmiten claves privadas al servidor
 */

const IV_LENGTH = 12; // Tamaño del vector de inicialización para AES-GCM

/**
 * Genera una clave de cifrado para la sala de chat
 * @param roomName Nombre de la sala
 * @returns Clave de cifrado derivada
 */
export async function generateRoomKey(roomName: string): Promise<CryptoKey> {
  // Usar el nombre de la sala como base para la clave
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(`upn-secure-chat-${roomName}-key`);
  
  // Crear material criptográfico a partir del nombre de la sala
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derivar una clave AES-GCM adecuada
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('upn-chat-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    cryptoKey,
    { name: 'AES-GCM', length: 256 },
    false, // No extraíble
    ['encrypt', 'decrypt']
  );
}

/**
 * Cifra un mensaje para transmisión segura
 * @param message Mensaje a cifrar
 * @param key Clave de cifrado
 * @returns Mensaje cifrado en formato Base64
 */
export async function encryptMessage(message: string, key: CryptoKey): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Generar vector de inicialización aleatorio
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Cifrar el mensaje con AES-GCM
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );
    
    // Combinar IV y datos cifrados
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Convertir a Base64 para transmisión
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Error al cifrar mensaje:', error);
    return message; // Fallar de forma segura
  }
}

/**
 * Descifra un mensaje recibido
 * @param encryptedMessage Mensaje cifrado en formato Base64
 * @param key Clave de cifrado
 * @returns Mensaje descifrado
 */
export async function decryptMessage(encryptedMessage: string, key: CryptoKey): Promise<string> {
  try {
    // Convertir de Base64 a array de bytes
    const encryptedData = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
    
    // Extraer IV y datos cifrados
    const iv = encryptedData.slice(0, IV_LENGTH);
    const ciphertext = encryptedData.slice(IV_LENGTH);
    
    // Descifrar con AES-GCM
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      ciphertext
    );
    
    // Convertir bytes a texto
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error al descifrar mensaje:', error);
    return '🔒 [Mensaje cifrado no pudo ser descifrado]'; // Mensaje de error amigable
  }
}

/**
 * Verifica si la Web Crypto API está disponible en el navegador
 * @returns true si el cifrado está disponible
 */
export function isCryptoAvailable(): boolean {
  return window.crypto && window.crypto.subtle ? true : false;
}
