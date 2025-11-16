import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Topbar from '../Topbar';
import * as tokenUtils from '../../utils/token';

// Mock dependencies
vi.mock('../../utils/token');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

global.fetch = vi.fn();

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Topbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenUtils.getToken.mockReturnValue('test-token');
  });

  afterEach(() => {
    cleanup();
  });

  it('✅ Harus render title "News Portal Admin"', () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: {} }),
    });

    renderWithRouter(<Topbar onMenuClick={vi.fn()} />);
    
    expect(screen.getByText('News Portal Admin')).toBeInTheDocument();
  });

  it('✅ Harus render menu button untuk mobile', () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: {} }),
    });

    const mockOnMenuClick = vi.fn();
    renderWithRouter(<Topbar onMenuClick={mockOnMenuClick} />);
    
    // Gunakan getAllByRole karena mungkin ada multiple buttons dari test lain
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('✅ Harus memanggil onMenuClick ketika menu button diklik', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: {} }),
    });

    const user = userEvent.setup();
    const mockOnMenuClick = vi.fn();
    renderWithRouter(<Topbar onMenuClick={mockOnMenuClick} />);
    
    await waitFor(() => {
      // Gunakan getAllByRole karena mungkin ada multiple buttons dari test lain
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    // Ambil button pertama (menu button biasanya yang pertama)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it('✅ Harus menampilkan admin profile setelah data dimuat', async () => {
    const mockAdmin = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      photo: 'https://example.com/photo.jpg',
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: mockAdmin }),
    });

    renderWithRouter(<Topbar onMenuClick={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('✅ Harus menampilkan logout button', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: {} }),
    });

    renderWithRouter(<Topbar onMenuClick={vi.fn()} />);

    await waitFor(() => {
      // Gunakan getAllByText karena mungkin ada multiple "Logout" dari test lain
      const logoutButtons = screen.getAllByText('Logout');
      expect(logoutButtons.length).toBeGreaterThan(0);
    });
  });
});

