/**
 * ============================================
 * TEST FILE: LatestNewsSection.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen LatestNewsSection yang menampilkan daftar 10 berita terbaru.
 * 
 * YANG DITEST:
 * - Render latest news dengan format bernomor
 * - Render maksimal 10 berita
 * - Link navigation ke news detail
 * - Handle empty news array
 * - Accessibility (aria-label, semantic HTML)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LatestNewsSection from '../LatestNewsSection';

// Mock react-router-dom Link component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe('LatestNewsSection Component', () => {
  const mockLatestNews = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Latest News ${i + 1}`,
    slug: `latest-news-${i + 1}`,
  }));

  /**
   * TEST 1: Render latest news dengan format bernomor
   * 
   * SKENARIO:
   * - Komponen menerima array latest news
   * 
   * YANG DITEST:
   * - Harus menampilkan nomor urutan (1, 2, 3, ...)
   * - Harus menampilkan title berita
   * - Harus menampilkan maksimal 10 berita (slice(0, 10))
   * 
   * EXPECTED RESULT:
   * - Format: "1. Title", "2. Title", ... maksimal 10 items
   */
  it('✅ TEST 1: Harus render latest news dengan format bernomor (1, 2, 3, ... maksimal 10)', () => {
    render(
      <BrowserRouter>
        <LatestNewsSection latestNews={mockLatestNews} />
      </BrowserRouter>
    );

    // Verifikasi hanya 10 berita yang ditampilkan (meskipun ada 12)
    const newsLinks = screen.getAllByRole('link');
    expect(newsLinks.length).toBe(10);

    // Verifikasi nomor urutan dan title
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Latest News 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Latest News 10')).toBeInTheDocument();

    // Berita ke-11 dan 12 tidak boleh ditampilkan
    expect(screen.queryByText('Latest News 11')).not.toBeInTheDocument();
    expect(screen.queryByText('Latest News 12')).not.toBeInTheDocument();
  });

  /**
   * TEST 2: Link navigation ke news detail
   * 
   * SKENARIO:
   * - User bisa klik berita untuk ke detail
   * 
   * YANG DITEST:
   * - Setiap link harus mengarah ke /news/{slug}
   * - Link harus bisa diklik untuk navigasi
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke URL yang benar sesuai slug berita
   */
  it('✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})', () => {
    render(
      <BrowserRouter>
        <LatestNewsSection latestNews={mockLatestNews.slice(0, 5)} />
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/news/latest-news-1');
    expect(links[1]).toHaveAttribute('href', '/news/latest-news-2');
  });

  /**
   * TEST 3: Handle empty news array
   * 
   * SKENARIO:
   * - Komponen menerima array kosong (tidak ada data)
   * 
   * YANG DITEST:
   * - Edge case: tidak boleh crash saat array kosong
   * - Tidak ada berita yang ditampilkan
   * 
   * EXPECTED RESULT:
   * - Component tetap render, tidak crash
   * - Tidak ada link berita yang ditampilkan
   */
  it('✅ TEST 3: Harus handle empty news array dengan benar (edge case: no data)', () => {
    render(
      <BrowserRouter>
        <LatestNewsSection latestNews={[]} />
      </BrowserRouter>
    );

    // Tidak boleh crash
    const section = screen.getByRole('region', { name: /latest news/i });
    expect(section).toBeInTheDocument();

    // Tidak ada link berita
    const links = screen.queryAllByRole('link');
    expect(links.length).toBe(0);
  });

  /**
   * TEST 4: Accessibility - Harus memiliki aria-label dan semantic HTML
   * 
   * SKENARIO:
   * - Komponen harus accessible untuk screen reader
   * 
   * YANG DITEST:
   * - Harus memiliki section dengan aria-labelledby
   * - Harus memiliki heading dengan id yang sesuai
   * - Semantic HTML untuk accessibility
   * 
   * EXPECTED RESULT:
   * - Section dengan aria-labelledby="latest-news-heading"
   * - Heading dengan id="latest-news-heading"
   */
  it('✅ TEST 4: Harus memiliki struktur accessibility yang benar (aria-label, semantic HTML)', () => {
    render(
      <BrowserRouter>
        <LatestNewsSection latestNews={mockLatestNews.slice(0, 3)} />
      </BrowserRouter>
    );

    // Verifikasi section dengan aria-labelledby
    const section = screen.getByRole('region', { name: /latest news/i });
    expect(section).toBeInTheDocument();

    // Verifikasi heading dengan id
    const heading = screen.getByRole('heading', { name: /latest news/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'latest-news-heading');
  });

  /**
   * TEST 5: Render dengan news kurang dari 10
   * 
   * SKENARIO:
   * - Komponen menerima kurang dari 10 berita (misal: 5 berita)
   * 
   * YANG DITEST:
   * - Harus menampilkan semua berita yang ada (tidak perlu 10)
   * - Tidak boleh menampilkan lebih dari yang ada
   * 
   * EXPECTED RESULT:
   * - Semua 5 berita ditampilkan (tidak perlu sampai 10)
   */
  it('✅ TEST 5: Harus render semua berita jika kurang dari 10 (tampilkan semua yang ada)', () => {
    const fewNews = mockLatestNews.slice(0, 5);

    render(
      <BrowserRouter>
        <LatestNewsSection latestNews={fewNews} />
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5); // Semua 5 berita harus ditampilkan
  });
});

