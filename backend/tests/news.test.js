// tests/news.test.js
import request from 'supertest';
import app from '../app.js';
import { sequelize } from '../config/db.js';
import db from '../models/index.js';

const { News, Category, Author, Admin } = db;

let testCategory, testAuthor, testAdmin;

beforeAll(async () => {
await sequelize.query('DROP TYPE IF EXISTS "enum_news_status" CASCADE;');
  // Tambahkan ini sebelum sync
  await sequelize.sync({ force: true });

  testCategory = await Category.create({ name: 'Teknologi', slug: 'teknologi' });
  testAuthor = await Author.create({ name: 'Penulis Satu' });
  testAdmin = await Admin.create({ username: 'adminnews', email: 'newsadmin@example.com', password: '123456' });

  await News.bulkCreate([
    {
      title: 'Berita Pertama',
      slug: 'berita-pertama',
      content: '<p>Konten berita pertama</p>',
      summary: 'Ringkasan berita pertama',
      imageUrl: 'https://example.com/image1.jpg',
      categoryId: testCategory.categoryId,
      authorId: testAuthor.authorId,
      adminId: testAdmin.adminId,
      status: 'published',
      publishedAt: new Date(),
      views: 10,
    },
    {
      title: 'Berita Kedua',
      slug: 'berita-kedua',
      content: '<p>Konten berita kedua</p>',
      summary: 'Ringkasan berita kedua',
      imageUrl: 'https://example.com/image2.jpg',
      categoryId: testCategory.categoryId,
      authorId: testAuthor.authorId,
      adminId: testAdmin.adminId,
      status: 'draft',
      publishedAt: new Date(),
      views: 5,
    }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/news/published', () => {
  it('should return only published news for public user', async () => {
    const res = await request(app).get('/api/news/published');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Berita Pertama');
  });
});

describe('GET /api/news (admin)', () => {
  it('should return published news for admin', async () => {
    const res = await request(app)
      .get('/api/news')
      .set('admin', JSON.stringify({ adminId: testAdmin.adminId }));

    expect(res.statusCode).toBe(200);
    expect(res.body.data.articles.length).toBeGreaterThan(0);
  });
});

describe('POST /api/news (createNews)', () => {
  it('should create a new news article', async () => {
    const newArticle = {
      title: 'Berita Ketiga',
      content: '<p>Konten berita ketiga</p>',
      categoryId: testCategory.categoryId,
      authorId: testAuthor.authorId,
      status: 'published',
      imageUrl: 'https://example.com/image3.jpg'
    };

    const res = await request(app)
      .post('/api/news')
      .set('admin', JSON.stringify({ adminId: testAdmin.adminId }))
      .send(newArticle);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Berita Ketiga');
  });
});
