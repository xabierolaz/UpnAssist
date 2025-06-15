# Deployment Guide

## 🚀 Production Deployment

This guide covers deploying UpnAssist to production environments with optimal performance and security.

---

## 📋 Pre-Deployment Checklist

### **Code Quality**
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Production build successful (`npm run build`)
- [ ] Preview testing completed (`npm run preview`)

### **Configuration**
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Socket.io server URL configured
- [ ] CORS settings properly configured

### **Testing**
- [ ] All components functional
- [ ] Chat system working cross-device
- [ ] Responsive design verified
- [ ] Performance optimization completed

---

## 🌐 Vercel Deployment (Recommended)

### **Step 1: Prepare Repository**
```bash
# Ensure clean build
npm run build

# Commit all changes
git add .
git commit -m "Production ready deployment"
git push origin main
```

### **Step 2: Deploy to Vercel**

#### **Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Option B: Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **Step 3: Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-api.com
VITE_SOCKET_URL=https://your-socket-server.com
VITE_EMAIL_API=https://your-email-service.com
```

### **Step 4: Custom Domain (Optional)**

1. **Add Domain**: In Vercel Dashboard → Domains
2. **Configure DNS**: Point CNAME to Vercel
3. **SSL Certificate**: Automatically provisioned

---

## 🏗️ Alternative Hosting Options

### **Netlify**

```bash
# Build for production
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **GitHub Pages**

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

### **Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

---

## 🔧 Backend Infrastructure

### **Socket.io Server Deployment**

#### **Railway Deployment**
```dockerfile
# Dockerfile for Socket.io server
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### **Server Configuration**
```javascript
// server.js
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://upnassist.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.join('faculty-room');
  
  socket.on('message', (message) => {
    socket.to('faculty-room').emit('message', message);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 📊 Performance Optimization

### **Build Optimization**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@heroicons/react'],
          utils: ['uuid', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### **CDN Configuration**

Configure CDN headers for static assets:

```json
{
  "headers": [
    {
      "source": "/assets/**",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🔒 Security Configuration

### **Content Security Policy**

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' wss: https:;">
```

### **Environment Security**

- ✅ Use environment variables for sensitive data
- ✅ Never commit API keys to repository
- ✅ Enable HTTPS for all production traffic
- ✅ Configure CORS properly for API endpoints
- ✅ Implement rate limiting on backend services

---

## 📈 Monitoring & Analytics

### **Vercel Analytics**

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to main component
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <Router>
        {/* Your app components */}
      </Router>
      <Analytics />
    </>
  )
}
```

### **Error Tracking**

Consider integrating:
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **Mixpanel**: User analytics and behavior tracking

---

## 🚦 Health Checks

### **Frontend Health Check**

Create `public/health.json`:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### **Backend Health Check**

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v27
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🆘 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Socket Connection Issues**
- Verify CORS configuration
- Check WebSocket proxy settings
- Confirm SSL certificate validity

#### **Performance Issues**
- Enable gzip compression
- Optimize image assets
- Implement code splitting

### **Deployment Verification**

```bash
# Test production build locally
npm run build
npm run preview

# Check all routes work
curl https://your-domain.com
curl https://your-domain.com/chat
curl https://your-domain.com/dashboard
```

---

## 📝 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Chat system functional
- [ ] Responsive design works on all devices
- [ ] SSL certificate active
- [ ] Analytics tracking working
- [ ] Error monitoring configured
- [ ] Performance metrics baseline established

---

*Deployment guide for UpnAssist - Last updated 2024*
