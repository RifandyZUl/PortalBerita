import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render title "Admin Panel"', () => {
      const mockOnClose = vi.fn();
      renderWithRouter(<Sidebar onClose={mockOnClose} />);
      
      // There are two "Admin Panel" headings (mobile and desktop), use getAllByText
      const headings = screen.getAllByText('Admin Panel');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should render all navigation links', () => {
      const mockOnClose = vi.fn();
      renderWithRouter(<Sidebar onClose={mockOnClose} />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage News')).toBeInTheDocument();
      expect(screen.getByText('Manage Categories')).toBeInTheDocument();
      expect(screen.getByText('Manage Comments')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should have links with correct paths', () => {
      const mockOnClose = vi.fn();
      renderWithRouter(<Sidebar onClose={mockOnClose} />);
      
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/admin/dashboard');
      
      const newsLink = screen.getByRole('link', { name: /manage news/i });
      expect(newsLink).toHaveAttribute('href', '/admin/manage-news');
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();
      
      renderWithRouter(<Sidebar onClose={mockOnClose} />);
      
      // Close button doesn't have aria-label, get all buttons and find the one with X icon
      const buttons = screen.getAllByRole('button');
      // The close button is the first button (before navigation links)
      const closeButton = buttons[0];
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
