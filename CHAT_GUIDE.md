# 💬 Guía del Chat Multi-Dispositivo - UpnAssist

## 🌐 Funcionamiento entre Redes

El chat de UpnAssist está diseñado para funcionar **sin problemas entre diferentes dispositivos y redes**, incluyendo:

- 🖥️ **PC de escritorio** (Windows, Mac, Linux)
- 📱 **Dispositivos móviles** (Android, iOS)
- 🏠 **Diferentes redes domésticas**
- 🏢 **Redes corporativas/universitarias**
- 📶 **Conexiones móviles (4G/5G)**

## ✨ Características Principales

### 🚀 Sin Instalaciones
- Funciona directamente en el navegador web
- No requiere descargar apps
- Compatible con Chrome, Firefox, Safari, Edge

### 👤 Sin Cuentas de Usuario
- No necesita registro
- Solo introduce tu nombre
- Conexión instantánea

### 🔄 Tiempo Real
- Mensajes instantáneos
- Sincronización automática
- Máximo 50 usuarios simultáneos

## 📋 Instrucciones de Uso

### Para PC (Escritorio)
1. Abre tu navegador favorito
2. Visita: `http://localhost:5175` (desarrollo) o la URL de producción
3. Ve a la pestaña **Chat**
4. Haz clic en "🚀 Conectar al Chat"
5. Introduce tu nombre de profesor
6. ¡Comienza a chatear!

### Para Móvil
1. Abre el navegador en tu móvil (Chrome, Safari, etc.)
2. Navega a la misma URL
3. El diseño se adapta automáticamente
4. Sigue los mismos pasos que en PC

### Para Conectar Dispositivos en Diferentes Redes
1. **Mismo Chat Room**: Todos se conectan a la sala "upn-professors"
2. **Internet Required**: Ambos dispositivos necesitan conexión a internet
3. **Automático**: La conexión se establece automáticamente
4. **Cross-Network**: Funciona entre WiFi doméstico, datos móviles, etc.

## 🔧 Solución de Problemas

### ❌ No puedo conectarme
- Verifica tu conexión a internet
- Prueba refrescar la página (F5)
- Asegúrate de que no haya firewall bloqueando

### 📶 Conexión lenta
- Revisa la velocidad de tu internet
- Cierra otras pestañas/apps que usen internet
- Prueba cambiar de WiFi a datos móviles (o viceversa)

### 👥 No veo otros usuarios
- Confirma que estés en la sala correcta
- Otros usuarios deben estar también conectados
- El sistema puede tardar unos segundos en sincronizar

## 🌟 Ventajas Técnicas

### Tecnología Socket.io
- **Protocolo WebSocket**: Comunicación bidireccional instantánea
- **Fallback Polling**: Si WebSocket falla, usa HTTP polling
- **Reconexión Automática**: Se reconecta si se pierde la conexión
- **Cross-Origin**: Funciona entre diferentes dominios/puertos

### Arquitectura de Red
- **Servidor Público**: Usa servidores Socket.io en la nube
- **Sin NAT Issues**: No hay problemas con firewalls domésticos
- **Global Access**: Accesible desde cualquier parte del mundo
- **Escalable**: Soporta múltiples salas simultáneamente

## 🔒 Privacidad y Seguridad

- **Cifrado de extremo a extremo**: Los mensajes se cifran en tu dispositivo con AES-GCM de 256 bits
- **Verificación visual**: Indicadores de cifrado en cada mensaje y en la interfaz
- **No se almacenan mensajes**: Los mensajes no se guardan en el servidor
- **Solo en caché local**: Los mensajes solo se almacenan temporalmente en tu navegador
- **Limpieza automática**: Los mensajes antiguos se eliminan automáticamente después de 7 días
- **Control manual**: Puedes borrar todo tu historial de chat en cualquier momento
- **Sala Privada**: Solo profesores UPN en la sala "upn-professors"
- **Sin datos personales**: Solo se requiere un nombre de usuario

## 🎯 Casos de Uso Típicos

### 📚 Coordinación Académica
- Profesores coordinando horarios
- Discusión de metodologías
- Intercambio de recursos

### 🏠 Trabajo Remoto
- Profesor en casa + otro en universidad
- Reuniones virtuales informales
- Consultas rápidas entre colegas

### 📱 Movilidad
- Profesor viajando con móvil
- Conexión desde diferentes ubicaciones
- Respuestas rápidas en movimiento

## ❓ Preguntas Frecuentes sobre Seguridad

### ¿Qué significa "cifrado de extremo a extremo"?
Significa que tus mensajes se cifran en tu dispositivo antes de enviarse por internet. Solo los participantes del chat pueden descifrar y leer los mensajes. Ni siquiera el servidor que transmite los mensajes puede ver su contenido.

### ¿Cómo sé que mis mensajes están realmente cifrados?
Puedes verificarlo de varias formas:
1. Verás un icono de candado 🔒 junto a cada mensaje cifrado
2. El indicador de "Cifrado activo" aparecerá en verde en la parte superior
3. Puedes hacer clic en el botón de información para ver detalles técnicos

### ¿Por cuánto tiempo se guardan mis mensajes?
Los mensajes solo se almacenan temporalmente en tu dispositivo:
- Se guardan en el caché local de tu navegador
- Se mantienen por un máximo de 7 días
- Se eliminan automáticamente después de este período
- Puedes borrarlos manualmente en cualquier momento con el botón "Borrar historial"

### ¿Qué ocurre si cambio de dispositivo?
Al cambiar de dispositivo, comenzarás con un historial de chat vacío. Los mensajes solo existen en el dispositivo donde los recibiste originalmente.

### ¿Qué algoritmo de cifrado se utiliza?
Se utiliza AES-GCM (Advanced Encryption Standard en modo Galois/Counter) con claves de 256 bits, uno de los estándares de cifrado más seguros disponibles actualmente.

---

**✅ Probado y Funcionando**: Este sistema ha sido probado entre diferentes redes y dispositivos para garantizar la conectividad multiplataforma.
