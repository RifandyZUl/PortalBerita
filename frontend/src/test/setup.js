/**
 * Test Setup File
 * 
 * File ini dijalankan sebelum setiap test.
 * Digunakan untuk setup global test configuration.
 */

import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock window.matchMedia (untuk components yang menggunakan media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock localStorage dengan implementasi yang sebenarnya
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Cleanup setelah setiap test untuk menghindari test pollution
afterEach(async () => {
  // Clear semua mocks
  vi.clearAllMocks();
  
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  
  // Clear sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // Clear DOM - ini akan dilakukan oleh cleanup() di setiap test file
});

