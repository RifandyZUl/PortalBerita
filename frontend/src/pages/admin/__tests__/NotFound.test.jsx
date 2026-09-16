import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../NotFound';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFound Page', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should display 404 message', () => {
      renderWithRouter(<NotFound />);
      
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Halaman tidak ditemukan')).toBeInTheDocument();
    });

    it('should have link back to home', () => {
      renderWithRouter(<NotFound />);
      
      const homeLink = screen.getByRole('link', { name: /kembali ke beranda/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have correct styling', () => {
      const { container } = renderWithRouter(<NotFound />);
      
      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });
  });
});
