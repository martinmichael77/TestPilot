require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./config/db');
const { ensureStorage } = require('./utils/fileUtils');

async function startServer() {
  await ensureStorage();
  await connectDatabase();

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`TestPilot backend is running on http://localhost:${config.port}`);
  });
}

startServer();
