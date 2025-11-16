// Script untuk migrate data dari localhost ke Railway
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load .env untuk localhost connection
dotenv.config();

// ===== CONFIGURATION ===== //
// Database LOCALHOST (source)
const localhostConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
};

// Database RAILWAY (destination)
// Ganti dengan DATABASE_URL dari Railway
const railwayUrl = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!railwayUrl) {
  console.error('❌ RAILWAY_DATABASE_URL atau DATABASE_URL tidak ditemukan!');
  console.log('   Set environment variable: RAILWAY_DATABASE_URL=postgresql://...');
  process.exit(1);
}

// ===== CREATE SEQUELIZE INSTANCES ===== //
const localhostDB = new Sequelize(
  localhostConfig.database,
  localhostConfig.username,
  localhostConfig.password,
  {
    host: localhostConfig.host,
    port: localhostConfig.port,
    dialect: localhostConfig.dialect,
    logging: localhostConfig.logging,
  }
);

const railwayDB = new Sequelize(railwayUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// ===== CREATE MODELS FOR LOCALHOST ===== //
// Query semua kolom yang mungkin ada (termasuk first_name/last_name jika ada)
const LocalAdmin = localhostDB.define('Admin', {
  adminId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'admin_id' },
  username: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  firstName: { type: Sequelize.STRING, allowNull: true },
  lastName: { type: Sequelize.STRING, allowNull: true },
  bio: { type: Sequelize.TEXT },
  photo: { type: Sequelize.STRING },
}, { tableName: 'admins', timestamps: false });

const LocalAuthor = localhostDB.define('Author', {
  authorId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'author_id' },
  name: { type: Sequelize.STRING, allowNull: false },
  bio: { type: Sequelize.STRING, allowNull: true },
}, { tableName: 'authors', timestamps: false });

const LocalCategory = localhostDB.define('Category', {
  categoryId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'category_id' },
  name: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: true },
  parentId: { type: Sequelize.INTEGER, allowNull: true, field: 'parent_id' },
  icon: { type: Sequelize.STRING, allowNull: true },
}, { tableName: 'categories', timestamps: false });

const LocalNews = localhostDB.define('News', {
  newsId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'news_id' },
  adminId: { type: Sequelize.INTEGER, allowNull: false, field: 'admin_id' },
  authorId: { type: Sequelize.INTEGER, allowNull: false, field: 'author_id' },
  categoryId: { type: Sequelize.INTEGER, allowNull: false, field: 'category_id' },
  title: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT },
  imageUrl: { type: Sequelize.STRING, field: 'image_url' },
  slug: { type: Sequelize.STRING, allowNull: false, unique: true },
  publishedAt: { type: Sequelize.DATE, field: 'publishedat' },
  views: { type: Sequelize.INTEGER, defaultValue: 0 },
  status: { type: Sequelize.ENUM('draft', 'published', 'archived'), allowNull: false },
  summary: { type: Sequelize.TEXT },
}, { tableName: 'news', timestamps: true });

// Comment model - gunakan query langsung karena field mapping bisa berbeda
// const LocalComment = ... (tidak perlu define, pakai query langsung)

// ===== CREATE MODELS FOR RAILWAY ===== //
// Sesuai dengan model yang sebenarnya
const RailwayAdmin = railwayDB.define('Admin', {
  adminId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'admin_id' },
  username: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  firstName: { type: Sequelize.STRING, allowNull: true },
  lastName: { type: Sequelize.STRING, allowNull: true },
  bio: { type: Sequelize.TEXT, allowNull: true },
  photo: { type: Sequelize.STRING, allowNull: true },
}, { tableName: 'admins', timestamps: false });

const RailwayAuthor = railwayDB.define('Author', {
  authorId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'author_id' },
  name: { type: Sequelize.STRING, allowNull: false },
  bio: { type: Sequelize.STRING, allowNull: true },
}, { tableName: 'authors', timestamps: false });

const RailwayCategory = railwayDB.define('Category', {
  categoryId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'category_id' },
  name: { type: Sequelize.STRING, allowNull: false },
  slug: { type: Sequelize.STRING, allowNull: false, unique: true },
  description: { type: Sequelize.STRING, allowNull: true },
  parentId: { type: Sequelize.INTEGER, allowNull: true, field: 'parent_id' },
  icon: { type: Sequelize.STRING, allowNull: true },
}, { tableName: 'categories', timestamps: false });

const RailwayNews = railwayDB.define('News', {
  newsId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'news_id' },
  adminId: { type: Sequelize.INTEGER, allowNull: false, field: 'admin_id' },
  authorId: { type: Sequelize.INTEGER, allowNull: false, field: 'author_id' },
  categoryId: { type: Sequelize.INTEGER, allowNull: false, field: 'category_id' },
  title: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT },
  imageUrl: { type: Sequelize.STRING, field: 'image_url' },
  slug: { type: Sequelize.STRING, allowNull: false, unique: true },
  publishedAt: { type: Sequelize.DATE, field: 'publishedat' },
  views: { type: Sequelize.INTEGER, defaultValue: 0 },
  status: { type: Sequelize.ENUM('draft', 'published', 'archived'), allowNull: false },
  summary: { type: Sequelize.TEXT },
}, { tableName: 'news', timestamps: true });

// Comment model - gunakan query langsung karena field mapping bisa berbeda
// const RailwayComment = ... (tidak perlu define, pakai query langsung)

// ===== MIGRATION FUNCTION ===== //
async function migrateData() {
  try {
    console.log('🔄 Starting data migration...\n');

    // Test connections
    console.log('📡 Testing connections...');
    await localhostDB.authenticate();
    console.log('✅ Connected to LOCALHOST database');

    await railwayDB.authenticate();
    console.log('✅ Connected to RAILWAY database\n');

    // ===== STEP 1: MIGRATE ADMINS ===== //
    console.log('📦 Migrating Admins...');
    const localAdmins = await LocalAdmin.findAll({ raw: true });
    console.log(`   Found ${localAdmins.length} admin(s)`);

    if (localAdmins.length > 0) {
      const railwayAdmins = await RailwayAdmin.findAll({ raw: true });
      const existingEmails = new Set(railwayAdmins.map(a => a.email));

      let created = 0;
      for (const admin of localAdmins) {
        if (!existingEmails.has(admin.email)) {
          const { adminId, ...adminData } = admin;
          await RailwayAdmin.create(adminData);
          created++;
        }
      }
      console.log(`   ✅ Created ${created} new admin(s)\n`);
    } else {
      console.log('   ⚠️  No admins to migrate\n');
    }

    // ===== STEP 2: MIGRATE AUTHORS ===== //
    console.log('📦 Migrating Authors...');
    const localAuthors = await LocalAuthor.findAll({ raw: true });
    console.log(`   Found ${localAuthors.length} author(s)`);

    // Create mapping: local authorId -> railway authorId
    const authorIdMap = new Map();

    if (localAuthors.length > 0) {
      const railwayAuthors = await RailwayAuthor.findAll({ raw: true });
      const existingNames = new Set(railwayAuthors.map(a => a.name));

      let created = 0;
      for (const author of localAuthors) {
        if (!existingNames.has(author.name)) {
          const { authorId, ...authorData } = author;
          // Remove photo jika ada (model tidak punya photo)
          const { photo, ...authorDataClean } = authorData;
          const newAuthor = await RailwayAuthor.create(authorDataClean);
          authorIdMap.set(author.authorId, newAuthor.authorId);
          created++;
        } else {
          // Find existing author
          const existing = railwayAuthors.find(a => a.name === author.name);
          if (existing) {
            authorIdMap.set(author.authorId, existing.authorId);
          }
        }
      }
      console.log(`   ✅ Created ${created} new author(s)\n`);
    } else {
      console.log('   ⚠️  No authors to migrate\n');
    }

    // ===== STEP 3: MIGRATE CATEGORIES ===== //
    console.log('📦 Migrating Categories...');
    const localCategories = await LocalCategory.findAll({ raw: true });
    console.log(`   Found ${localCategories.length} category(ies)`);

    // Create mapping: local categoryId -> railway categoryId
    const categoryIdMap = new Map();

    if (localCategories.length > 0) {
      const railwayCategories = await RailwayCategory.findAll({ raw: true });
      const existingSlugs = new Set(railwayCategories.map(c => c.slug));

      let created = 0;
      for (const category of localCategories) {
        if (!existingSlugs.has(category.slug)) {
          const { categoryId, parentId, ...categoryData } = category;
          const newCategory = await RailwayCategory.create({
            ...categoryData,
            parentId: parentId ? categoryIdMap.get(parentId) || null : null,
            icon: categoryData.icon || null,
          });
          categoryIdMap.set(category.categoryId, newCategory.categoryId);
          created++;
        } else {
          const existing = railwayCategories.find(c => c.slug === category.slug);
          if (existing) {
            categoryIdMap.set(category.categoryId, existing.categoryId);
          }
        }
      }
      console.log(`   ✅ Created ${created} new category(ies)\n`);
    } else {
      console.log('   ⚠️  No categories to migrate\n');
    }

    // ===== STEP 4: MIGRATE NEWS ===== //
    console.log('📦 Migrating News...');
    const localNews = await LocalNews.findAll({ raw: true });
    console.log(`   Found ${localNews.length} news article(s)`);

    if (localNews.length > 0) {
      const railwayNews = await RailwayNews.findAll({ raw: true });
      const existingSlugs = new Set(railwayNews.map(n => n.slug));

      let created = 0;
      for (const news of localNews) {
        if (!existingSlugs.has(news.slug)) {
          const { newsId, categoryId, authorId, adminId, ...newsData } = news;

          // Map foreign keys
          const newCategoryId = categoryIdMap.get(categoryId);
          const newAuthorId = authorIdMap.get(authorId);

          // Get adminId from Railway (use first admin if adminId doesn't exist)
          let newAdminId = adminId;
          if (adminId) {
            const railwayAdmins = await RailwayAdmin.findAll({ raw: true });
            if (railwayAdmins.length > 0) {
              newAdminId = railwayAdmins[0].adminId;
            }
          }

          if (newCategoryId && newAuthorId && newAdminId) {
            await RailwayNews.create({
              ...newsData,
              categoryId: newCategoryId,
              authorId: newAuthorId,
              adminId: newAdminId,
            });
            created++;
          } else {
            console.log(`   ⚠️  Skipped news "${news.title}" - missing foreign keys`);
          }
        }
      }
      console.log(`   ✅ Created ${created} new news article(s)\n`);
    } else {
      console.log('   ⚠️  No news to migrate\n');
    }

    // ===== STEP 5: MIGRATE COMMENTS ===== //
    console.log('📦 Migrating Comments...');
    // Query langsung untuk menghindari masalah field mapping
    const localComments = await localhostDB.query(
      'SELECT * FROM comments',
      { type: localhostDB.QueryTypes.SELECT }
    );
    console.log(`   Found ${localComments.length} comment(s)`);

    if (localComments.length > 0) {
      // Get news mapping (slug -> newsId)
      const railwayNews = await RailwayNews.findAll({ raw: true });
      const newsSlugMap = new Map();
      for (const news of railwayNews) {
        newsSlugMap.set(news.slug, news.newsId);
      }

      // Get local news to find slug
      const localNewsForComments = await localhostDB.query(
        'SELECT news_id, slug FROM news',
        { type: localhostDB.QueryTypes.SELECT }
      );
      const localNewsIdToSlug = new Map(
        localNewsForComments.map(n => [n.news_id, n.slug])
      );

      let created = 0;
      for (const comment of localComments) {
        // Handle both comment_id and commentId
        const localNewsId = comment.news_id || comment.newsId;
        const localSlug = localNewsIdToSlug.get(localNewsId);
        const railwayNewsId = localSlug ? newsSlugMap.get(localSlug) : null;

        if (railwayNewsId) {
          // Insert langsung dengan query untuk menghindari field mapping issues
          // Cek apakah createdAt ada di data
          const createdAt = comment.createdAt || comment.created_at || new Date();
          
          await railwayDB.query(
            `INSERT INTO comments (news_id, name, email, comment, status, "createdAt")
             VALUES ($1, $2, $3, $4, $5, $6)`,
            {
              bind: [
                railwayNewsId,
                comment.name,
                comment.email,
                comment.comment,
                comment.status || 'Pending',
                createdAt,
              ],
            }
          );
          created++;
        }
      }
      console.log(`   ✅ Created ${created} new comment(s)\n`);
    } else {
      console.log('   ⚠️  No comments to migrate\n');
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Admins: ${localAdmins.length}`);
    console.log(`   - Authors: ${localAuthors.length}`);
    console.log(`   - Categories: ${localCategories.length}`);
    console.log(`   - News: ${localNews.length}`);
    console.log(`   - Comments: ${localComments.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await localhostDB.close();
    await railwayDB.close();
  }
}

// Run migration
migrateData();

