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

  it('✅ Harus render title "Admin Panel"', () => {
    const mockOnClose = vi.fn();
    renderWithRouter(<Sidebar onClose={mockOnClose} />);
    
    const titles = screen.getAllByText('Admin Panel');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('✅ Harus render semua navigation links', () => {
    const mockOnClose = vi.fn();
    renderWithRouter(<Sidebar onClose={mockOnClose} />);
    
    // Gunakan getAllByText karena mungkin ada multiple elements dari test lain
    const dashboardTexts = screen.getAllByText('Dashboard');
    expect(dashboardTexts.length).toBeGreaterThan(0);
    
    const manageNewsTexts = screen.getAllByText('Manage News');
    expect(manageNewsTexts.length).toBeGreaterThan(0);
    
    const manageCategoriesTexts = screen.getAllByText('Manage Categories');
    expect(manageCategoriesTexts.length).toBeGreaterThan(0);
    
    const manageCommentsTexts = screen.getAllByText('Manage Comments');
    expect(manageCommentsTexts.length).toBeGreaterThan(0);
    
    const settingsTexts = screen.getAllByText('Settings');
    expect(settingsTexts.length).toBeGreaterThan(0);
  });

  it('✅ Harus memanggil onClose ketika tombol close diklik', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    renderWithRouter(<Sidebar onClose={mockOnClose} />);
    
    // Find close button (X icon) - gunakan getAllByRole karena mungkin ada multiple buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    // Ambil button pertama (close button biasanya yang pertama)
    await user.click(buttons[0]);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('✅ Harus memiliki link dengan path yang benar', () => {
    const mockOnClose = vi.fn();
    renderWithRouter(<Sidebar onClose={mockOnClose} />);
    
    // Gunakan getAllByRole karena mungkin ada multiple links dari test lain
    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
    expect(dashboardLinks[0]).toHaveAttribute('href', '/admin/dashboard');
    
    const newsLinks = screen.getAllByRole('link', { name: /manage news/i });
    expect(newsLinks.length).toBeGreaterThan(0);
    expect(newsLinks[0]).toHaveAttribute('href', '/admin/manage-news');
  });
});

