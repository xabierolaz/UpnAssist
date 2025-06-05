import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ChatRoomsProvider } from '../context/ChatRoomsContext';
import PasswordLogin from '../components/PasswordLogin';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import TeacherGuide from './TeacherGuide';
import Chat from './Chat';
import Email from './Email';
import Resources from './Resources';
import PlagiarismDetector from './PlagiarismDetector';
import ApplicationLauncher from './ApplicationLauncher';

const ProtectedUpnAssist: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <PasswordLogin onLogin={login} />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/apps" element={<ApplicationLauncher />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher-guide" element={<TeacherGuide />} />
        <Route path="/guide" element={<TeacherGuide />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/email" element={<Email />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/plagiarism-detector" element={<PlagiarismDetector />} />
      </Routes>
    </Layout>
  );
};

const UpnAssistApp: React.FC = () => {
  return (
    <AuthProvider>
      <ChatRoomsProvider>
        <ProtectedUpnAssist />
      </ChatRoomsProvider>
    </AuthProvider>
  );
};

export default UpnAssistApp;
