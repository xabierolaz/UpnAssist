import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// Context providers replaced with Zustand stores
// import { AuthProvider } from '../context/AuthContext';
// import { ChatRoomsProvider } from '../context/ChatRoomsContext';
// import PasswordLogin from '../components/PasswordLogin'; // Mantenido para reactivación fácil
import { StoreInitializationService } from '../services/StoreInitializationService';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import TeacherGuide from './TeacherGuide';
import Chat from './Chat';
import Email from './Email';
import Resources from './Resources';
import PlagiarismDetector from './PlagiarismDetector';
import ApplicationLauncher from './ApplicationLauncher';
import Help from './Help';

const ProtectedUpnAssist: React.FC = () => {
  // Initialize stores when the app starts
  useEffect(() => {
    const initializeStores = async () => {
      try {
        const storeService = StoreInitializationService.getInstance();
        await storeService.initialize();
        console.log('✅ UpnAssist stores initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing UpnAssist stores:', error);
      }
    };

    initializeStores();
  }, []);

  // const { isAuthenticated, login } = useAuth(); // Mantenido para reactivación fácil

  // PANTALLA DE CONTRASEÑA DESACTIVADA
  // Para reactivar, descomentar las siguientes líneas:
  /*
  const { isAuthenticated, login } = useAuth();
  if (!isAuthenticated) {
    return <PasswordLogin onLogin={login} />;
  }
  */
  return (
    <Layout><Routes>        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/apps" element={<ApplicationLauncher />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher-guide" element={<TeacherGuide />} />
        <Route path="/guide" element={<TeacherGuide />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/email" element={<Email />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/plagiarism-detector" element={<PlagiarismDetector />} />
        <Route path="/help" element={<Help />} />
        <Route path="/ayuda" element={<Help />} />
      </Routes>
    </Layout>
  );
};

const UpnAssistApp: React.FC = () => {
  // Context providers replaced with Zustand stores - no providers needed
  return <ProtectedUpnAssist />;
};

export default UpnAssistApp;
