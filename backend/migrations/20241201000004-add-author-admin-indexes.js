/**
 * Migration: Add Indexes to Author and Admin Tables
 * 
 * Menambahkan indexes untuk meningkatkan performa query pada table authors dan admins.
 * 
 * @module migrations/add-author-admin-indexes
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Author indexes
    // Index untuk name (unique, sering digunakan untuk lookup)
    await queryInterface.addIndex('authors', ['name'], {
      unique: true,
      name: 'authors_name_idx',
      concurrently: true
    });

    // Admin indexes
    // Index untuk email (unique, sering digunakan untuk login lookup)
    await queryInterface.addIndex('admins', ['email'], {
      unique: true,
      name: 'admins_email_idx',
      concurrently: true
    });

    // Index untuk username (sering digunakan untuk login lookup)
    await queryInterface.addIndex('admins', ['username'], {
      name: 'admins_username_idx',
      concurrently: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes in reverse order
    await queryInterface.removeIndex('admins', 'admins_username_idx');
    await queryInterface.removeIndex('admins', 'admins_email_idx');
    await queryInterface.removeIndex('authors', 'authors_name_idx');
  }
};

