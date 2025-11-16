export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTestDB.js'],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  maxWorkers: 1, // Jalankan test secara sequential untuk menghindari konflik database
};
