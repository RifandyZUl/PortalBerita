import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { getToken } from '../../../utils/token';

// Mock token utils
vi.mock('../../../utils/token', () => ({
  getToken: vi.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('✅ Harus render children jika token ada', () => {
    getToken.mockReturnValue('valid-token');
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('✅ Harus redirect ke "/" jika token tidak ada', () => {
    getToken.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    // Protected content should not be visible when redirecting
    // Navigate component will redirect, so content should not render
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('✅ Harus redirect jika token adalah empty string', () => {
    getToken.mockReturnValue('');
    
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    // Protected content should not be visible when redirecting
    // Navigate component will redirect, so content should not render
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

