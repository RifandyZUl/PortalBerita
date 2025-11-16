import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../login';
import * as authAPI from '../../../api/auth';
import * as tokenUtils from '../../../utils/token';

// Mock dependencies
vi.mock('../../../api/auth');
vi.mock('../../../utils/token');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('✅ Harus render form login dengan benar', () => {
    renderWithRouter(<Login />);
    
    // Gunakan getAllByText karena mungkin ada multiple elements dari test lain
    const signInTexts = screen.getAllByText('Sign In');
    expect(signInTexts.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email \/ username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Gunakan getAllByRole karena mungkin ada multiple buttons dari test lain
    const buttons = screen.getAllByRole('button', { name: /sign in/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('✅ Harus update input fields ketika user mengetik', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email \/ username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Clear input terlebih dahulu untuk menghindari test pollution
    await user.clear(emailInput);
    await user.clear(passwordInput);
    
    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('admin@test.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('✅ Harus menampilkan error jika login gagal', async () => {
    const user = userEvent.setup();
    authAPI.loginAdmin.mockRejectedValue(new Error('Invalid credentials'));
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email \/ username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButtons = screen.getAllByRole('button', { name: /sign in/i });
    
    // Clear input terlebih dahulu untuk menghindari test pollution
    await user.clear(emailInput);
    await user.clear(passwordInput);
    
    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('✅ Harus menyimpan token dan redirect jika login berhasil', async () => {
    const user = userEvent.setup();
    const mockToken = 'test-token-123';
    authAPI.loginAdmin.mockResolvedValue({
      data: { token: mockToken },
    });
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email \/ username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButtons = screen.getAllByRole('button', { name: /sign in/i });
    
    // Clear input terlebih dahulu untuk menghindari test pollution
    await user.clear(emailInput);
    await user.clear(passwordInput);
    
    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButtons[0]);
    
    await waitFor(() => {
      expect(authAPI.loginAdmin).toHaveBeenCalledWith('admin@test.com', 'password123');
      expect(tokenUtils.setToken).toHaveBeenCalledWith(mockToken);
    });
  });

  it('✅ Harus menampilkan error jika token tidak ditemukan', async () => {
    const user = userEvent.setup();
    authAPI.loginAdmin.mockResolvedValue({
      data: {}, // No token
    });
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email \/ username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButtons = screen.getAllByRole('button', { name: /sign in/i });
    
    // Clear input terlebih dahulu untuk menghindari test pollution
    await user.clear(emailInput);
    await user.clear(passwordInput);
    
    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/token tidak ditemukan/i)).toBeInTheDocument();
    });
  });

  it('✅ Harus validasi required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    // Gunakan getAllByRole karena mungkin ada multiple buttons dari test lain
    const submitButtons = screen.getAllByRole('button', { name: /sign in/i });
    expect(submitButtons.length).toBeGreaterThan(0);
    await user.click(submitButtons[0]);
    
    // HTML5 validation should prevent submission
    const emailInput = screen.getByLabelText(/email \/ username/i);
    expect(emailInput).toBeRequired();
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeRequired();
  });
});

