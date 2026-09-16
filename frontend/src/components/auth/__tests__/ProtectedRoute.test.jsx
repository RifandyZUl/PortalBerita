import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

  describe('Access Control', () => {
    it('should render children when token exists', () => {
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

    it('should redirect to "/" when token does not exist', () => {
      getToken.mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect when token is empty string', () => {
      getToken.mockReturnValue('');
      
      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );
      
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
