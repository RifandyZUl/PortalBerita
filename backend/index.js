// index.js
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import db from './models/index.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await db.sequelize.authenticate();
    console.log('✅ PostgreSQL connected');

    await Promise.all([
      db.Admin.sync({ alter: true }),
      db.Author.sync({ alter: true }),
      db.Category.sync({ alter: true }),
      db.News.sync({ alter: true }),
      db.Comment.sync({ alter: true }),
    ]);

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
