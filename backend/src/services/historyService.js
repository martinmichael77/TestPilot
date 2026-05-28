const fs = require('fs-extra');
const { mongoUri, historyFile } = require('../config');

let ExecutionModel = null;

function getExecutionModel() {
  if (!ExecutionModel) {
    ExecutionModel = require('../models/Execution');
  }

  return ExecutionModel;
}

async function getExecutionHistory() {
  if (mongoUri) {
    const Execution = getExecutionModel();
    return Execution.find().sort({ createdAt: -1 }).lean();
  }

  return fs.readJson(historyFile);
}

async function getExecutionById(id) {
  if (mongoUri) {
    const Execution = getExecutionModel();
    return Execution.findOne({ executionId: id }).lean();
  }

  const history = await getExecutionHistory();
  return history.find((entry) => entry.executionId === id) || null;
}

async function saveExecution(execution) {
  if (mongoUri) {
    const Execution = getExecutionModel();
    const created = await Execution.create(execution);
    return created.toObject();
  }

  const history = await getExecutionHistory();
  history.unshift(execution);
  await fs.writeJson(historyFile, history, { spaces: 2 });
  return execution;
}

async function deleteExecution(id) {
  if (mongoUri) {
    const Execution = getExecutionModel();
    return Execution.findOneAndDelete({ executionId: id }).lean();
  }

  const history = await getExecutionHistory();
  const target = history.find((entry) => entry.executionId === id) || null;

  if (!target) {
    return null;
  }

  const filtered = history.filter((entry) => entry.executionId !== id);
  await fs.writeJson(historyFile, filtered, { spaces: 2 });
  return target;
}

module.exports = {
  getExecutionHistory,
  getExecutionById,
  saveExecution,
  deleteExecution,
};
