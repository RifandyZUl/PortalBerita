# Dokumentasi Unit Testing Frontend

## 📋 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Apa itu Unit Testing?](#apa-itu-unit-testing)
3. [Fungsi dan Tujuan](#fungsi-dan-tujuan)
4. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
5. [Struktur dan Organisasi Test](#struktur-dan-organisasi-test)
6. [Cara Menjalankan Test](#cara-menjalankan-test)
7. [Pola dan Best Practices](#pola-dan-best-practices)
8. [Contoh Test Cases](#contoh-test-cases)
9. [Mocking dan Test Utilities](#mocking-dan-test-utilities)
10. [Troubleshooting](#troubleshooting)
11. [Coverage dan Metrics](#coverage-dan-metrics)

---

## 📖 Pengenalan

Dokumentasi ini menjelaskan sistem unit testing yang digunakan dalam aplikasi frontend Portal Berita. Unit testing adalah praktik pengujian perangkat lunak di mana komponen individual (unit) dari aplikasi diuji secara terpisah untuk memastikan mereka berfungsi dengan benar.

---

## 🎯 Apa itu Unit Testing?

**Unit Testing** adalah metode pengujian perangkat lunak di mana unit terkecil dari kode (biasanya fungsi atau komponen) diuji secara terpisah dan independen untuk memverifikasi bahwa mereka berfungsi sesuai dengan yang diharapkan.

### Karakteristik Unit Testing:

- **Isolated (Terisolasi)**: Setiap test berjalan secara independen tanpa bergantung pada test lain
- **Fast (Cepat)**: Test harus berjalan dengan cepat untuk memberikan feedback yang cepat
- **Repeatable (Dapat Diulang)**: Test harus memberikan hasil yang sama setiap kali dijalankan
- **Deterministic (Deterministik)**: Test tidak boleh flaky atau tidak konsisten
- **Self-Validating (Validasi Sendiri)**: Test harus dapat menentukan sendiri apakah berhasil atau gagal

---

## 🎯 Fungsi dan Tujuan

### Fungsi Unit Testing:

1. **Validasi Fungsionalitas**
   - Memastikan setiap komponen berfungsi sesuai spesifikasi
   - Memverifikasi bahwa fungsi-fungsi bekerja dengan benar

2. **Deteksi Bug Dini**
   - Menemukan bug sebelum kode masuk ke production
   - Mengurangi biaya perbaikan bug di kemudian hari

3. **Dokumentasi Kode**
   - Test berfungsi sebagai dokumentasi hidup tentang bagaimana kode seharusnya digunakan
   - Membantu developer baru memahami kode

4. **Refactoring Safety**
   - Memberikan kepercayaan untuk melakukan refactoring
   - Memastikan perubahan tidak merusak fungsionalitas yang ada

5. **Regression Prevention**
   - Mencegah bug yang sudah diperbaiki muncul kembali
   - Memastikan fitur yang sudah bekerja tetap berfungsi

### Tujuan Unit Testing di Proyek Ini:

- ✅ **Memastikan Kualitas Kode**: Setiap komponen admin (ManageNews, ManageComments, ManageCategories, Settings, dll) berfungsi dengan benar
- ✅ **Mengurangi Bug**: Menangkap error sebelum deployment
- ✅ **Meningkatkan Kepercayaan**: Developer dapat melakukan perubahan dengan percaya diri
- ✅ **Mempercepat Development**: Feedback cepat membantu development yang lebih efisien
- ✅ **Meningkatkan Maintainability**: Kode yang teruji lebih mudah dirawat

---

## 🛠 Teknologi yang Digunakan

### 1. **Vitest** (Test Runner)
- Framework testing modern yang cepat dan kompatibel dengan Vite
- Mendukung ES modules dan TypeScript out of the box
- Konfigurasi: `vitest.config.js`

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
```

### 2. **React Testing Library** (Testing Utilities)
- Library untuk testing komponen React
- Fokus pada testing dari perspektif user
- Query methods: `getBy`, `findBy`, `queryBy`

### 3. **@testing-library/user-event** (User Interaction)
- Simulasi interaksi user yang realistis
- Mendukung click, type, select, dll

### 4. **jsdom** (DOM Environment)
- Simulasi browser environment di Node.js
- Memungkinkan testing komponen React tanpa browser

### 5. **@testing-library/jest-dom** (Custom Matchers)
- Matchers tambahan untuk assertions
- Contoh: `toBeInTheDocument()`, `toHaveClass()`, dll

---

## 📁 Struktur dan Organisasi Test

### Struktur Direktori:

```
frontend/
├── src/
│   ├── pages/
│   │   └── admin/
│   │       ├── ManageComments.jsx
│   │       ├── ManageNews.jsx
│   │       ├── ManageCategories.jsx
│   │       ├── settings.jsx
│   │       ├── dashboard.jsx
│   │       ├── login.jsx
│   │       └── __tests__/          # Test files
│   │           ├── ManageComments.test.jsx
│   │           ├── ManageNews.test.jsx
│   │           ├── ManageCategories.test.jsx
│   │           ├── settings.test.jsx
│   │           ├── dashboard.test.jsx
│   │           └── login.test.jsx
│   ├── components/
│   │   └── __tests__/              # Component tests
│   │       ├── LoadingSpinner.test.jsx
│   │       ├── ModalConfirm.test.jsx
│   │       └── ...
│   └── test/                       # Test utilities
│       ├── setup.js                 # Test setup configuration
│       ├── factories.js             # Mock data factories
│       └── helpers.js               # Test helper functions
├── vitest.config.js                 # Vitest configuration
└── package.json
```

### Konvensi Penamaan:

- **Test Files**: `*.test.jsx` atau `*.spec.jsx`
- **Test Directory**: `__tests__/` (co-located dengan source files)
- **Test Functions**: `describe()` untuk grouping, `it()` untuk test cases

---

## 🚀 Cara Menjalankan Test

### 1. Menjalankan Semua Test

```bash
npm test
```

Atau dengan flag `--run` untuk non-watch mode:

```bash
npm test -- --run
```

### 2. Menjalankan Test dalam Watch Mode

```bash
npm run test:watch
```

Test akan otomatis re-run ketika file diubah.

### 3. Menjalankan Test dengan UI

```bash
npm run test:ui
```

Membuka Vitest UI di browser untuk visualisasi test results.

### 4. Menjalankan Test File Spesifik

```bash
npm test -- ManageComments.test.jsx
```

### 5. Menjalankan Test dengan Pattern

```bash
npm test -- --grep "should display"
```

### 6. Menjalankan Test dengan Coverage

```bash
npm test -- --coverage
```

### Output Test:

```
✓ src/pages/admin/__tests__/ManageComments.test.jsx (7)
  ✓ ManageComments Page (7)
    ✓ Loading States (1)
      ✓ should display loading spinner when data is being fetched
    ✓ Data Display (2)
      ✓ should display comments after data is loaded
      ✓ should display empty state when no comments exist
    ✓ Error Handling (2)
      ✓ should display error toast when fetch fails
      ✓ should handle network timeout gracefully
    ✓ Filtering (2)
      ✓ should filter comments by status
      ✓ should filter comments by search term

Test Files  1 passed (1)
     Tests  7 passed (7)
```

---

## 📐 Pola dan Best Practices

### 1. Struktur Test File

Setiap test file mengikuti pola berikut:

```javascript
// 1. Imports
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 2. Mock Setup (SEBELUM import component)
const mockApiGet = vi.fn();
const mockApiDelete = vi.fn();

vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    delete: (...args) => mockApiDelete(...args),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// 3. Import Component (SETELAH mocks)
import ManageComments from '../ManageComments';

// 4. Mock Components
vi.mock('@/components/comments/CommentCard', () => ({
  default: ({ comment }) => (
    <div data-testid={`comment-${comment.commentId}`}>
      {comment.content}
    </div>
  ),
}));

// 5. Test Suite
describe('ManageComments Page', () => {
  beforeEach(() => {
    // Setup sebelum setiap test
    mockApiGet.mockReset();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    // Cleanup setelah setiap test
    cleanup();
  });

  describe('Loading States', () => {
    it('should display loading spinner when data is being fetched', () => {
      // Test implementation
    });
  });
});
```

### 2. Best Practices

#### ✅ DO (Lakukan):

1. **Mock Dependencies Sebelum Import**
   ```javascript
   // ✅ BENAR: Mock sebelum import
   vi.mock('../../utils/api', () => ({ ... }));
   import Component from '../Component';
   ```

2. **Gunakan Test Factories**
   ```javascript
   // ✅ BENAR: Gunakan factory untuk mock data
   const mockComment = createMockComment({ 
     commentId: 1, 
     content: 'Test comment' 
   });
   ```

3. **Gunakan Descriptive Test Names**
   ```javascript
   // ✅ BENAR: Nama test yang jelas
   it('should display error toast when fetch fails', () => { ... });
   ```

4. **Cleanup Setelah Test**
   ```javascript
   // ✅ BENAR: Cleanup di afterEach
   afterEach(() => {
     cleanup();
   });
   ```

5. **Gunakan waitFor untuk Async Operations**
   ```javascript
   // ✅ BENAR: Wait untuk async operations
   await waitFor(() => {
     expect(screen.getByText('Data')).toBeInTheDocument();
   });
   ```

6. **Gunakan findBy* untuk Elements yang Muncul Secara Async**
   ```javascript
   // ✅ BENAR: findBy* otomatis wait
   const element = await screen.findByTestId('comment-1');
   ```

7. **Group Related Tests dengan describe**
   ```javascript
   // ✅ BENAR: Grouping yang jelas
   describe('Data Display', () => {
     it('should display data', () => { ... });
     it('should display empty state', () => { ... });
   });
   ```

#### ❌ DON'T (Jangan Lakukan):

1. **Jangan Import Component Sebelum Mock**
   ```javascript
   // ❌ SALAH: Import sebelum mock
   import Component from '../Component';
   vi.mock('../../utils/api', () => ({ ... }));
   ```

2. **Jangan Hardcode Mock Data**
   ```javascript
   // ❌ SALAH: Hardcode data
   const mockData = {
     id: 1,
     name: 'Test',
     // ... banyak properties
   };
   
   // ✅ BENAR: Gunakan factory
   const mockData = createMockComment({ name: 'Test' });
   ```

3. **Jangan Test Implementation Details**
   ```javascript
   // ❌ SALAH: Test implementation detail
   expect(component.state.loading).toBe(true);
   
   // ✅ BENAR: Test behavior
   expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
   ```

4. **Jangan Membuat Test yang Bergantung pada Test Lain**
   ```javascript
   // ❌ SALAH: Test bergantung pada test lain
   it('test 1', () => { global.data = 'test'; });
   it('test 2', () => { expect(global.data).toBe('test'); });
   ```

5. **Jangan Lupa Cleanup**
   ```javascript
   // ❌ SALAH: Tidak ada cleanup
   it('test', () => {
     render(<Component />);
     // Test ends, component masih mounted
   });
   ```

---

## 📝 Contoh Test Cases

### 1. Test Loading State

```javascript
describe('Loading States', () => {
  it('should display loading spinner when data is being fetched', () => {
    // Mock API yang tidak pernah resolve (loading state)
    mockApiGet.mockImplementation(() => new Promise(() => {}));
    
    render(<ManageComments />);
    
    // Verify loading spinner muncul
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 2. Test Data Display

```javascript
describe('Data Display', () => {
  it('should display comments after data is loaded', async () => {
    const mockComment = createMockComment({ 
      commentId: 1, 
      content: 'Test comment' 
    });

    mockApiGet.mockResolvedValueOnce({
      data: {
        data: {
          comments: [mockComment],
        },
      },
    });

    render(<ManageComments />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Verify data displayed
    const commentElement = await screen.findByTestId('comment-1');
    expect(commentElement).toBeInTheDocument();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });
});
```

### 3. Test Empty State

```javascript
describe('Data Display', () => {
  it('should display empty state when no comments exist', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: {
        data: {
          comments: [],
        },
      },
    });

    render(<ManageComments />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Verify empty state message
    expect(screen.getByText('Tidak ada komentar yang cocok.')).toBeInTheDocument();
  });
});
```

### 4. Test Error Handling

```javascript
describe('Error Handling', () => {
  it('should display error toast when fetch fails', async () => {
    mockApiGet.mockRejectedValue(new Error('Network error'));

    render(<ManageComments />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat komentar.');
    });
  });

  it('should handle network timeout gracefully', async () => {
    mockApiGet.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 100)
      )
    );

    render(<ManageComments />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
```

### 5. Test User Interactions

```javascript
describe('Filtering', () => {
  it('should filter comments by status', async () => {
    const user = userEvent.setup();
    const mockComments = [
      createMockComment({ commentId: 1, status: 'Approved' }),
      createMockComment({ commentId: 2, status: 'Pending' }),
    ];

    mockApiGet.mockResolvedValueOnce({
      data: {
        data: {
          comments: mockComments,
        },
      },
    });

    render(<ManageComments />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Filter by Approved status
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'Approved');

    // Verify filtering works
    await waitFor(() => {
      expect(screen.getByTestId('comment-1')).toBeInTheDocument();
      expect(screen.queryByTestId('comment-2')).not.toBeInTheDocument();
    });
  });
});
```

### 6. Test Form Input

```javascript
describe('User Input', () => {
  it('should update input fields when user types', async () => {
    const user = userEvent.setup();
    
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Simulate user typing
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Verify input values
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
```

---

## 🎭 Mocking dan Test Utilities

### 1. Mock API Calls

```javascript
// Mock axios dan api utils
const mockApiGet = vi.fn();
const mockApiDelete = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: (...args) => mockApiGet(...args),
      delete: (...args) => mockApiDelete(...args),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    delete: (...args) => mockApiDelete(...args),
  },
}));
```

### 2. Mock Components

```javascript
// Mock child components
vi.mock('@/components/comments/CommentCard', () => ({
  default: ({ comment }) => (
    <div data-testid={`comment-${comment.commentId}`}>
      {comment.content}
    </div>
  ),
}));

vi.mock('@/components/ModalConfirm', () => ({
  default: ({ isOpen, onConfirm, onCancel }) =>
    isOpen ? (
      <div data-testid="modal-confirm">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));
```

### 3. Mock Third-Party Libraries

```javascript
// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
```

### 4. Test Factories

File `src/test/factories.js` berisi factory functions untuk membuat mock data:

```javascript
// Contoh factory function
export const createMockComment = (overrides = {}) => ({
  commentId: 1,
  name: 'John Doe',
  email: 'john@example.com',
  content: 'Test comment',
  status: 'Approved',
  news: { title: 'Test Article' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Penggunaan
const mockComment = createMockComment({ 
  commentId: 1, 
  content: 'Custom content' 
});
```

### 5. Test Setup File

File `src/test/setup.js` berisi konfigurasi global untuk test:

```javascript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup setelah setiap test
afterEach(() => {
  cleanup();
});
```

---

## 🔧 Troubleshooting

### 1. Error: "Unable to find an element"

**Masalah**: Test tidak dapat menemukan elemen di DOM.

**Solusi**:
- Gunakan `findBy*` untuk elemen yang muncul secara async
- Tambahkan `waitFor` untuk menunggu elemen muncul
- Periksa apakah mock sudah benar

```javascript
// ❌ SALAH
expect(screen.getByTestId('comment-1')).toBeInTheDocument();

// ✅ BENAR
const element = await screen.findByTestId('comment-1', { timeout: 5000 });
expect(element).toBeInTheDocument();
```

### 2. Error: "Network Error" atau "AxiosError"

**Masalah**: Test mencoba melakukan real HTTP request.

**Solusi**:
- Pastikan mock API sudah di-setup sebelum import component
- Mock axios dan api utils dengan benar

```javascript
// ✅ Pastikan mock sebelum import
vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
  },
}));

import Component from '../Component'; // Import SETELAH mock
```

### 3. Error: "TestingLibraryElementError: Found multiple elements"

**Masalah**: Query menemukan multiple elements.

**Solusi**:
- Gunakan query yang lebih spesifik
- Gunakan `getAllBy*` jika memang ada multiple elements
- Gunakan `queryBy*` untuk optional elements

```javascript
// ❌ SALAH: Multiple elements found
expect(screen.getByText('Technology')).toBeInTheDocument();

// ✅ BENAR: Lebih spesifik
const elements = screen.getAllByText('Technology');
expect(elements.length).toBeGreaterThan(0);

// Atau gunakan selector yang lebih spesifik
expect(screen.getByText('technology')).toBeInTheDocument(); // slug yang unik
```

### 4. Test Flaky (Kadang Pass, Kadang Fail)

**Masalah**: Test tidak konsisten.

**Solusi**:
- Pastikan menggunakan `waitFor` untuk async operations
- Tambahkan timeout yang cukup
- Pastikan cleanup dilakukan dengan benar

```javascript
// ✅ Gunakan waitFor dengan timeout
await waitFor(() => {
  expect(screen.getByText('Data')).toBeInTheDocument();
}, { timeout: 5000 });
```

### 5. Mock Tidak Bekerja

**Masalah**: Mock tidak ter-apply.

**Solusi**:
- Pastikan mock didefinisikan sebelum import component
- Gunakan `vi.mock()` di top level, bukan di dalam test
- Reset mock di `beforeEach` jika perlu

```javascript
// ✅ Mock di top level
vi.mock('../../utils/api', () => ({ ... }));

// Import setelah mock
import Component from '../Component';

describe('Test', () => {
  beforeEach(() => {
    mockApiGet.mockReset(); // Reset jika perlu
  });
});
```

---

## 📊 Coverage dan Metrics

### Menjalankan Coverage Report

```bash
npm test -- --coverage
```

### Coverage Thresholds

Dari `vitest.config.js`:

```javascript
coverage: {
  thresholds: {
    lines: 80,        // Minimal 80% line coverage
    functions: 80,    // Minimal 80% function coverage
    branches: 75,     // Minimal 75% branch coverage
    statements: 80,   // Minimal 80% statement coverage
  },
}
```

### Coverage Report

Coverage report akan menampilkan:
- **Lines**: Persentase baris kode yang di-test
- **Functions**: Persentase fungsi yang di-test
- **Branches**: Persentase branch (if/else) yang di-test
- **Statements**: Persentase statement yang di-test

### Current Test Coverage

Berdasarkan test yang ada, coverage mencakup:

- ✅ **Loading States**: Semua komponen
- ✅ **Data Display**: Success dan empty states
- ✅ **Error Handling**: Network errors dan timeouts
- ✅ **User Interactions**: Filtering, form input
- ✅ **Form Display**: Semua form components

---

## 📚 Referensi dan Sumber Belajar

### Dokumentasi Resmi:

1. **Vitest**: https://vitest.dev/
2. **React Testing Library**: https://testing-library.com/react
3. **Testing Library User Event**: https://testing-library.com/docs/user-event/intro
4. **Jest DOM Matchers**: https://github.com/testing-library/jest-dom

### Best Practices:

1. **Testing Library Philosophy**: https://testing-library.com/docs/guiding-principles
2. **Common Mistakes**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
3. **Test Organization**: https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests

---

## ✅ Checklist untuk Test Baru

Saat menulis test baru, pastikan:

- [ ] Mock semua dependencies sebelum import component
- [ ] Gunakan test factories untuk mock data
- [ ] Test loading states
- [ ] Test success states (data display)
- [ ] Test empty states
- [ ] Test error handling
- [ ] Test user interactions (jika ada)
- [ ] Cleanup di afterEach
- [ ] Nama test yang deskriptif
- [ ] Group related tests dengan describe
- [ ] Gunakan waitFor untuk async operations
- [ ] Gunakan findBy* untuk elements yang muncul async

---

## 🎓 Kesimpulan

Unit testing di proyek ini menggunakan:

- ✅ **Vitest** sebagai test runner
- ✅ **React Testing Library** untuk testing komponen
- ✅ **Test Factories** untuk mock data yang konsisten
- ✅ **Best Practices** yang diikuti dengan baik
- ✅ **Coverage** yang komprehensif untuk semua halaman admin

Dengan 65 test cases yang semua pass, sistem testing ini memberikan:

- 🛡️ **Perlindungan** terhadap regressions
- 🚀 **Kecepatan** development yang lebih baik
- 📝 **Dokumentasi** kode yang hidup
- 🔍 **Deteksi bug** yang lebih dini
- 💪 **Kepercayaan** untuk melakukan refactoring

---

**Dokumentasi ini dibuat untuk membantu developer memahami dan menggunakan sistem unit testing di proyek Portal Berita.**

*Last Updated: 2024*

