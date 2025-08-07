import { successResponse, errorResponse } from '../utils/responseHandler.js';

import { sequelize } from '../config/db.js';

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });

    console.log('✅ Database synced for testing');
  } catch (err) {
    console.error('❌ Failed to sync DB:', err);
  }
});
