import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import { sequelize } from '../config/db.js';

let testAdmin;

beforeAll(async () => {
    
  await sequelize.query('DROP TYPE IF EXISTS "enum_news_status" CASCADE;');
  // Bersihkan DB dan drop semua tipe enum atau constraint lama

  await sequelize.sync({ force: true });

  // Buat dummy data untuk penulis
  await db.Author.bulkCreate([
    { name: 'Penulis Satu' },
    { name: 'Penulis Dua' },
  ]);

  // Buat admin untuk kebutuhan header
  testAdmin = await db.Admin.create({
    username: 'admin1',
    email: 'admin1@example.com',
    password: '123456'
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/authors', () => {
  it('should return list of authors', async () => {
    const res = await request(app).get('/api/authors');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]).toHaveProperty('authorId');
    expect(res.body.data[0]).toHaveProperty('name');
  });

  it('should return empty array if no authors exist', async () => {
    await db.Author.destroy({ where: {} });
    const res = await request(app).get('/api/authors');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('should fail to create news with missing fields', async () => {
    const res = await request(app)
      .post('/api/news')
      .set('admin', JSON.stringify({ adminId: testAdmin.adminId }))
      .send({ title: 'Berita Tanpa Konten' }); // kurang field wajib

    expect(res.statusCode).toBe(400);
  });
});
