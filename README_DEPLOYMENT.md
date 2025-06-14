# UpnAssist

Sistema integral de asistencia académica para la Universidad Pública de Navarra (UPNA).

## Despliegue en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/upnassist)

## Funcionalidades

- **Dashboard Académico**: Gestión centralizada de recursos universitarios
- **Calendario Inteligente**: Generación de calendarios .ics compatibles con Google Calendar, Outlook y Apple Calendar
- **Chat Académico**: Sistema de comunicación para PDI con salas privadas
- **Detectores**: Herramientas para detección de plagio y análisis de código
- **AI Assistant (alAI)**: Asistente inteligente para tareas académicas

## Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **Build**: Vite con optimizaciones para producción

## Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run dev:network  # Desarrollo en red local
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## Configuración para Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio GitHub a Vercel
2. La configuración está en `vercel.json`
3. Build automático con cada push a main

### Variables de Entorno
No se requieren variables de entorno especiales para el deployment básico.

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Acceder a la aplicación
# Local: http://localhost:5173
# Red: http://[tu-ip]:5173
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── hooks/         # Custom hooks
├── context/       # Context providers
├── services/      # Servicios y APIs
├── types/         # Definiciones TypeScript
└── utils/         # Utilidades
```

## Licencia

MIT License - Universidad Pública de Navarra
