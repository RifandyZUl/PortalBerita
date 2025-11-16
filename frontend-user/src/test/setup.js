/**
 * Test Setup File
 * 
 * File ini dijalankan sebelum setiap test.
 * Digunakan untuk setup global test configuration.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia (untuk components yang menggunakan media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (untuk components yang menggunakan intersection observer)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

