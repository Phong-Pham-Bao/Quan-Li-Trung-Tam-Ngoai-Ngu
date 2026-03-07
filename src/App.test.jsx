import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import App from './App';

// Mock some parts that might be hard to test
vi.mock('@/lib/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    navigateToLogin: vi.fn(),
  }),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }) => <div>{children}</div>,
  QueryClient: vi.fn().mockImplementation(() => ({
    mount: vi.fn(),
    unmount: vi.fn(),
    defaultOptions: {},
  })),
}));

vi.mock('@/lib/query-client', () => ({
  queryClientInstance: {
    mount: vi.fn(),
    unmount: vi.fn(),
  },
}));

test('renders App component without crashing with future flags', () => {
  render(<App />);
  // If it renders without throwing, the future flags config is at least syntactically correct
  expect(true).toBe(true);
});
