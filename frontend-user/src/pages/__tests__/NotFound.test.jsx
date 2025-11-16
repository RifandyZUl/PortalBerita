/**
 * ============================================
 * TEST FILE: NotFound.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji halaman NotFound (404) yang ditampilkan saat halaman tidak ditemukan.
 * 
 * YANG DITEST:
 * 1. Render 404 message dengan benar
 * 2. Link kembali ke beranda
 * 
 * BEST PRACTICES:
 * - Test simple presentational page
 * - Test navigation link
 * - Minimal test untuk error pages
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../NotFound';

// Mock react-router-dom Link component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe('NotFound Page', () => {
  /**
   * TEST 1: Render 404 message
   * 
   * SKENARIO:
   * - User mengakses halaman yang tidak ada (404)
   * 
   * YANG DITEST:
   * - Harus menampilkan "404" (error code)
   * - Harus menampilkan "Halaman tidak ditemukan" (error message)
   * 
   * EXPECTED RESULT:
   * - Text "404" dan "Halaman tidak ditemukan" ter-render
   */
  it('✅ TEST 1: Harus render 404 message dengan benar (404 + Halaman tidak ditemukan)', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Halaman tidak ditemukan')).toBeInTheDocument();
  });

  /**
   * TEST 2: Link kembali ke beranda
   * 
   * SKENARIO:
   * - User klik link "Kembali ke Beranda" untuk kembali ke home
   * 
   * YANG DITEST:
   * - Link harus mengarah ke "/" (root path)
   * - Link harus bisa diklik untuk navigasi
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke "/" dan bisa diklik
   */
  it('✅ TEST 2: Harus memiliki link kembali ke beranda (navigate ke /)', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole('link', { name: /kembali ke beranda/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

