# UpnAssist - Portal del Profesorado

UpnAssist es una aplicación web moderna diseñada específicamente para profesores universitarios. Integra múltiples herramientas y recursos académicos en una sola plataforma fácil de usar.

## 📱💻 **100% Responsive - Web y Móvil**

UpnAssist está diseñado para funcionar perfectamente en **cualquier dispositivo**:

- 📱 **Móviles**: Interface táctil optimizada con navegación de pestañas
- 🖥️ **Desktop**: Layout completo con sidebars y múltiples columnas  
- 📟 **Tablets**: Diseño híbrido que se adapta automáticamente
- 🌐 **Cross-browser**: Compatible con Chrome, Safari, Firefox, Edge

### 🎯 **Adaptación Automática**
- **Breakpoints inteligentes**: Se ajusta según el tamaño de pantalla
- **Touch-friendly**: Botones y controles optimizados para dedos
- **Performance móvil**: Carga rápida y scroll suave
- **Orientación flexible**: Funciona en vertical y horizontal

📖 **Guía Completa**: Ver [RESPONSIVE_GUIDE.md](./RESPONSIVE_GUIDE.md) para detalles técnicos.

## 🎯 Características Principales

### 📊 Dashboard
- Resumen de actividades y estadísticas
- Accesos rápidos a funciones principales
- Actividad reciente y notificaciones

### 📚 Guía del Profesorado
- Manual completo de onboarding
- Normativas y procedimientos académicos
- Recursos y herramientas disponibles
- Información de contacto y soporte

### 💬 Chat en Tiempo Real
- Comunicación directa entre profesores
- Máximo 50 usuarios concurrentes
- Solo mensajes de texto (sin archivos)
- Interface responsiva y moderna

### 📧 Correo Redirigido
- Integración con correo institucional
- Gestión de bandeja de entrada
- Organización por categorías
- Búsqueda avanzada de mensajes

### 📁 Recursos Académicos
- Biblioteca digital de materiales
- Documentos, presentaciones y videos
- Sistema de categorías y búsqueda
- Acceso rápido a recursos externos

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **Chat**: Socket.io (cliente)

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd UpnAssist

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa de la build

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 📱 Diseño Responsivo

La aplicación está optimizada para:
- 💻 **Desktop**: Experiencia completa con sidebar y múltiples columnas
- 📱 **Móvil**: Navegación por pestañas, interface táctil optimizada
- 🖥️ **Tablet**: Layout adaptativo intermedio

## 💬 Chat Multi-Dispositivo

El sistema de chat está diseñado para funcionar **entre diferentes redes y dispositivos**:

### ✨ Características Principales
- 🌐 **Cross-Network**: Funciona entre WiFi, datos móviles, redes corporativas
- 📱 **Multi-Platform**: PC, móviles, tablets - sin instalaciones
- 👥 **Sin Registro**: Solo introduce tu nombre y conecta
- ⚡ **Tiempo Real**: Mensajes instantáneos vía Socket.io
- 🔒 **Privado**: Sala exclusiva para profesores UPN

### 🚀 Cómo Usar
1. Abre UpnAssist en cualquier dispositivo
2. Ve a la pestaña **Chat**
3. Introduce tu nombre de profesor
4. ¡Chatea con colegas desde cualquier red!

📖 **Guía Completa**: Ver [CHAT_GUIDE.md](./CHAT_GUIDE.md) para instrucciones detalladas.

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── Layout.tsx      # Layout principal con navegación
├── pages/              # Páginas principales
│   ├── Dashboard.tsx   # Panel principal
│   ├── TeacherGuide.tsx # Guía del profesorado
│   ├── Chat.tsx        # Chat en tiempo real
│   ├── Email.tsx       # Sistema de correo
│   └── Resources.tsx   # Recursos académicos
├── hooks/              # Custom hooks
├── services/           # Servicios de API
├── types/              # Definiciones de TypeScript
└── assets/             # Recursos estáticos
```

## 🔧 Configuración para Producción

### Variables de Entorno
Crear archivo `.env` con:
```env
VITE_API_URL=https://tu-backend.com
VITE_SOCKET_URL=https://tu-socket-server.com
VITE_EMAIL_API=https://tu-email-api.com
```

### Despliegue Recomendado
- **Frontend**: Vercel, Netlify, o GitHub Pages
- **Backend**: Railway, Render, o Heroku (plan gratuito)
- **Base de datos**: PostgreSQL (ElephantSQL gratuito) o SQLite

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🎓 Universidad

Desarrollado para la Universidad Privada del Norte (UPN) como herramienta de apoyo al profesorado.

---

**UpnAssist** - Simplificando la experiencia académica del profesorado universitario 🎯
