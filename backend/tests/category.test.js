import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import db from '../models/index.js';

process.env.JWT_SECRET = 'S3cr3tT0ken4dm1nLog!n2025';
process.env.NODE_ENV = 'test';


let token;
let createdId;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  // ✅ Seed admin user dengan kolom yang sesuai model
  await db.Admin.create({
    username: 'Admin Satu',
    email: 'admin@gmail.com', // harus "email", bukan "emailOrUsername"
    password: bcrypt.hashSync('admin12345', 10)
  });

  // ✅ Login menggunakan email untuk dapatkan token
  const loginRes = await request(app).post('/api/auth/login').send({
    emailOrUsername: 'admin@gmail.com', // backend akan cocokkan ke email atau username
    password: 'admin12345'
  });
  console.log('🧪 Login response body:', loginRes.body);

  token = loginRes.body.data.token;

});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Category API', () => {
  it('should create a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Category',
        slug: 'test-category',
        description: 'Description',
        parentId: null,
        icon: 'gear'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    createdId = res.body.data.categoryId;
  });

  it('should fetch all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should update a category', async () => {
    const res = await request(app)
      .put(`/api/categories/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Category',
        slug: 'updated-category',
        icon: 'bank',
        description: 'Updated desc'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toEqual('Updated Category');
  });

  it('should delete a category', async () => {
    const res = await request(app)
      .delete(`/api/categories/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('dihapus');
  });
});
