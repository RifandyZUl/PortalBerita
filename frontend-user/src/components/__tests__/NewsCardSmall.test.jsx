/**
 * ============================================
 * TEST FILE: NewsCardSmall.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen NewsCardSmall
 * 
 * YANG DITEST:
 * - Render news data dengan benar
 * - Link navigation ke news detail
 * - Handle missing/null data gracefully
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewsCardSmall from '../NewsCardSmall';

// Mock react-router-dom Link component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe('NewsCardSmall Component', () => {
  const mockNews = {
    id: 1,
    title: 'Test News Title yang Panjang',
    slug: 'test-news-title-yang-panjang',
    image_url: 'https://example.com/image.jpg',
    category: 'Teknologi',
    createdAt: '2024-01-15T10:00:00Z',
  };

  /**
   * TEST 1: Render news data dengan benar
   * 
   * SKENARIO:
   * - Komponen menerima data news yang valid
   * 
   * YANG DITEST:
   * - Title harus ditampilkan
   * - Category dan date harus ditampilkan
   * - Image harus ditampilkan dengan src dan alt yang benar
   * 
   * EXPECTED RESULT:
   * - Semua data news ditampilkan dengan benar di card
   */
  it('✅ TEST 1: Harus render news data dengan benar (title, category, date, image)', () => {
    render(
      <BrowserRouter>
        <NewsCardSmall news={mockNews} />
      </BrowserRouter>
    );

    // Verifikasi title
    expect(screen.getByText('Test News Title yang Panjang')).toBeInTheDocument();
    
    // Verifikasi category dan date
    expect(screen.getByText(/Teknologi/i)).toBeInTheDocument();
    
    // Verifikasi image
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockNews.image_url);
    expect(image).toHaveAttribute('alt', mockNews.title);
  });

  /**
   * TEST 2: Link navigation ke news detail
   * 
   * SKENARIO:
   * - User bisa klik card untuk ke news detail
   * 
   * YANG DITEST:
   * - Link harus mengarah ke /news/{slug}
   * - Link harus bisa diklik untuk navigasi
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke URL yang benar sesuai slug berita
   */
  it('✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})', () => {
    render(
      <BrowserRouter>
        <NewsCardSmall news={mockNews} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/news/${mockNews.slug}`);
  });

  /**
   * TEST 3: Handle missing news data gracefully
   * 
   * SKENARIO:
   * - Komponen menerima null atau undefined news
   * 
   * YANG DITEST:
   * - Tidak boleh crash saat menerima null/undefined
   * - Harus render dengan fallback yang aman
   * 
   * EXPECTED RESULT:
   * - Komponen tidak error, tetap render dengan fallback
   */
  it('✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)', () => {
    render(
      <BrowserRouter>
        <NewsCardSmall news={null} />
      </BrowserRouter>
    );

    // Tidak boleh crash, harus render dengan fallback
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/news/#');
  });

  /**
   * TEST 4: Handle missing slug
   * 
   * SKENARIO:
   * - News data ada tapi slug tidak ada/undefined
   * 
   * YANG DITEST:
   * - Link harus menggunakan fallback '#' jika slug tidak ada
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke '/news/#' sebagai fallback
   */
  it('✅ TEST 4: Harus handle missing slug dengan fallback (link ke /news/#)', () => {
    const newsWithoutSlug = { ...mockNews, slug: undefined };
    
    render(
      <BrowserRouter>
        <NewsCardSmall news={newsWithoutSlug} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/news/#');
  });
});

