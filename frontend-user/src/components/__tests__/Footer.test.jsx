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

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  /**
   * TEST 1: Render footer dengan konten lengkap
   * 
   * SKENARIO:
   * - Footer harus menampilkan semua section (Tautan, Kontak, Logo)
   * 
   * YANG DITEST:
   * - Section headers harus ada (TAUTAN, KONTAK KAMI)
   * - Links harus ada (winnicode.com, Instagram)
   * - Informasi kontak harus ada (email, phone, alamat)
   * 
   * EXPECTED RESULT:
   * - Semua section ter-render dengan konten lengkap
   */
  it('✅ TEST 1: Harus render footer dengan konten lengkap (Tautan, Kontak, Logo)', () => {
    render(<Footer />);

    // Verifikasi section headers
    expect(screen.getByText('TAUTAN')).toBeInTheDocument();
    expect(screen.getByText('KONTAK KAMI')).toBeInTheDocument();

    // Verifikasi links
    expect(screen.getByText('www.winnicode.com')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();

    // Verifikasi informasi kontak
    expect(screen.getByText(/winnicodegaruda@gmail.com/i)).toBeInTheDocument();
    // Ada 2 elemen dengan nomor yang sama, gunakan getAllByText
    const phoneNumbers = screen.getAllByText(/62815199932501/i);
    expect(phoneNumbers.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * TEST 2: External links harus memiliki security attributes
   * 
   * SKENARIO:
   * - Link external harus aman (mencegah tabnabbing attack)
   * 
   * YANG DITEST:
   * - Link winnicode.com harus punya target="_blank"
   * - Harus punya rel="noopener noreferrer" untuk security
   * 
   * EXPECTED RESULT:
   * - External link memiliki target="_blank" dan rel="noopener noreferrer"
   */
  it('✅ TEST 2: External links harus memiliki security attributes (target="_blank", rel="noopener noreferrer")', () => {
    render(<Footer />);

    const winnicodeLink = screen.getByText('www.winnicode.com').closest('a');
    expect(winnicodeLink).toHaveAttribute('target', '_blank');
    expect(winnicodeLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(winnicodeLink).toHaveAttribute('href', 'https://winnicode.com');
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
  it('✅ TEST 3: Copyright year harus sesuai dengan tahun saat ini (dinamis: 2025)', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(/All rights reserved/i);
    
    expect(copyrightText).toBeInTheDocument();
    expect(copyrightText.textContent).toContain(currentYear.toString());
  });

  /**
   * TEST 4: Alamat cabang harus ditampilkan
   * 
   * SKENARIO:
   * - Footer harus menampilkan alamat semua cabang
   * 
   * YANG DITEST:
   * - Alamat Bandung harus ada
   * - Alamat Yogyakarta harus ada
   * - Alamat Jakarta harus ada
   * 
   * EXPECTED RESULT:
   * - Semua alamat cabang ter-render dengan lengkap
   */
  it('✅ TEST 4: Harus menampilkan alamat semua cabang (Bandung, Yogyakarta, Jakarta)', () => {
    render(<Footer />);

    expect(screen.getByText(/Alamat Cabang Bandung/i)).toBeInTheDocument();
    expect(screen.getByText(/Alamat Cabang Yogyakarta/i)).toBeInTheDocument();
    expect(screen.getByText(/Alamat Cabang Jakarta/i)).toBeInTheDocument();
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
   * - Logo ter-render dengan src="/logo/WinniCode.png" dan alt="Winnicode Logo"
   */
  it('✅ TEST 5: Harus menampilkan logo dengan alt text yang benar (accessibility)', () => {
    render(<Footer />);

    const logo = screen.getByAltText('Winnicode Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo/WinniCode.png');
  });
});

