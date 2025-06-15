import React from 'react';
import FloatingAIButton from './FloatingAIButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">      {/* Main content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {children}
      </main>{/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2025 UpnAssist - Sistema desarrollado por Xabier Olaz Moratinos para personal PDI de la universidad con el fin de facilitar el día a día académico
          </div>
        </div>
      </footer>{/* Botón flotante de alAI */}
      <FloatingAIButton />
    </div>
  );
};

export default Layout;
