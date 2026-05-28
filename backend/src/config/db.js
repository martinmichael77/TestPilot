const mongoose = require('mongoose');
const { mongoUri, mongoDbName } = require('./index');

let connected = false;

async function connectDatabase() {
  if (!mongoUri) {
    return null;
  }

  if (connected || mongoose.connection.readyState === 1) {
    connected = true;
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri, {
    dbName: mongoDbName,
  });

  connected = true;
  return mongoose.connection;
}

module.exports = {
  connectDatabase,
};