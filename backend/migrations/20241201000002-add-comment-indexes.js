/**
 * Migration: Add Indexes to Comment Table
 * 
 * Menambahkan indexes untuk meningkatkan performa query pada table comments.
 * Indexes ini akan mempercepat:
 * - Filter by newsId
 * - Filter by status
 * - Sorting by createdAt
 * - Composite queries (newsId + status)
 * 
 * @module migrations/add-comment-indexes
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Index untuk newsId (foreign key, sering digunakan untuk filter)
    await queryInterface.addIndex('comments', ['newsId'], {
      name: 'comments_news_id_idx',
      concurrently: true
    });

    // Index untuk status (sering digunakan untuk filter)
    await queryInterface.addIndex('comments', ['status'], {
      name: 'comments_status_idx',
      concurrently: true
    });

    // Index untuk createdAt (sering digunakan untuk sorting)
    await queryInterface.addIndex('comments', ['createdAt'], {
      name: 'comments_created_at_idx',
      concurrently: true
    });

    // Composite index untuk newsId + status (sering digunakan bersama)
    await queryInterface.addIndex('comments', ['newsId', 'status'], {
      name: 'comments_news_id_status_idx',
      concurrently: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes in reverse order
    await queryInterface.removeIndex('comments', 'comments_news_id_status_idx');
    await queryInterface.removeIndex('comments', 'comments_created_at_idx');
    await queryInterface.removeIndex('comments', 'comments_status_idx');
    await queryInterface.removeIndex('comments', 'comments_news_id_idx');
  }
};

