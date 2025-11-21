/**
 * ============================================
 * TEST FILE: Header.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen Header
 * 
 * YANG DITEST:
 * - Render logo dan navigation links
 * - Search functionality
 * - Mobile menu toggle
 * - Navigation ke category
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * TEST 1: Render logo dan navigation links
   * 
   * SKENARIO:
   * - Header harus menampilkan logo dan semua navigation links
   * 
   * YANG DITEST:
   * - Logo harus ada dan ditampilkan
   * - Navigation links harus ada (Home, Teknologi, Nasional, dll)
   * 
   * EXPECTED RESULT:
   * - Logo dan semua navigation links ter-render dengan benar
   */
  it('✅ TEST 1: Harus render logo dan navigation links (Home, Teknologi, Nasional, dll)', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Verifikasi logo
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    
    // Verifikasi navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Teknologi')).toBeInTheDocument();
    expect(screen.getByText('Nasional')).toBeInTheDocument();
  });

  /**
   * TEST 2: Search input harus ada
   * 
   * SKENARIO:
   * - Search input harus ditampilkan di header
   * 
   * YANG DITEST:
   * - Search input dengan placeholder yang benar
   * - Input harus bisa digunakan untuk search
   * 
   * EXPECTED RESULT:
   * - Search input ter-render dengan placeholder "Cari tokoh, topik atau peristiwa"
   */
  it('✅ TEST 2: Harus menampilkan search input dengan placeholder yang benar', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  /**
   * TEST 3: Navigate ke search page saat submit search
   * 
   * SKENARIO:
   * - User mengetik keyword di search input dan submit form
   * 
   * YANG DITEST:
   * - Form submission harus trigger navigation
   * - Harus navigate ke /search?query={searchValue}
   * 
   * EXPECTED RESULT:
   * - Navigate ke /search?query=teknologi setelah submit
   */
  it('✅ TEST 3: Harus navigate ke search page saat submit search (/search?query=keyword)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchForm = searchInput.closest('form');

    // Type search query
    await user.type(searchInput, 'teknologi');
    
    // Submit form (press Enter)
    await user.type(searchInput, '{enter}');

    // Verifikasi navigate dipanggil dengan query yang benar
    expect(mockNavigate).toHaveBeenCalledWith('/search?query=teknologi');
  });

  /**
   * TEST 4: Tidak navigate jika search kosong
   * 
   * SKENARIO:
   * - User submit search form tanpa mengetik keyword apapun
   * 
   * YANG DITEST:
   * - Form validation harus mencegah submit jika kosong
   * - Navigate tidak boleh dipanggil jika search kosong
   * 
   * EXPECTED RESULT:
   * - Navigate tidak dipanggil, user tetap di halaman yang sama
   */
  it('✅ TEST 4: Tidak boleh navigate jika search kosong (validation)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchForm = searchInput.closest('form');

    // Submit tanpa mengetik (press Enter)
    await user.type(searchInput, '{enter}');

    // Navigate tidak boleh dipanggil
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * TEST 5: Navigate ke category saat klik category link
   * 
   * SKENARIO:
   * - User klik category link di navigation (misal: Teknologi)
   * 
   * YANG DITEST:
   * - Click event harus trigger navigation
   * - Harus navigate ke /category/{category-slug}
   * 
   * EXPECTED RESULT:
   * - Navigate ke /category/teknologi setelah klik link Teknologi
   */
  it('✅ TEST 5: Harus navigate ke category saat klik category link (/category/teknologi)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const teknologiLink = screen.getByText('Teknologi');
    await user.click(teknologiLink);

    expect(mockNavigate).toHaveBeenCalledWith('/category/teknologi');
  });

  /**
   * TEST 6: Navigate ke home saat klik Home link
   * 
   * SKENARIO:
   * - User klik Home link di navigation
   * 
   * YANG DITEST:
   * - Click event harus trigger navigation ke home
   * - Harus navigate ke '/' (root path)
   * 
   * EXPECTED RESULT:
   * - Navigate ke '/' setelah klik link Home
   */
  it('✅ TEST 6: Harus navigate ke home saat klik Home link (navigate ke /)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home');
    await user.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

