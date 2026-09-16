import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Topbar from '../Topbar';
import * as tokenUtils from '../../utils/token';
import { createMockAdmin, createMockAdminResponse } from '../../test/factories';

// Mock api utils
const mockApiGet = vi.fn();
vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

// Mock dependencies
vi.mock('../../utils/token');
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

describe('Topbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiGet.mockReset();
    tokenUtils.getToken.mockReturnValue('test-token');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render title "News Portal Admin"', () => {
      mockApiGet.mockResolvedValue(createMockAdminResponse({}));

      renderWithRouter(<Topbar onMenuClick={vi.fn()} />);
      
      expect(screen.getByText('News Portal Admin')).toBeInTheDocument();
    });

    it('should render menu button for mobile', () => {
      mockApiGet.mockResolvedValue(createMockAdminResponse({}));

      const mockOnMenuClick = vi.fn();
      renderWithRouter(<Topbar onMenuClick={mockOnMenuClick} />);
      
      // Menu button doesn't have aria-label, get all buttons and find the first one (menu button)
      const buttons = screen.getAllByRole('button');
      // Menu button is the first button (before logout button)
      const menuButton = buttons[0];
      expect(menuButton).toBeInTheDocument();
    });

    it('should display logout button', async () => {
      mockApiGet.mockResolvedValue(createMockAdminResponse({}));

      renderWithRouter(<Topbar onMenuClick={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('User Interactions', () => {
    it('should call onMenuClick when menu button is clicked', async () => {
      mockApiGet.mockResolvedValue(createMockAdminResponse({}));

      const user = userEvent.setup();
      const mockOnMenuClick = vi.fn();
      renderWithRouter(<Topbar onMenuClick={mockOnMenuClick} />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });

      // Menu button is the first button (before logout button)
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons[0];
      await user.click(menuButton);
      
      expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Display', () => {
    it('should display admin profile after data is loaded', async () => {
      const mockAdmin = createMockAdmin({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        photo: 'https://example.com/photo.jpg',
      });

      mockApiGet.mockResolvedValue(createMockAdminResponse(mockAdmin));

      renderWithRouter(<Topbar onMenuClick={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});
