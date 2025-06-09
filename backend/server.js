import './models/news.js';
import './models/comment.js';

import { sequelize } from './config/db.js';

sequelize.sync({ alter: true }) // atau { force: true } untuk development
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Sync error:', err));
