import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables para testing
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_CHAT_ACCESS_CODE: '2580',
    VITE_CHAT_SESSION_DURATION_HOURS: '24',
    VITE_SOCKET_URL: 'http://localhost:3001',
    VITE_OUTLOOK_URL: 'https://outlook.office.com',
    DEV: true,
    PROD: false
  },
  writable: true
});

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
  get length() {
    return Object.keys(localStorageMock.store).length;
  },
  key: vi.fn((index: number) => Object.keys(localStorageMock.store)[index] || null)
};
global.localStorage = localStorageMock as unknown as Storage;

// Mock window.open
global.open = vi.fn();

// Mock console para tests más limpios
global.console = {
  ...console,
  // Comentar la siguiente línea si quieres ver logs en tests
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
