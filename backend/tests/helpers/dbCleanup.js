import db from '../../models/index.js';
const { sequelize, Admin, Author, Category, News, Comment } = db;

// Lock mechanism untuk memastikan hanya satu cleanup yang berjalan pada satu waktu
let cleanupLock = false;
let cleanupPromise = null;

/**
 * Helper function untuk membersihkan database sebelum test
 * 
 * Fungsi ini akan:
 * 1. Drop semua tabel dengan CASCADE
 * 2. Drop semua sequences
 * 3. Drop semua enum types
 * 4. Sync database dengan force: true
 * 
 * CATATAN:
 * - Gunakan ini di beforeAll setiap test file
 * - Pastikan dipanggil sebelum membuat data test
 * - Fungsi ini akan menunggu sedikit setelah cleanup untuk memastikan database benar-benar bersih
 * - Menggunakan lock mechanism untuk menghindari race condition saat multiple test files berjalan
 */
export async function cleanupDatabase() {
  // Jika ada cleanup yang sedang berjalan, tunggu sampai selesai
  if (cleanupLock && cleanupPromise) {
    await cleanupPromise;
    return;
  }
  
  // Set lock dan buat promise
  cleanupLock = true;
  cleanupPromise = (async () => {
  try {
    // Step 1: Gunakan sequelize.drop() untuk drop semua tabel yang terdaftar
    // Ini akan otomatis handle dependencies dan sequences
    try {
      await sequelize.drop();
    } catch (dropErr) {
      // Jika drop gagal (misalnya tabel belum ada), lanjutkan saja
      // Tapi kita tetap perlu cleanup manual untuk memastikan
    }
    
    // Step 2: Bersihkan sisa-sisa yang mungkin tertinggal dengan query manual
    try {
      await sequelize.query(`
        DO $$ 
        DECLARE 
          r RECORD;
        BEGIN
          -- Drop semua tabel yang mungkin tertinggal
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
          LOOP
            BEGIN
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;';
            EXCEPTION WHEN OTHERS THEN
              NULL;
            END;
          END LOOP;
          
          -- Drop semua sequences yang mungkin tertinggal
          FOR r IN (
            SELECT c.relname AS sequence_name
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE c.relkind = 'S' AND n.nspname = 'public'
          )
          LOOP
            BEGIN
              EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE;';
            EXCEPTION WHEN OTHERS THEN
              NULL;
            END;
          END LOOP;
          
          -- Drop semua enum types
          FOR r IN (
            SELECT typname FROM pg_type 
            WHERE typtype = 'e' 
            AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
          )
          LOOP
            BEGIN
              EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE;';
            EXCEPTION WHEN OTHERS THEN
              NULL;
            END;
          END LOOP;
        END $$;
      `);
    } catch (cleanupErr) {
      // Ignore errors
    }
    
    // Step 3: Tunggu sebentar untuk memastikan semua operasi selesai
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Step 4: Sync database dengan force: true
    // Gunakan sequelize.sync untuk membuat semua tabel sekaligus
    await sequelize.sync({ force: true });
    
    // Step 6: Verifikasi bahwa tabel benar-benar dibuat
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const [results] = await sequelize.query(`
      SELECT 
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins')) AS admins_exists,
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'authors')) AS authors_exists,
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories')) AS categories_exists,
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news')) AS news_exists,
        (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments')) AS comments_exists;
    `);
    
    const tableCheck = results[0];
    const allTablesExist = tableCheck.admins_exists && 
                          tableCheck.authors_exists && 
                          tableCheck.categories_exists && 
                          tableCheck.news_exists && 
                          tableCheck.comments_exists;
    
    if (!allTablesExist) {
      // Jika ada tabel yang belum dibuat, coba sync lagi
      console.log('⚠️ Some tables missing, retrying sync...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        await Admin.sync({ force: true });
        await Author.sync({ force: true });
        await Category.sync({ force: true });
        await News.sync({ force: true });
        await Comment.sync({ force: true });
      } catch (retrySyncErr) {
        await sequelize.sync({ force: true });
      }
      
      // Verifikasi lagi
      await new Promise(resolve => setTimeout(resolve, 200));
      const [retryResults] = await sequelize.query(`
        SELECT 
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins')) AS admins_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'authors')) AS authors_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories')) AS categories_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news')) AS news_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments')) AS comments_exists;
      `);
      
      const retryCheck = retryResults[0];
      const retryAllTablesExist = retryCheck.admins_exists && 
                                  retryCheck.authors_exists && 
                                  retryCheck.categories_exists && 
                                  retryCheck.news_exists && 
                                  retryCheck.comments_exists;
      
      if (!retryAllTablesExist) {
        throw new Error('Failed to create all tables after retry. Tables status: ' + JSON.stringify(retryCheck));
      }
    }
    
    // Step 5: Tunggu lagi untuk memastikan semua operasi benar-benar selesai
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (err) {
    console.error('❌ Failed to cleanup database:', err.message);
    console.error('Stack:', err.stack);
    throw err; // Re-throw agar test gagal dengan jelas
  } finally {
    // Release lock setelah selesai
    cleanupLock = false;
    cleanupPromise = null;
  }
  })();
  
  try {
    return await cleanupPromise;
  } catch (err) {
    // Release lock jika error
    cleanupLock = false;
    cleanupPromise = null;
    throw err;
  }
}
