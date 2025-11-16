/**
 * ============================================
 * TEST FILE: time.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji fungsi formatWaktuLalu di utils/time.js
 * 
 * YANG DITEST:
 * - Format waktu relatif (baru saja, X menit yang lalu, dll)
 * - Format tanggal lengkap untuk waktu > 7 hari
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatWaktuLalu } from '../time.js';

describe('formatWaktuLalu', () => {
  // Mock Date.now() untuk test yang konsisten
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * TEST 1: Waktu baru saja (< 1 menit)
   * 
   * SKENARIO:
   * - Waktu kurang dari 1 menit yang lalu (30 detik yang lalu)
   * 
   * YANG DITEST:
   * - Fungsi formatWaktuLalu harus mengembalikan "Baru saja"
   * 
   * EXPECTED RESULT:
   * - Return value: "Baru saja"
   */
  it('✅ TEST 1: Harus mengembalikan "Baru saja" untuk waktu < 1 menit (30 detik yang lalu)', () => {
    const now = new Date('2024-01-15T10:00:00Z');
    vi.setSystemTime(now);

    const thirtySecondsAgo = new Date('2024-01-15T09:59:30Z');
    const result = formatWaktuLalu(thirtySecondsAgo);

    expect(result).toBe('Baru saja');
  });

  /**
   * TEST 2: Waktu beberapa menit yang lalu
   * 
   * SKENARIO:
   * - Waktu 5 menit yang lalu
   * 
   * YANG DITEST:
   * - Fungsi harus menghitung selisih waktu dalam menit
   * - Harus mengembalikan format "X menit yang lalu"
   * 
   * EXPECTED RESULT:
   * - Return value: "5 menit yang lalu"
   */
  it('✅ TEST 2: Harus mengembalikan "5 menit yang lalu" untuk waktu < 60 menit', () => {
    const now = new Date('2024-01-15T10:00:00Z');
    vi.setSystemTime(now);

    const fiveMinutesAgo = new Date('2024-01-15T09:55:00Z');
    const result = formatWaktuLalu(fiveMinutesAgo);

    expect(result).toBe('5 menit yang lalu');
  });

  /**
   * TEST 3: Waktu beberapa jam yang lalu
   * 
   * SKENARIO:
   * - Waktu 3 jam yang lalu
   * 
   * YANG DITEST:
   * - Fungsi harus menghitung selisih waktu dalam jam
   * - Harus mengembalikan format "X jam yang lalu"
   * 
   * EXPECTED RESULT:
   * - Return value: "3 jam yang lalu"
   */
  it('✅ TEST 3: Harus mengembalikan "3 jam yang lalu" untuk waktu < 24 jam', () => {
    const now = new Date('2024-01-15T10:00:00Z');
    vi.setSystemTime(now);

    const threeHoursAgo = new Date('2024-01-15T07:00:00Z');
    const result = formatWaktuLalu(threeHoursAgo);

    expect(result).toBe('3 jam yang lalu');
  });

  /**
   * TEST 4: Waktu beberapa hari yang lalu
   * 
   * SKENARIO:
   * - Waktu 3 hari yang lalu
   * 
   * YANG DITEST:
   * - Fungsi harus menghitung selisih waktu dalam hari
   * - Harus mengembalikan format "X hari yang lalu"
   * 
   * EXPECTED RESULT:
   * - Return value: "3 hari yang lalu"
   */
  it('✅ TEST 4: Harus mengembalikan "3 hari yang lalu" untuk waktu < 7 hari', () => {
    const now = new Date('2024-01-15T10:00:00Z');
    vi.setSystemTime(now);

    const threeDaysAgo = new Date('2024-01-12T10:00:00Z');
    const result = formatWaktuLalu(threeDaysAgo);

    expect(result).toBe('3 hari yang lalu');
  });

  /**
   * TEST 5: Waktu lebih dari 7 hari
   * 
   * SKENARIO:
   * - Waktu 10 hari yang lalu (lebih dari 7 hari)
   * 
   * YANG DITEST:
   * - Fungsi harus switch ke format tanggal lengkap
   * - Harus mengembalikan tanggal dalam format Indonesia (contoh: "5 Januari 2024")
   * 
   * EXPECTED RESULT:
   * - Return value: Format tanggal Indonesia (day month year)
   */
  it('✅ TEST 5: Harus mengembalikan tanggal lengkap untuk waktu > 7 hari (format: "5 Januari 2024")', () => {
    const now = new Date('2024-01-15T10:00:00Z');
    vi.setSystemTime(now);

    const tenDaysAgo = new Date('2024-01-05T10:00:00Z');
    const result = formatWaktuLalu(tenDaysAgo);

    // Harus format tanggal Indonesia (contoh: "5 Januari 2024")
    expect(result).toMatch(/\d{1,2}\s+\w+\s+\d{4}/); // Format: "5 Januari 2024"
    expect(result).toContain('2024');
  });
});

