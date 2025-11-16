/**
 * Test Helpers
 * Helper functions untuk testing
 */

import { vi } from 'vitest';

/**
 * Mock axios dengan default responses
 */
export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

/**
 * Setup default mocks untuk axios
 */
export const setupAxiosMocks = () => {
  mockAxios.get.mockResolvedValue({ data: { data: [] } });
  mockAxios.post.mockResolvedValue({ data: { success: true } });
  mockAxios.put.mockResolvedValue({ data: { success: true } });
  mockAxios.patch.mockResolvedValue({ data: { success: true } });
  mockAxios.delete.mockResolvedValue({ data: { success: true } });
};

/**
 * Mock untuk NewsForm dengan default props
 */
export const mockNewsForm = vi.fn(({ selectedArticle, setSelectedArticle, setArticles, onSuccess }) => {
  return (
    <div data-testid="news-form">
      <div>News Form</div>
      {selectedArticle && <div data-testid="selected-article">{selectedArticle.title}</div>}
    </div>
  );
});

/**
 * Mock untuk CategoryForm dengan default props
 */
export const mockCategoryForm = vi.fn(({ onSubmit, defaultValues, onCancel, allCategories, loading }) => {
  return (
    <div data-testid="category-form">
      <div>Category Form</div>
      {defaultValues?.name && <div data-testid="default-category">{defaultValues.name}</div>}
    </div>
  );
});

