import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../login';

// Mock dependencies
const mockNavigate = vi.fn();
let mockAuthError = null;
let mockLoginFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth hook - dapat diubah state errornya
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLoginFn,
    error: mockAuthError,
    loading: false
  })
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAuthError = null;
    mockLoginFn = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Form Rendering', () => {
    it('should render login form correctly', () => {
      renderWithRouter(<Login />);
      
      // Use more specific query to avoid multiple matches
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email \/ username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('User Input', () => {
    it('should update input fields when user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email \/ username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.clear(emailInput);
      await user.clear(passwordInput);
      
      await user.type(emailInput, 'admin@test.com');
      await user.type(passwordInput, 'password123');
      
      expect(emailInput).toHaveValue('admin@test.com');
      expect(passwordInput).toHaveValue('password123');
    });

    it('should validate required fields', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email \/ username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Error Handling', () => {
    it('should display error when login fails', async () => {
      const user = userEvent.setup();
      mockAuthError = 'Invalid credentials';
      
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email \/ username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.clear(emailInput);
      await user.clear(passwordInput);
      
      await user.type(emailInput, 'admin@test.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display error when token is not found', async () => {
      const user = userEvent.setup();
      mockAuthError = 'Token tidak ditemukan dalam response';
      
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email \/ username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.clear(emailInput);
      await user.clear(passwordInput);
      
      await user.type(emailInput, 'admin@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/token tidak ditemukan/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Success Flow', () => {
    it('should save token and redirect when login succeeds', async () => {
      const user = userEvent.setup();
      mockAuthError = null;
      mockLoginFn.mockResolvedValue({ token: 'test-token-123' });
      
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email \/ username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.clear(emailInput);
      await user.clear(passwordInput);
      
      await user.type(emailInput, 'admin@test.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledWith('admin@test.com', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
      }, { timeout: 3000 });
    });
  });
});
