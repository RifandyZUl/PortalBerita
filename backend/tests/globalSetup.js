import db from '../models/index.js';
const { sequelize } = db;

/**
 * GLOBAL SETUP - Dijalankan sekali sebelum semua test files
 * 
 * Tujuan: Menyiapkan database dalam kondisi bersih untuk testing.
 * 
 * CATATAN:
 * - globalSetup di Vitest dijalankan sekali sebelum semua test
 * - Ini berbeda dengan setupFiles yang dijalankan sebelum setiap test file
 */

export async function setup() {
  try {
    console.log('🔄 Setting up database for testing...');
    
    // Bersihkan semua objek database sebelum sync
    await sequelize.query(`
      DO $$ 
      DECLARE 
        r RECORD;
      BEGIN
        -- Drop semua tabel dengan CASCADE untuk menghindari foreign key constraints
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
        LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;';
        END LOOP;
        
        -- Drop semua sequences
        FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') 
        LOOP
          EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE;';
        END LOOP;
        
        -- Drop semua enum types
        FOR r IN (
          SELECT typname 
          FROM pg_type 
          WHERE typtype = 'e' 
          AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        )
        LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE;';
        END LOOP;
      END $$;
    `);
    
    await sequelize.sync({ force: true });

    console.log('✅ Database synced for testing');
  } catch (err) {
    console.error('❌ Failed to sync DB:', err);
    throw err; // Re-throw agar test gagal jika setup gagal
  }
}

export async function teardown() {
  try {
    console.log('🔄 Closing database connection...');
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (err) {
    console.error('❌ Failed to close DB:', err);
  }
}

