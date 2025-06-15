import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickActions from '../components/dashboard/QuickActions';

// Mocks
const mockOnOpenChat = vi.fn();
const mockOnOpenApps = vi.fn();  
const mockOnOpenHelp = vi.fn();

describe('QuickActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock store
    const localStorageMock = global.localStorage as any;
    localStorageMock.store = {};
  });

  const renderComponent = () => {
    return render(
      <QuickActions
        onOpenChat={mockOnOpenChat}
        onOpenApps={mockOnOpenApps}
        onOpenHelp={mockOnOpenHelp}
      />
    );
  };

  describe('Render and Basic Functionality', () => {
    it('should render all action buttons', () => {
      renderComponent();
      
      expect(screen.getByText('Chat Académico')).toBeInTheDocument();
      expect(screen.getByText('Aplicaciones')).toBeInTheDocument();
      expect(screen.getByText('Email UPN')).toBeInTheDocument();
      expect(screen.getByText('Ayuda')).toBeInTheDocument();
    });

    it('should call onOpenApps when Applications button is clicked', async () => {
      renderComponent();
      
      const appsButton = screen.getByText('Aplicaciones');
      await userEvent.click(appsButton);
      
      expect(mockOnOpenApps).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenHelp when Help button is clicked', async () => {
      renderComponent();
      
      const helpButton = screen.getByText('Ayuda');
      await userEvent.click(helpButton);
      
      expect(mockOnOpenHelp).toHaveBeenCalledTimes(1);
    });
  });

  describe('Chat Access Control', () => {
    it('should show access control modal when chat button is clicked (no previous access)', async () => {
      renderComponent();
      
      const chatButton = screen.getByText('Chat Académico');
      await userEvent.click(chatButton);
      
      // Debe aparecer el modal de control de acceso
      expect(screen.getByText('Acceso al Chat Académico')).toBeInTheDocument();
      expect(screen.getByText('Código de Acceso')).toBeInTheDocument();
      expect(mockOnOpenChat).not.toHaveBeenCalled();
    });

    it('should allow direct access when valid session exists', async () => {
      // Simular sesión válida (menos de 24 horas)
      const validTimestamp = Date.now() - (1000 * 60 * 60 * 12); // 12 horas atrás
      localStorage.setItem('upn-chat-access-granted', 'true');
      localStorage.setItem('upn-chat-access-timestamp', validTimestamp.toString());
      
      renderComponent();
      
      const chatButton = screen.getByText('Chat Académico');
      await userEvent.click(chatButton);
      
      // Debe llamar directamente a onOpenChat
      expect(mockOnOpenChat).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Acceso al Chat Académico')).not.toBeInTheDocument();
    });

    it('should clear expired session and show access control', async () => {
      // Simular sesión expirada (más de 24 horas)
      const expiredTimestamp = Date.now() - (1000 * 60 * 60 * 25); // 25 horas atrás
      localStorage.setItem('upn-chat-access-granted', 'true');
      localStorage.setItem('upn-chat-access-timestamp', expiredTimestamp.toString());
      
      renderComponent();
      
      const chatButton = screen.getByText('Chat Académico');
      await userEvent.click(chatButton);
      
      // Debe limpiar localStorage y mostrar modal
      expect(localStorage.getItem('upn-chat-access-granted')).toBeNull();
      expect(localStorage.getItem('upn-chat-access-timestamp')).toBeNull();
      expect(screen.getByText('Acceso al Chat Académico')).toBeInTheDocument();
      expect(mockOnOpenChat).not.toHaveBeenCalled();
    });
  });

  describe('Access Control Modal', () => {
    beforeEach(async () => {
      renderComponent();
      const chatButton = screen.getByText('Chat Académico');
      await userEvent.click(chatButton);
    });

    it('should accept correct access code (2580)', async () => {
      const codeInput = screen.getByPlaceholderText('Ingresa el código de 4 dígitos');
      const submitButton = screen.getByRole('button', { name: /Acceder al Chat/i });
      
      await userEvent.type(codeInput, '2580');
      await userEvent.click(submitButton);
      
      // Esperar que se procese el código
      await waitFor(() => {
        expect(mockOnOpenChat).toHaveBeenCalledTimes(1);
      });
      
      // Verificar que se guardó en localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('upn-chat-access-granted', 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'upn-chat-access-timestamp', 
        expect.any(String)
      );
    });

    it('should reject incorrect access code', async () => {
      const codeInput = screen.getByPlaceholderText('Ingresa el código de 4 dígitos');
      const submitButton = screen.getByRole('button', { name: /Acceder al Chat/i });
      
      await userEvent.type(codeInput, '1234');
      await userEvent.click(submitButton);
      
      // Esperar mensaje de error
      await waitFor(() => {
        expect(screen.getByText('Código de acceso incorrecto')).toBeInTheDocument();
      });
      
      expect(mockOnOpenChat).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalledWith('upn-chat-access-granted', 'true');
    });

    it('should close modal when cancel button is clicked', async () => {
      const cancelButton = screen.getByText('Cancelar');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByText('Acceso al Chat Académico')).not.toBeInTheDocument();
      expect(mockOnOpenChat).not.toHaveBeenCalled();
    });
  });

  describe('Email Integration', () => {
    it('should open Outlook when Email button is clicked', async () => {
      // Mock window.open
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      
      renderComponent();
      
      const emailButton = screen.getByText('Email UPN');
      await userEvent.click(emailButton);
      
      expect(openSpy).toHaveBeenCalledWith('https://outlook.office.com', '_blank');
      
      openSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {    it('should have proper button roles and labels', () => {
      renderComponent();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // Chat, Apps, Email, Help
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        // Los botones en JSX sin type explícito tienen role='button' por defecto
        expect(button).toHaveAttribute('class');
      });
    });

    it('should show external link indicator for email button', () => {
      renderComponent();
      
      // Buscar el icono de enlace externo dentro del botón de email
      const emailButton = screen.getByText('Email UPN').closest('button');
      expect(emailButton).toBeInTheDocument();
      
      // Verificar que tiene el indicador visual de enlace externo
      const externalIcon = emailButton?.querySelector('svg');
      expect(externalIcon).toBeInTheDocument();
    });
  });  describe('Environment Variables Integration', () => {
    it('should use environment variable for session duration', () => {
      // Test que las variables de entorno están configuradas correctamente
      expect(import.meta.env.VITE_CHAT_ACCESS_CODE).toBe('2580');
      expect(import.meta.env.VITE_CHAT_SESSION_DURATION_HOURS).toBe('24');
      
      // Verificar que el componente se renderiza correctamente con estas variables
      renderComponent();
      
      const chatButton = screen.getByText('Chat Académico');
      expect(chatButton).toBeInTheDocument();
    });
  });
});
