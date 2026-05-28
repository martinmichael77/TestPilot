const path = require('path');
const fs = require('fs-extra');
const { tmpDir, reportsDir, historyFile } = require('../config');

async function ensureStorage() {
  await fs.ensureDir(tmpDir);
  await fs.ensureDir(reportsDir);
  await fs.ensureFile(historyFile);
  const raw = await fs.readFile(historyFile, 'utf-8');
  if (!raw.trim()) {
    await fs.writeJson(historyFile, []);
  }
}

function ensureJsonFile(file) {
  if (!file) return;
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (ext !== '.json') {
    const error = new Error(`Invalid file type for ${file.originalname}. Only .json files are allowed.`);
    error.status = 400;
    throw error;
  }
}

async function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    await fs.remove(filePath);
  } catch (error) {
    // Ignore cleanup failures to keep request flow stable.
  }
}

async function readJsonFile(filePath) {
  return fs.readJson(filePath);
}

module.exports = {
  ensureStorage,
  ensureJsonFile,
  safeUnlink,
  readJsonFile,
};
