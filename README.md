# UpnAssist - Portal Académico para Profesorado

[![UpnAssist](https://img.shields.io/badge/Web-Access%20Online-blue?style=for-the-badge&logo=vercel)](https://upnassist.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-green.svg)](https://vitejs.dev/)

> **UpnAssist** es una herramienta web desarrollada para facilitar las tareas diarias del profesorado universitario, centralizando funcionalidades útiles en una interfaz moderna y responsive.

## 🌐 Aplicación en Producción
**🚀 [Acceso a UpnAssist](https://upnassist.vercel.app/)**

---

## 👨‍💻 Desarrollo

**Desarrollado por Xabier Olaz Moratinos**  
**Institución**: UPNA (Universidad Pública de Navarra)  
**Objetivo**: Herramienta de productividad para el profesorado universitario

---

## 🎯 Características Implementadas

### 📊 **Dashboard Principal**
- Panel de control centralizado con widgets informativos
- Calendario integrado con vista mensual
- Notificaciones y recordatorios
- Acciones rápidas para funciones principales

### 💬 **Sistema de Chat Académico**
- Chat en tiempo real para comunicación entre profesorado
- Funciona en múltiples dispositivos y redes
- Conexión mediante WebSocket para comunicación instantánea
- Sistema de autenticación con código de acceso

### 📧 **Integración con Email**
- Acceso directo a Outlook institucional
- Gestión de correos desde la interfaz principal

### 📱 **Diseño Responsive**
- Adaptado para uso en móviles, tablets y desktop
- Interface optimizada para cada tipo de dispositivo
- Navegación intuitiva y accesible

---

## 🏗️ Arquitectura Técnica

### **Frontend**
- **React 18.3.1** con TypeScript
- **Vite** como build tool y bundler
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Zustand** para gestión de estado
- **Socket.io** para comunicación en tiempo real

### **Estructura del Proyecto**
- Arquitectura modular basada en componentes
- Separación clara entre lógica y presentación
- Patrón Repository para acceso a datos
- Sistema de hooks personalizados para lógica reutilizable

### **Testing y Calidad**
- Infraestructura de testing con Vitest
- Error Boundaries para manejo de errores
- TypeScript strict mode para mayor robustez
- Bundle optimization con chunks manuales

---

## 📱 Características Responsive

### **Compatibilidad Multi-Dispositivo**
- 📱 **Mobile**: Interface optimizada para pantallas pequeñas
- 🖥️ **Desktop**: Layout expandido para aprovechar espacio disponible
- 📟 **Tablet**: Diseño híbrido adaptativo
- 🌐 **Cross-platform**: Compatible con navegadores modernos

### **Optimizaciones de Performance**
- Lazy loading de componentes
- Compresión gzip del bundle final
- Imágenes optimizadas
- Carga asíncrona de recursos

---

## 💬 **Sistema de Chat**

### **Funcionalidad de Comunicación**
- Chat en tiempo real entre profesorado de UPNA
- Funciona entre diferentes redes (WiFi, datos móviles, redes corporativas)
- Compatible con PC, móviles y tablets sin instalaciones
- Conexión mediante Socket.io para comunicación instantánea
- Sala privada exclusiva para el cuerpo docente

### **Características de Seguridad**
- Sistema de autenticación mediante código de acceso
- Sesiones con duración configurable
- Validación de acceso antes de permitir el uso del chat

---

## 📊 **Métricas Técnicas del Proyecto**

### **Calidad del Código**
- **Modularidad**: 90% (25+ componentes modulares)
- **TypeScript**: 100% tipado estricto
- **Testing**: Infraestructura completa implementada
- **Bundle Size**: 94.34 kB gzipped (optimizado)
- **Performance**: Tiempo de carga < 2 segundos

### **Arquitectura**
- Patrón Repository para acceso a datos
- Event-Driven Architecture para comunicación entre componentes
- Error Boundaries para manejo robusto de errores
- State Management con Zustand

### **Optimizaciones Implementadas**
- Bundle splitting para carga optimizada
- Lazy loading de componentes
- Compresión automática de assets
- Responsive design mobile-first

---

## 🛠️ **Instalación y Desarrollo**

### **Requisitos**
- Node.js 18+
- npm o yarn

### **Configuración Local**
```bash
# Clonar el repositorio
git clone https://github.com/xolazmoratinos/UpnAssist.git
cd UpnAssist

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores apropiados

# Iniciar servidor de desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
npm run dev              # Servidor de desarrollo
npm run dev:network      # Servidor con acceso de red
npm run build            # Build de producción
npm run preview          # Preview del build
npm run test             # Ejecutar tests
npm run test:coverage    # Tests con coverage
```

---

## 🚀 **Despliegue**

### **Despliegue Automático**
La aplicación se despliega automáticamente en Vercel conectado al repositorio de GitHub. Cada push a la rama principal actualiza la versión en producción.

### **URL de Producción**
- **Aplicación**: https://upnassist.vercel.app/
- **Repositorio**: GitHub (privado)

---

## 🎓 **Propósito Académico**

UpnAssist fue desarrollado para centralizar y simplificar las herramientas digitales que utiliza el profesorado universitario en su trabajo diario, proporcionando una interfaz unificada e intuitiva.

### **Contexto Institucional**
- **UPNA** (Universidad Pública de Navarra)
- **Herramienta de apoyo** para personal académico y de investigación
- **Proyecto personal** de Xabier Olaz Moratinos

---

## 📞 **Contacto**

**Xabier Olaz Moratinos**  
Universidad Pública de Navarra (UPNA)  
Especialización en desarrollo de herramientas para entornos académicos

---

## 📝 **Licencia**

Este proyecto está bajo una licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

**UpnAssist** - Simplificando la experiencia académica para el profesorado universitario 🎯

*Desarrollado con ❤️ por Xabier Olaz Moratinos para la comunidad académica de UPNA*
