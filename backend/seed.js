/**
 * Sync tables and seed the first admin + default categories.
 * Replaces the old public GET /api/init-database route.
 *
 * Usage: ADMIN_INITIAL_PASSWORD=<strong password> node seed.js
 */
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();

const password = process.env.ADMIN_INITIAL_PASSWORD;
if (!password || password.length < 12) {
  console.error('Set ADMIN_INITIAL_PASSWORD (min 12 chars) before seeding.');
  process.exit(1);
}

const { default: connectDB } = await import('./src/config/db.js');
const { default: db } = await import('./src/infrastructure/database/models/index.js');
const { default: bcrypt } = await import('bcryptjs');

try {
  await connectDB();

  // Sequential to respect foreign key dependencies
  await db.Admin.sync({ alter: true });
  await db.Author.sync({ alter: true });
  await db.Category.sync({ alter: true });
  await db.News.sync({ alter: true });
  await db.Comment.sync({ alter: true });

  const [admin, created] = await db.Admin.findOrCreate({
    where: { username: process.env.ADMIN_INITIAL_USERNAME || 'admin_super' },
    defaults: {
      email: process.env.ADMIN_INITIAL_EMAIL || 'admin@portalberita.com',
      password: await bcrypt.hash(password, 10),
      firstName: 'Super',
      lastName: 'Admin',
      bio: 'Administrator Portal Berita',
    },
  });
  console.log(created ? `✅ Admin "${admin.username}" created` : `⏭️  Admin "${admin.username}" already exists, password unchanged`);

  if ((await db.Category.count()) === 0) {
    await db.Category.bulkCreate([
      { name: 'Teknologi', slug: 'teknologi' },
      { name: 'Politik', slug: 'politik' },
      { name: 'Ekonomi', slug: 'ekonomi' },
      { name: 'Olahraga', slug: 'olahraga' },
      { name: 'Hiburan', slug: 'hiburan' },
    ]);
    console.log('✅ Default categories seeded');
  }
  process.exit(0);
} catch (err) {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
}
