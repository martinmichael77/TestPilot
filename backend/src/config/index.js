const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');

module.exports = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDbName: process.env.MONGODB_DB_NAME || 'testpilot',
  rootDir,
  tmpDir: path.join(rootDir, 'tmp'),
  reportsDir: path.join(rootDir, 'reports'),
  historyFile: path.join(rootDir, 'data', 'history.json'),
};
