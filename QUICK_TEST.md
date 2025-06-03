# 🚀 Prueba Rápida del Chat Multi-Dispositivo

## 📱 URLs de Acceso

### Desde tu PC (Local)
```
http://localhost:5173/
```

### Desde otros dispositivos en la misma red WiFi
```
http://192.168.1.219:5173/
```

### URLs alternativas (si la primera no funciona)
```
http://192.168.56.1:5173/
http://192.168.137.1:5173/
```

## ✅ Pasos para Probar

### 1. En tu PC
1. Abre: http://localhost:5173/
2. Ve a la pestaña **Chat**
3. Introduce tu nombre: "Profesor PC"
4. Haz clic en "🚀 Conectar al Chat"

### 2. En tu Móvil/Tablet
1. Conecta a la misma red WiFi
2. Abre el navegador móvil
3. Ve a: http://192.168.1.219:5173/
4. Ve a la pestaña **Chat**
5. Introduce tu nombre: "Profesor Móvil"
6. Haz clic en "🚀 Conectar al Chat"

### 3. Probar Conexión
- Escribe mensajes desde el PC
- Deberían aparecer instantáneamente en el móvil
- Responde desde el móvil
- Los mensajes aparecerán en el PC

## 🌐 Para Probar desde Redes Diferentes

### Usando Túnel ngrok (Opcional)
Si quieres probar desde redes completamente diferentes:

1. Instala ngrok: https://ngrok.com/
2. Ejecuta: `ngrok http 5173`
3. Usa la URL pública que te da ngrok
4. Comparte esa URL con otros dispositivos

### Ejemplo con ngrok
```bash
# En otra terminal
ngrok http 5173

# Te dará algo como:
# https://abc123.ngrok.io
```

## 🔍 Verificación Visual

### Indicadores de Conexión
- **🟢 Verde**: Conectado correctamente
- **🟡 Amarillo**: Conectando...
- **🔴 Rojo**: Desconectado

### Contador de Usuarios
- En la parte superior derecha verás: "👥 X usuarios conectados"
- Este número debe aumentar cuando conectes desde diferentes dispositivos

## 📝 Pruebas Recomendadas

1. **Mensaje Simple**: "Hola desde PC"
2. **Emojis**: "🎓📚✅💻📱"
3. **Mensaje Largo**: Texto de varios párrafos
4. **Velocidad**: Mensajes rápidos consecutivos
5. **Reconexión**: Desconecta WiFi y reconecta

## ❗ Solución de Problemas

### No puedo acceder desde móvil
- Verifica que ambos dispositivos estén en la misma red WiFi
- Prueba las URLs alternativas
- Asegúrate de que no haya firewall bloqueando

### Chat no sincroniza
- Verifica conexión a internet en ambos dispositivos
- Refresca la página (F5 o pull-to-refresh)
- Revisa la consola del navegador (F12) para errores

### No aparecen usuarios conectados
- El contador puede tardar unos segundos en actualizarse
- Asegúrate de que ambos estén en la sala "upn-professors"
- Verifica que ambos muestren estado "Conectado" (verde)

---

**✅ Estado Actual**: Servidor ejecutándose en puerto 5173 con acceso de red habilitado.
