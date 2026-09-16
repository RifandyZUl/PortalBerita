/**
 * Migration: Add Indexes to News Table
 * 
 * Menambahkan indexes untuk meningkatkan performa query pada table news.
 * Indexes ini akan mempercepat:
 * - Lookup by slug
 * - Filter by status
 * - Filter by categoryId, authorId
 * - Sorting by publishedAt, views
 * - Composite queries (status + publishedAt, status + views)
 * 
 * @module migrations/add-news-indexes
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Index untuk slug (unique, sering digunakan untuk lookup)
    await queryInterface.addIndex('news', ['slug'], {
      unique: true,
      name: 'news_slug_idx',
      concurrently: true
    });

    // Index untuk status (sering digunakan untuk filter)
    await queryInterface.addIndex('news', ['status'], {
      name: 'news_status_idx',
      concurrently: true
    });

    // Index untuk categoryId (foreign key, sering digunakan untuk filter)
    await queryInterface.addIndex('news', ['categoryId'], {
      name: 'news_category_id_idx',
      concurrently: true
    });

    // Index untuk authorId (foreign key)
    await queryInterface.addIndex('news', ['authorId'], {
      name: 'news_author_id_idx',
      concurrently: true
    });

    // Index untuk publishedAt (sering digunakan untuk sorting)
    await queryInterface.addIndex('news', ['publishedAt'], {
      name: 'news_published_at_idx',
      concurrently: true
    });

    // Index untuk views (sering digunakan untuk sorting popular news)
    await queryInterface.addIndex('news', ['views'], {
      name: 'news_views_idx',
      concurrently: true
    });

    // Composite index untuk status + publishedAt (sering digunakan bersama)
    await queryInterface.addIndex('news', ['status', 'publishedAt'], {
      name: 'news_status_published_at_idx',
      concurrently: true
    });

    // Composite index untuk status + views (popular published news)
    await queryInterface.addIndex('news', ['status', 'views'], {
      name: 'news_status_views_idx',
      concurrently: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes in reverse order
    await queryInterface.removeIndex('news', 'news_status_views_idx');
    await queryInterface.removeIndex('news', 'news_status_published_at_idx');
    await queryInterface.removeIndex('news', 'news_views_idx');
    await queryInterface.removeIndex('news', 'news_published_at_idx');
    await queryInterface.removeIndex('news', 'news_author_id_idx');
    await queryInterface.removeIndex('news', 'news_category_id_idx');
    await queryInterface.removeIndex('news', 'news_status_idx');
    await queryInterface.removeIndex('news', 'news_slug_idx');
  }
};

