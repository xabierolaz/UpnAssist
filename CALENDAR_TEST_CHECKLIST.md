# 🧪 Prueba Rápida del Calendario - UpnAssist

## ✅ Lista de Verificación Completa

### 1. **Acceso a la Aplicación**
- [ ] Navegar a http://localhost:5173/
- [ ] Login con contraseña
- [ ] Acceder al Dashboard

### 2. **Generación de Calendario**
- [ ] Hacer clic en "Generar Calendario"
- [ ] Verificar que aparece el mensaje de confirmación
- [ ] Verificar que se muestran las opciones de descarga

### 3. **Funcionalidades del Calendario**
- [ ] **Copiar Enlace**: Verificar que se copia al portapapeles
- [ ] **Descargar .ics**: Verificar que se descarga el archivo
- [ ] **Abrir Calendario**: Verificar que se abre en nueva pestaña

### 4. **Página de Ayuda**
- [ ] Navegar a "Ayuda" en el menú
- [ ] Verificar que se muestra toda la documentación legal
- [ ] Verificar información de privacidad y seguridad

### 5. **Responsive Design**
- [ ] Probar en desktop (navegador completo)
- [ ] Probar en tablet (redimensionar ventana)
- [ ] Probar en móvil (vista responsive)

## 🔧 Pruebas Técnicas

### **Importar Calendario Generado**

#### En Google Calendar:
1. Copiar el enlace webcal://
2. Ir a Google Calendar → Otros calendarios → Agregar
3. Desde URL → Pegar enlace
4. Verificar que aparecen los eventos

#### En Outlook:
1. Copiar el enlace webcal://
2. Ir a Outlook → Agregar calendario → Desde internet
3. Pegar enlace → Suscribirse
4. Verificar sincronización

#### Importar archivo .ics:
1. Descargar el archivo .ics
2. Abrir con aplicación de calendario
3. Confirmar importación
4. Verificar que se muestran todos los eventos

## 📊 Verificación de Eventos

### **Tipos de Eventos Esperados:**
- 📚 **Clases**: Programación I, Bases de Datos, Estructuras de Datos
- 👥 **Reuniones**: Departamento, evaluaciones
- 🎓 **Eventos**: Conferencias, seminarios

### **Formato de Eventos:**
- ✅ Título con emoji correspondiente
- ✅ Descripción detallada
- ✅ Fecha y hora correctas
- ✅ Ubicación especificada
- ✅ Duración adecuada

## 🔒 Verificación de Privacidad

### **Datos Locales:**
- [ ] Verificar que no se envían datos a servidores externos
- [ ] Comprobar que la información se guarda en localStorage
- [ ] Verificar que funciona sin conexión a internet (después de cargar)

### **Sin Acceso OAuth:**
- [ ] Confirmar que no se solicitan permisos de Google
- [ ] Verificar que no hay redirecciones a servicios externos
- [ ] Comprobar que funciona sin cuentas de terceros

## 🎯 Resultado Esperado

Después de completar todas las pruebas:

1. **✅ Calendario Funcional**: Generación exitosa de archivos .ics
2. **✅ Compatibilidad Universal**: Funciona en todos los calendarios principales
3. **✅ Privacidad Garantizada**: Sin acceso a datos externos
4. **✅ Documentación Completa**: Información legal y técnica disponible
5. **✅ Interfaz Intuitiva**: Fácil de usar para profesores universitarios

## 🚀 **Estado: LISTO PARA PRODUCCIÓN**

Si todas las pruebas pasan, UpnAssist está preparado para:
- Despliegue en entorno de producción
- Uso por parte del profesorado UPN
- Distribución como herramienta oficial de apoyo

---

**Última verificación**: 14 de junio de 2025
**Desarrollador**: Xabier Olaz Moratinos
**Proyecto**: UpnAssist v1.0 - Calendario Académico
