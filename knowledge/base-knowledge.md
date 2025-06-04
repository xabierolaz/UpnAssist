# Base de Conocimiento UpnAssist

## Sobre UpnAssist
UpnAssist es una aplicación web desarrollada por Xabier Olaz Moratinos como herramienta de ayuda personal docente e investigador para la Universidad Privada del Norte (UPN).

## Funcionalidades Principales

### 🎯 Aplicaciones Disponibles

#### Categoría: Académico
- **Dashboard**: Vista general con calendario académico de 6 clases semanales (Programación I, Estructuras de Datos, Bases de Datos)
- **Horarios**: Gestión de horarios y planificación académica
- **Estadísticas**: Análisis y reportes académicos
- **Presentaciones**: Gestión de presentaciones y material didáctico

#### Categoría: Comunicación
- **Chat Académico**: Comunicación en tiempo real con estudiantes y colegas (hasta 50 usuarios concurrentes)
- **Email UPN**: Correo electrónico institucional integrado
- **Notificaciones**: Sistema de alertas y recordatorios

#### Categoría: Gestión
- **Gestión de Estudiantes**: Administración de lista de estudiantes
- **Recursos Académicos**: Biblioteca digital de materiales (documentos, presentaciones, videos)
- **Gestión de Archivos**: Organización de documentos y archivos

#### Categoría: Herramientas
- **Detector de Copias**: Análisis de plagios en trabajos académicos con drag&drop
- **Calculadora de Notas**: Cálculo de promedios y calificaciones
- **Notas Rápidas**: Bloc de notas para apuntes rápidos
- **Laboratorio Virtual**: Entorno de práctica para programación

#### Categoría: Sistema
- **Guía del Profesor**: Manual completo de onboarding y recursos
- **Configuración**: Ajustes del sistema y perfil
- **Cerrar Sesión**: Salida segura del sistema

## Características Técnicas

### Tecnologías Utilizadas
- Frontend: React 18 + TypeScript
- Bundler: Vite
- Styling: Tailwind CSS
- Routing: React Router DOM
- Icons: Heroicons
- Chat: Socket.io

### Diseño Responsivo
- 💻 Desktop: Experiencia completa con sidebar
- 📱 Móvil: Navegación por pestañas optimizada
- 🖥️ Tablet: Layout adaptativo intermedio

### Ubicaciones UPN
- A-329 Aulario
- E-201 Los Encinas
- P-103 Los Pinos

### Horarios de Clases
- Lunes 08:00 - Programación I (45 estudiantes)
- Martes 10:00 - Estructuras de Datos (38 estudiantes)
- Miércoles 09:00 - Bases de Datos (42 estudiantes)
- Jueves 14:00 - Programación I (45 estudiantes)
- Viernes 11:00 - Estructuras de Datos (38 estudiantes)
- Sábado 08:00 - Bases de Datos (42 estudiantes)

## Funcionalidades Específicas

### Detector de Copias
- Soporta PDF, DOC, DOCX, TXT (máximo 10MB)
- Análisis de similitud con porcentajes
- Detección de fuentes: web, académicas, trabajos de estudiantes
- Interpretación de resultados:
  - 0-15%: Aceptable
  - 15-30%: Revisar
  - 30-50%: Preocupante
  - 50%+: Muy alta similitud

### Chat Multi-Dispositivo
- Funciona entre diferentes redes (WiFi, datos móviles)
- Sin necesidad de registro
- Tiempo real vía Socket.io
- Privado para profesores UPN

### Sistema de Correo
- Integración con correo institucional
- Gestión de bandeja de entrada
- Organización por categorías
- Búsqueda avanzada

## Acceso
- Web: https://upnassist.vercel.app/
- Local: http://localhost:3000
- Compatible con todos los navegadores modernos

## Comandos Comunes que los Usuarios Preguntan

### ¿Cómo imprimir?
Usa Ctrl+P en cualquier página o busca el ícono de impresión en las herramientas del navegador.

### ¿Cómo exportar datos?
Ve a la sección correspondiente (Dashboard, Recursos, etc.) y busca botones de "Exportar" o "Descargar".

### ¿Cómo subir archivos?
En Detector de Copias: arrastra archivos o usa el botón "Seleccionar Archivos".
En Recursos: usa la opción "Subir" en la biblioteca.

### ¿Cómo acceder desde móvil?
Simplemente abre https://upnassist.vercel.app/ en el navegador de tu móvil.

### ¿Hay límites de uso?
- Chat: máximo 50 usuarios simultáneos
- Archivos: máximo 10MB por archivo
- Sin límites de sesiones o tiempo de uso

## Desarrollador
Xabier Olaz Moratinos - Herramienta de ayuda personal docente e investigador
