import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Pre-connect database on serverless cold start without blocking
connectDB().catch(err => console.error('Database connection warning in Vercel:', err.message));

export default app;
