/**
 * Test Data Factories
 * 
 * Factory functions untuk membuat mock data yang konsisten
 * dan mudah digunakan dalam test files.
 */

/**
 * Creates a mock comment object
 * @param {Object} overrides - Properties to override default values
 * @returns {Object} Mock comment object
 */
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

/**
 * Creates an array of mock comments
 * @param {number} count - Number of comments to create
 * @param {Object} baseOverrides - Base overrides for all comments
 * @returns {Array} Array of mock comment objects
 */
export const createMockComments = (count = 1, baseOverrides = {}) => 
  Array.from({ length: count }, (_, i) => 
    createMockComment({ 
      commentId: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      content: `Comment ${i + 1}`,
      ...baseOverrides,
    })
  );

/**
 * Creates a mock category object
 * @param {Object} overrides - Properties to override default values
 * @returns {Object} Mock category object
 */
export const createMockCategory = (overrides = {}) => ({
  categoryId: 1,
  name: 'Technology',
  slug: 'technology',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Creates an array of mock categories
 * @param {number} count - Number of categories to create
 * @param {Object} baseOverrides - Base overrides for all categories
 * @returns {Array} Array of mock category objects
 */
export const createMockCategories = (count = 1, baseOverrides = {}) => 
  Array.from({ length: count }, (_, i) => 
    createMockCategory({ 
      categoryId: i + 1,
      name: `Category ${i + 1}`,
      slug: `category-${i + 1}`,
      ...baseOverrides,
    })
  );

/**
 * Creates a mock admin/user object
 * @param {Object} overrides - Properties to override default values
 * @returns {Object} Mock admin object
 */
export const createMockAdmin = (overrides = {}) => ({
  adminId: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  photo: 'https://example.com/photo.jpg',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Creates a mock article/news object
 * @param {Object} overrides - Properties to override default values
 * @returns {Object} Mock article object
 */
export const createMockArticle = (overrides = {}) => ({
  newsId: 1,
  title: 'Test Article',
  content: 'Test content',
  excerpt: 'Test excerpt',
  status: 'published',
  publishedAt: new Date().toISOString(),
  Category: { name: 'Tech', slug: 'tech' },
  Author: { name: 'John Doe', email: 'john@example.com' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Creates an array of mock articles
 * @param {number} count - Number of articles to create
 * @param {Object} baseOverrides - Base overrides for all articles
 * @returns {Array} Array of mock article objects
 */
export const createMockArticles = (count = 1, baseOverrides = {}) => 
  Array.from({ length: count }, (_, i) => 
    createMockArticle({ 
      newsId: i + 1,
      title: `Article ${i + 1}`,
      content: `Content ${i + 1}`,
      ...baseOverrides,
    })
  );

/**
 * Creates a mock pagination object
 * @param {Object} overrides - Properties to override default values
 * @returns {Object} Mock pagination object
 */
export const createMockPagination = (overrides = {}) => ({
  totalPages: 1,
  totalItems: 1,
  currentPage: 1,
  perPage: 10,
  ...overrides,
});

/**
 * Creates a mock API response for comments
 * @param {Array} comments - Array of comments
 * @param {Object} pagination - Pagination object
 * @returns {Object} Mock API response
 */
export const createMockCommentsResponse = (comments = [], pagination = {}) => ({
  data: {
    data: {
      comments: comments.length > 0 ? comments : createMockComments(1),
      pagination: createMockPagination(pagination),
    },
  },
});

/**
 * Creates a mock API response for categories
 * @param {Array} categories - Array of categories
 * @param {Object} pagination - Pagination object
 * @returns {Object} Mock API response
 */
export const createMockCategoriesResponse = (categories = [], pagination = {}) => ({
  data: {
    data: {
      data: categories.length > 0 ? categories : createMockCategories(1),
      totalPages: pagination.totalPages || 1,
    },
  },
});

/**
 * Creates a mock API response for articles
 * @param {Array} articles - Array of articles
 * @param {Object} pagination - Pagination object
 * @returns {Object} Mock API response
 */
export const createMockArticlesResponse = (articles = [], pagination = {}) => ({
  data: {
    data: {
      articles: articles.length > 0 ? articles : createMockArticles(1),
      total: pagination.totalItems || articles.length || 1,
    },
  },
});

/**
 * Creates a mock API response for admin profile
 * @param {Object} admin - Admin object
 * @returns {Object} Mock API response
 */
export const createMockAdminResponse = (admin = {}) => ({
  data: {
    success: true,
    message: 'Data admin saat ini',
    data: {
      admin: createMockAdmin(admin),
    },
  },
});

