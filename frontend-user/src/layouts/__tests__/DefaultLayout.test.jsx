/**
 * ============================================
 * TEST FILE: DefaultLayout.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen DefaultLayout yang merupakan layout wrapper untuk semua halaman.
 * 
 * YANG DITEST:
 * 1. Render Header component
 * 2. Render Footer component
 * 3. Render Outlet (children pages)
 * 4. Layout structure (flex column, min-h-screen)
 * 
 * BEST PRACTICES:
 * - Mock child components untuk isolation
 * - Test layout structure
 * - Test Outlet rendering
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DefaultLayout from '../DefaultLayout';

// Mock Header
vi.mock('@/components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

// Mock Footer
vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <main data-testid="outlet">Outlet Content</main>,
  };
});

describe('DefaultLayout Component', () => {
  /**
   * TEST 1: Render Header component
   * 
   * SKENARIO:
   * - Layout harus menampilkan Header
   * 
   * YANG DITEST:
   * - Header component harus ter-render
   * 
   * EXPECTED RESULT:
   * - Header ter-render di layout
   */
  it('✅ TEST 1: Harus render Header component', () => {
    render(
      <BrowserRouter>
        <DefaultLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  /**
   * TEST 2: Render Footer component
   * 
   * SKENARIO:
   * - Layout harus menampilkan Footer
   * 
   * YANG DITEST:
   * - Footer component harus ter-render
   * 
   * EXPECTED RESULT:
   * - Footer ter-render di layout
   */
  it('✅ TEST 2: Harus render Footer component', () => {
    render(
      <BrowserRouter>
        <DefaultLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  /**
   * TEST 3: Render Outlet (children pages)
   * 
   * SKENARIO:
   * - Layout harus menampilkan Outlet untuk child routes
   * 
   * YANG DITEST:
   * - Outlet component harus ter-render
   * 
   * EXPECTED RESULT:
   * - Outlet ter-render di layout
   */
  it('✅ TEST 3: Harus render Outlet (children pages)', () => {
    render(
      <BrowserRouter>
        <DefaultLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  /**
   * TEST 4: Layout structure (flex column, min-h-screen)
   * 
   * SKENARIO:
   * - Layout harus memiliki struktur yang benar
   * 
   * YANG DITEST:
   * - Container harus memiliki class flex flex-col min-h-screen
   * - Main harus memiliki class flex-1
   * 
   * EXPECTED RESULT:
   * - Layout memiliki struktur yang benar
   */
  it('✅ TEST 4: Harus memiliki layout structure yang benar (flex column, min-h-screen)', () => {
    const { container } = render(
      <BrowserRouter>
        <DefaultLayout />
      </BrowserRouter>
    );

    const layoutContainer = container.firstChild;
    expect(layoutContainer).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-white');
    
    const main = screen.getByTestId('outlet').parentElement;
    expect(main).toHaveClass('flex-1');
  });
});

