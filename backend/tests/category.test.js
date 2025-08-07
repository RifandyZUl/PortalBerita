// tests/category.test.js
import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { sequelize, Admin } = db;

let token;
let categoryId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await Admin.create({
    username: 'admincategory',
    email: 'categoryadmin@example.com',
    password: hashedPassword,
  });

  token = jwt.sign(
    { adminId: admin.adminId, email: admin.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await sequelize.close();
});

describe('🧪 CATEGORY ENDPOINT TEST', () => {
  it('✅ Menambahkan kategori baru', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Teknologi', slug: 'teknologi' });

    expect(res.statusCode).toBe(201);
    categoryId = res.body.data.categoryId;
  });

  it('✅ Mengambil semua kategori', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('✅ Mengupdate kategori', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Teknologi Modern', slug: 'teknologi-modern' });

    expect(res.statusCode).toBe(200);
  });

  it('✅ Menghapus kategori', async () => {
    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
