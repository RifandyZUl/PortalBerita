export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTestDB.js'],
  globalTeardown: '<rootDir>/tests/globalTeardown.js',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  maxWorkers: 1, // Jalankan test secara sequential untuk menghindari konflik database
  testTimeout: 60000, // 60 detik untuk database operations
  verbose: true, // Output yang lebih informatif
  forceExit: false, // Biarkan false untuk mendeteksi masalah async operations
};
