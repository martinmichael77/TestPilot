const { runCollection } = require('../services/newmanService');
const {
  getExecutionHistory,
  getExecutionById,
  saveExecution,
  deleteExecution,
} = require('../services/historyService');
const { ensureJsonFile, safeUnlink, readJsonFile } = require('../utils/fileUtils');
const {
  createHtml,
  writeCsvReport,
  writePdfReport,
  createTempReportPath,
} = require('../services/reportService');

function parseEnvironmentVariables(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;

  try {
    return JSON.parse(raw);
  } catch (error) {
    const parseError = new Error('Invalid environmentVariables format. Provide a valid JSON object.');
    parseError.status = 400;
    throw parseError;
  }
}

async function upload(req, res, next) {
  const collectionFile = req.files?.collection?.[0];
  const environmentFile = req.files?.environment?.[0];

  try {
    if (!collectionFile) {
      const error = new Error('Please upload a Postman collection JSON file.');
      error.status = 400;
      throw error;
    }

    ensureJsonFile(collectionFile);
    ensureJsonFile(environmentFile);

    const collectionData = await readJsonFile(collectionFile.path);
    let environmentVariables = [];

    if (environmentFile) {
      const envData = await readJsonFile(environmentFile.path);
      environmentVariables = (envData.values || []).map((entry) => ({
        key: entry.key,
        value: entry.value,
        enabled: entry.enabled !== false,
      }));
    }

    res.json({
      message: 'Files validated successfully.',
      collection: {
        name: collectionData.info?.name || collectionFile.originalname,
        fileName: collectionFile.originalname,
      },
      environment: {
        fileName: environmentFile?.originalname || null,
        variables: environmentVariables,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    await safeUnlink(collectionFile?.path);
    await safeUnlink(environmentFile?.path);
  }
}

async function run(req, res, next) {
  const collectionFile = req.files?.collection?.[0];
  const environmentFile = req.files?.environment?.[0];

  try {
    if (!collectionFile) {
      const error = new Error('Please upload a collection file before running tests.');
      error.status = 400;
      throw error;
    }

    ensureJsonFile(collectionFile);
    ensureJsonFile(environmentFile);

    const environmentVariables = parseEnvironmentVariables(req.body.environmentVariables);

    const executionData = await runCollection({
      collectionPath: collectionFile.path,
      environmentPath: environmentFile?.path,
      environmentVariables,
    });

    const storedExecution = {
      ...executionData,
      collectionName: collectionFile.originalname,
      runDate: new Date().toISOString(),
      passPercentage:
        executionData.totalRequests === 0
          ? 0
          : Math.round((executionData.passedRequests / executionData.totalRequests) * 100),
    };

    storedExecution.reportHtml = createHtml(storedExecution);

    await saveExecution(storedExecution);
    res.json(storedExecution);
  } catch (error) {
    next(error);
  } finally {
    await safeUnlink(collectionFile?.path);
    await safeUnlink(environmentFile?.path);
  }
}

async function getHistory(_req, res, next) {
  try {
    const history = await getExecutionHistory();
    const rows = history.map((entry) => ({
      executionId: entry.executionId,
      collectionName: entry.collectionName,
      runDate: entry.runDate,
      passPercentage: entry.passPercentage,
      duration: entry.duration,
      totalRequests: entry.totalRequests,
      passedRequests: entry.passedRequests,
      failedRequests: entry.failedRequests,
      averageResponseTime: entry.averageResponseTime,
    }));

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function getExecution(req, res, next) {
  try {
    const execution = await getExecutionById(req.params.id);

    if (!execution) {
      const error = new Error('Execution not found.');
      error.status = 404;
      throw error;
    }

    res.json(execution);
  } catch (error) {
    next(error);
  }
}

async function deleteExecutionById(req, res, next) {
  try {
    const removed = await deleteExecution(req.params.id);

    if (!removed) {
      const error = new Error('Execution not found.');
      error.status = 404;
      throw error;
    }

    res.json({ message: 'Execution removed successfully.' });
  } catch (error) {
    next(error);
  }
}

async function downloadReport(req, res, next) {
  try {
    const execution = await getExecutionById(req.params.id);

    if (!execution) {
      const error = new Error('Execution not found.');
      error.status = 404;
      throw error;
    }

    const format = String(req.params.format || '').toLowerCase();
    if (format === 'html') {
      return res.type('html').send(execution.reportHtml || createHtml(execution));
    }

    if (format !== 'csv' && format !== 'pdf') {
      const error = new Error('Supported report formats are html, csv, and pdf.');
      error.status = 404;
      throw error;
    }

    const extension = format;
    const reportPath = createTempReportPath(execution.executionId, extension);

    if (format === 'csv') {
      await writeCsvReport(execution, reportPath);
    } else {
      await writePdfReport(execution, reportPath);
    }

    return res.download(reportPath, `${execution.executionId}.${extension}`, async () => {
      await safeUnlink(reportPath);
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  upload,
  run,
  getHistory,
  getExecution,
  deleteExecutionById,
  downloadReport,
};
