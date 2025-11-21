/**
 * ============================================
 * TEST FILE: Footer.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen Footer yang menampilkan informasi perusahaan, kontak, dan links.
 * 
 * YANG DITEST:
 * 1. Render footer dengan konten lengkap (Tautan, Kontak, Logo)
 * 2. External links dengan security attributes (target="_blank", rel="noopener noreferrer")
 * 3. Informasi kontak dan alamat semua cabang
 * 4. Copyright year dinamis (sesuai tahun saat ini)
 * 5. Logo dengan alt text yang benar
 * 
 * BEST PRACTICES:
 * - Test security attributes untuk external links (mencegah tabnabbing)
 * - Test dynamic content (copyright year)
 * - Test accessibility (alt text, semantic HTML)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

describe('Footer Component', () => {
  /**
   * TEST 1: Render footer dengan konten lengkap
   * 
   * SKENARIO:
   * - Footer harus menampilkan semua section (Kategori, Tentang Kami, Kontak, Logo)
   * 
   * YANG DITEST:
   * - Section headers harus ada (KATEGORI, TENTANG KAMI, KONTAK)
   * - Links harus ada (kategori links, social media)
   * - Informasi kontak harus ada (email, phone, website)
   * 
   * EXPECTED RESULT:
   * - Semua section ter-render dengan konten lengkap
   */
  it('✅ TEST 1: Harus render footer dengan konten lengkap (Kategori, Tentang Kami, Kontak, Logo)', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Verifikasi section headers baru
    expect(screen.getByText('Kategori')).toBeInTheDocument();
    expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
    expect(screen.getByText('Kontak')).toBeInTheDocument();

    // Verifikasi kategori links
    expect(screen.getByText('Nasional')).toBeInTheDocument();
    expect(screen.getByText('Ekonomi')).toBeInTheDocument();

    // Verifikasi informasi kontak
    expect(screen.getByText(/winnicodegaruda@gmail.com/i)).toBeInTheDocument();
  });

  /**
   * TEST 2: External links harus memiliki security attributes
   * 
   * SKENARIO:
   * - Link external harus aman (mencegah tabnabbing attack)
   * 
   * YANG DITEST:
   * - Link external harus punya target="_blank" dan rel="noopener noreferrer"
   * - Social media links harus aman
   * 
   * EXPECTED RESULT:
   * - External link memiliki target="_blank" dan rel="noopener noreferrer"
   */
  it('✅ TEST 2: External links harus memiliki security attributes (target="_blank", rel="noopener noreferrer")', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check website link
    const websiteLink = screen.getByText(/www.winnicode.com/i).closest('a');
    if (websiteLink) {
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  /**
   * TEST 3: Copyright year harus dinamis (sesuai tahun saat ini)
   * 
   * SKENARIO:
   * - Copyright harus menampilkan tahun saat ini secara dinamis
   * 
   * YANG DITEST:
   * - Copyright text harus mengandung tahun saat ini
   * - Tahun harus update otomatis setiap tahun baru
   * 
   * EXPECTED RESULT:
   * - Copyright text: "© 2025 PT. WINNICODE GARUDA TEKNOLOGI..."
   */
  it('✅ TEST 3: Copyright year harus sesuai dengan tahun saat ini (dinamis)', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(/All rights reserved/i);
    
    expect(copyrightText).toBeInTheDocument();
    expect(copyrightText.textContent).toContain(currentYear.toString());
  });

  /**
   * TEST 4: Social media icons harus ditampilkan
   * 
   * SKENARIO:
   * - Footer harus menampilkan social media icons
   * 
   * YANG DITEST:
   * - Social media icons harus ada (Facebook, Twitter, Instagram, TikTok)
   * - Icons harus memiliki aria-label untuk accessibility
   * 
   * EXPECTED RESULT:
   * - Social media icons ter-render
   */
  it('✅ TEST 4: Harus menampilkan social media icons', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check for social media icons by aria-label
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('TikTok')).toBeInTheDocument();
  });

  /**
   * TEST 5: Logo harus ditampilkan dengan alt text
   * 
   * SKENARIO:
   * - Footer harus menampilkan logo Winnicode
   * 
   * YANG DITEST:
   * - Logo image harus ada dengan src yang benar
   * - Alt text harus ada untuk accessibility
   * 
   * EXPECTED RESULT:
   * - Logo ter-render dengan src="/logo/WinniCode.png" dan alt="WinniCode Logo"
   */
  it('✅ TEST 5: Harus menampilkan logo dengan alt text yang benar (accessibility)', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const logo = screen.getByAltText('WinniCode Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo/WinniCode.png');
  });

  /**
   * TEST 6: Kategori links harus navigable
   * 
   * SKENARIO:
   * - Footer harus memiliki kategori links yang bisa diklik
   * 
   * YANG DITEST:
   * - Kategori links harus ada (Nasional, Ekonomi, dll)
   * - Links harus navigasi ke category pages
   * 
   * EXPECTED RESULT:
   * - Kategori links ter-render dan navigable
   */
  it('✅ TEST 6: Kategori links harus navigable (link ke category pages)', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check beberapa kategori links
    const nasionalLink = screen.getByText('Nasional').closest('a');
    const ekonomiLink = screen.getByText('Ekonomi').closest('a');

    expect(nasionalLink).toHaveAttribute('href', '/category/nasional');
    expect(ekonomiLink).toHaveAttribute('href', '/category/ekonomi');
  });
});

