/**
 * Migration: Add Indexes to Category Table
 * 
 * Menambahkan indexes untuk meningkatkan performa query pada table categories.
 * Indexes ini akan mempercepat:
 * - Lookup by slug
 * - Lookup by name
 * - Filter by parentId
 * 
 * @module migrations/add-category-indexes
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Index untuk slug (unique, sering digunakan untuk lookup)
    // Note: Jika sudah ada unique constraint, index sudah otomatis dibuat
    // Tapi kita tetap definisikan untuk clarity
    await queryInterface.addIndex('categories', ['slug'], {
      unique: true,
      name: 'categories_slug_idx',
      concurrently: true
    });

    // Index untuk name (unique, sering digunakan untuk lookup)
    await queryInterface.addIndex('categories', ['name'], {
      unique: true,
      name: 'categories_name_idx',
      concurrently: true
    });

    // Index untuk parentId (foreign key, sering digunakan untuk filter)
    await queryInterface.addIndex('categories', ['parentId'], {
      name: 'categories_parent_id_idx',
      concurrently: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes in reverse order
    await queryInterface.removeIndex('categories', 'categories_parent_id_idx');
    await queryInterface.removeIndex('categories', 'categories_name_idx');
    await queryInterface.removeIndex('categories', 'categories_slug_idx');
  }
};

