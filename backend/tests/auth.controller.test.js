import request from 'supertest';
import app from '../app.js';
import db from '../models/index.js';
import bcrypt from 'bcrypt';

const { sequelize, Admin } = db;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await Admin.create({
    username: 'admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('password123', 10),
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('🧪 AUTH CONTROLLER TEST', () => {
  it('❌ Harus gagal jika username/email tidak dikirim', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'somepassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email/username dan password wajib diisi.');
  });

  it('❌ Harus gagal jika password tidak dikirim', async () => {
    const res = await request(app).post('/api/auth/login').send({
      emailOrUsername: 'admin@example.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email/username dan password wajib diisi.');
  });

  it('✅ Berhasil login dengan email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      emailOrUsername: 'admin@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token'); // ✅ FIX
  });

  it('✅ Berhasil login dengan username', async () => {
    const res = await request(app).post('/api/auth/login').send({
      emailOrUsername: 'admin',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token'); // ✅ FIX
  });
});
