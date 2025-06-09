import express from 'express';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

export default app;
