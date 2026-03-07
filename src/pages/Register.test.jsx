import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock AuthContext
const registerMock = vi.fn();
vi.mock('@/lib/AuthContext', () => ({
  useAuth: () => ({
    register: registerMock,
    isLoadingAuth: false,
  }),
}));

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText('Đăng ký tài khoản')).toBeInTheDocument();
    expect(screen.getByLabelText(/Họ và tên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Xác nhận mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Đăng ký' })).toBeInTheDocument();
  });

  it('validates password mismatch', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Họ và tên/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Mật khẩu/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    await waitFor(() => {
      expect(screen.getByText('Mật khẩu xác nhận không khớp.')).toBeInTheDocument();
    });
  });

  it('calls register function with correct data on submit', async () => {
    registerMock.mockResolvedValue({ id: 1, email: 'test@example.com' });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Họ và tên/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Mật khẩu/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Xác nhận mật khẩu/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
