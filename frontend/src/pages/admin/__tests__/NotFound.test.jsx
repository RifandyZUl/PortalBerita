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
  it('✅ Harus menampilkan pesan 404', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Halaman tidak ditemukan')).toBeInTheDocument();
  });

  it('✅ Harus memiliki link kembali ke beranda', () => {
    const { container } = renderWithRouter(<NotFound />);
    
    // Gunakan queryAllByRole untuk menghindari multiple elements error
    const links = screen.getAllByRole('link', { name: /kembali ke beranda/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/');
  });

  it('✅ Harus memiliki styling yang benar', () => {
    const { container } = renderWithRouter(<NotFound />);
    
    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });
});

