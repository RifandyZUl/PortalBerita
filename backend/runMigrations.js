/**
 * Script untuk menjalankan migrations secara manual
 * Menggunakan koneksi database yang sudah ada di config/db.js
 * 
 * Usage: node runMigrations.js
 */

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Import database connection
import connectDB, { sequelize } from './src/config/db.js';

/**
 * Run migration SQL directly
 */
const runMigrationSQL = async (migrationName, sqlStatements) => {
  console.log(`\n🔄 Running migration: ${migrationName}`);

  try {
    // Check if migration already run
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'SequelizeMeta'
      );
    `);
    
    if (!results[0].exists) {
      // Create SequelizeMeta table
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
          name VARCHAR(255) NOT NULL PRIMARY KEY
        );
      `);
    }

    // Check if migration already run
    const [migrations] = await sequelize.query(`
      SELECT name FROM "SequelizeMeta" WHERE name = :name
    `, {
      replacements: { name: migrationName }
    });

    if (migrations.length > 0) {
      console.log(`⏭️  Migration ${migrationName} already run, skipping...`);
      return;
    }

    // Run SQL statements
    for (const sql of sqlStatements) {
      try {
        await sequelize.query(sql);
      } catch (error) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`  ⚠️  Index already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    // Mark as run
    await sequelize.query(`
      INSERT INTO "SequelizeMeta" (name) VALUES (:name)
      ON CONFLICT (name) DO NOTHING
    `, {
      replacements: { name: migrationName }
    });
    
    console.log(`✅ Migration ${migrationName} completed successfully`);
  } catch (error) {
    console.error(`❌ Migration ${migrationName} failed:`, error.message);
    throw error;
  }
};

/**
 * Main function
 */
const main = async () => {
  try {
    console.log('🚀 Starting migrations...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // Migration 1: News indexes
    // Note: Using actual database column names (snake_case)
    await runMigrationSQL('20241201000001-add-news-indexes.js', [
      `CREATE UNIQUE INDEX IF NOT EXISTS news_slug_idx ON news(slug);`,
      `CREATE INDEX IF NOT EXISTS news_status_idx ON news(status);`,
      `CREATE INDEX IF NOT EXISTS news_category_id_idx ON news(category_id);`,
      `CREATE INDEX IF NOT EXISTS news_author_id_idx ON news(author_id);`,
      `CREATE INDEX IF NOT EXISTS news_published_at_idx ON news(publishedat);`,
      `CREATE INDEX IF NOT EXISTS news_views_idx ON news(views);`,
      `CREATE INDEX IF NOT EXISTS news_status_published_at_idx ON news(status, publishedat);`,
      `CREATE INDEX IF NOT EXISTS news_status_views_idx ON news(status, views);`
    ]);

    // Migration 2: Comment indexes
    // Note: Using actual database column names
    await runMigrationSQL('20241201000002-add-comment-indexes.js', [
      `CREATE INDEX IF NOT EXISTS comments_news_id_idx ON comments(news_id);`,
      `CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status);`,
      `CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments("createdAt");`,
      `CREATE INDEX IF NOT EXISTS comments_news_id_status_idx ON comments(news_id, status);`
    ]);

    // Migration 3: Category indexes
    await runMigrationSQL('20241201000003-add-category-indexes.js', [
      `CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);`,
      `CREATE UNIQUE INDEX IF NOT EXISTS categories_name_idx ON categories(name);`,
      `CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);`
    ]);

    // Migration 4: Author and Admin indexes
    await runMigrationSQL('20241201000004-add-author-admin-indexes.js', [
      `CREATE UNIQUE INDEX IF NOT EXISTS authors_name_idx ON authors(name);`,
      `CREATE UNIQUE INDEX IF NOT EXISTS admins_email_idx ON admins(email);`,
      `CREATE INDEX IF NOT EXISTS admins_username_idx ON admins(username);`
    ]);

    console.log('\n✅ All migrations completed successfully!');
    console.log('\n📊 Verifying indexes...\n');

    // Verify indexes were created
    const [indexes] = await sequelize.query(`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE '%_idx'
      ORDER BY tablename, indexname;
    `);

    if (indexes.length > 0) {
      console.log(`✅ Found ${indexes.length} indexes:\n`);
      const grouped = {};
      indexes.forEach(idx => {
        if (!grouped[idx.tablename]) {
          grouped[idx.tablename] = [];
        }
        grouped[idx.tablename].push(idx.indexname);
      });
      
      Object.keys(grouped).sort().forEach(table => {
        console.log(`  📋 ${table}:`);
        grouped[table].forEach(idx => {
          console.log(`     - ${idx}`);
        });
      });
    } else {
      console.log('⚠️  No indexes found (might need to check manually)');
    }

    console.log('\n✨ Migration process completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

main();
