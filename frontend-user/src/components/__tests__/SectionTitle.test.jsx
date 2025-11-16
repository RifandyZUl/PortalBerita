/**
 * ============================================
 * TEST FILE: SectionTitle.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen SectionTitle yang menampilkan judul section dengan styling khusus.
 * 
 * YANG DITEST:
 * 1. Render text sesuai prop yang dikirim
 * 2. Re-render dengan text berbeda (test reactivity)
 * 
 * BEST PRACTICES:
 * - Test presentational component (simple, no complex logic)
 * - Test prop changes dengan rerender
 * - Minimal test untuk simple components
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionTitle from '../SectionTitle';

describe('SectionTitle Component', () => {
  /**
   * TEST 1: Render text dengan benar
   * 
   * SKENARIO:
   * - Komponen menerima text prop
   * 
   * YANG DITEST:
   * - Text harus ditampilkan sesuai prop yang dikirim
   * 
   * EXPECTED RESULT:
   * - Text "Teknologi" ter-render di component
   */
  it('✅ TEST 1: Harus render text dengan benar (text sesuai prop)', () => {
    render(<SectionTitle text="Teknologi" />);

    expect(screen.getByText('Teknologi')).toBeInTheDocument();
  });

  /**
   * TEST 2: Render dengan text yang berbeda (re-render)
   * 
   * SKENARIO:
   * - Komponen menerima text yang berbeda (prop berubah)
   * 
   * YANG DITEST:
   * - Component harus re-render saat prop berubah
   * - Text harus update sesuai prop baru
   * 
   * EXPECTED RESULT:
   * - Text berubah dari "Hiburan" ke "Olahraga" saat prop berubah
   */
  it('✅ TEST 2: Harus render text sesuai prop yang dikirim (re-render saat prop berubah)', () => {
    const { rerender } = render(<SectionTitle text="Hiburan" />);
    expect(screen.getByText('Hiburan')).toBeInTheDocument();

    rerender(<SectionTitle text="Olahraga" />);
    expect(screen.getByText('Olahraga')).toBeInTheDocument();
  });
});

