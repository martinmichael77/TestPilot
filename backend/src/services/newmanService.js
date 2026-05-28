const path = require('path');
const fs = require('fs-extra');
const newman = require('newman');
const { v4: uuidv4 } = require('uuid');
const { reportsDir, tmpDir } = require('../config');

function simplifyFailure(reason = '') {
  const text = String(reason).toLowerCase();

  if (text.includes('401')) {
    return 'Authentication token may be missing, invalid, or expired.';
  }
  if (text.includes('403')) {
    return 'You might not have permission to access this API.';
  }
  if (text.includes('404')) {
    return 'The endpoint may be incorrect or unavailable in this environment.';
  }
  if (text.includes('500')) {
    return 'The server encountered an internal error. Please check backend logs.';
  }
  if (text.includes('timeout')) {
    return 'The API took too long to respond. Check network or server performance.';
  }

  return 'The assertion did not match the expected result. Please review expected and actual values.';
}

function mergeEnvironmentValues(fileEnv = [], dynamicEnv = {}) {
  const envMap = new Map();

  fileEnv.forEach((item) => {
    if (item && item.key) {
      envMap.set(item.key, {
        key: item.key,
        value: String(item.value ?? ''),
        enabled: item.enabled !== false,
      });
    }
  });

  Object.entries(dynamicEnv).forEach(([key, value]) => {
    envMap.set(key, {
      key,
      value: String(value ?? ''),
      enabled: true,
    });
  });

  return Array.from(envMap.values());
}

async function runCollection({ collectionPath, environmentPath, environmentVariables = {} }) {
  const executionId = uuidv4();
  const htmlReportPath = path.join(reportsDir, `${executionId}.html`);
  const runtimeEnvPath = path.join(tmpDir, `${executionId}-env.json`);

  let fileEnvironmentValues = [];
  if (environmentPath) {
    const parsedEnvironment = await fs.readJson(environmentPath);
    fileEnvironmentValues = parsedEnvironment.values || [];
  }

  const mergedValues = mergeEnvironmentValues(fileEnvironmentValues, environmentVariables);

  const runtimeEnvironment = {
    id: uuidv4(),
    name: 'Runtime Environment',
    values: mergedValues,
    _postman_variable_scope: 'environment',
    _postman_exported_at: new Date().toISOString(),
    _postman_exported_using: 'TestPilot',
  };

  await fs.writeJson(runtimeEnvPath, runtimeEnvironment, { spaces: 2 });

  const summary = await new Promise((resolve, reject) => {
    newman.run(
      {
        collection: collectionPath,
        environment: runtimeEnvPath,
        insecure: true,
        reporters: ['cli', 'html'],
        reporter: {
          html: {
            export: htmlReportPath,
          },
        },
      },
      (err, runSummary) => {
        if (err) {
          return reject(err);
        }
        return resolve(runSummary);
      },
    );
  });

  await fs.remove(runtimeEnvPath);

  const executions = summary.run.executions || [];

  const results = executions.map((execution) => {
    const assertions = execution.assertions || [];
    const failedAssertions = assertions.filter((assertion) => Boolean(assertion.error));
    const response = execution.response || {};
    const request = execution.item?.request || {};
    const responseBody = response.stream ? response.stream.toString() : '';

    const assertionResults = assertions.map((assertion) => ({
      name: assertion.assertion,
      passed: !assertion.error,
      expected: assertion.error?.expected ?? null,
      actual: assertion.error?.actual ?? null,
      errorReason: assertion.error?.message || null,
      beginnerExplanation: assertion.error ? simplifyFailure(assertion.error.message) : null,
    }));

    return {
      requestName: execution.item?.name || 'Unnamed Request',
      method: request.method || 'GET',
      statusCode: response.code || 0,
      responseTime: response.responseTime || 0,
      passed: failedAssertions.length === 0,
      assertionResults,
      errorMessage: failedAssertions[0]?.error?.message || null,
      responseStatus: response.status || 'Unknown',
      responseBodyPreview: responseBody.slice(0, 500),
    };
  });

  const totalRequests = results.length;
  const passedRequests = results.filter((result) => result.passed).length;
  const failedRequests = totalRequests - passedRequests;
  const averageResponseTime =
    totalRequests === 0
      ? 0
      : Math.round(results.reduce((sum, result) => sum + result.responseTime, 0) / totalRequests);

  return {
    executionId,
    totalRequests,
    passedRequests,
    failedRequests,
    averageResponseTime,
    duration: summary.run.timings.completed - summary.run.timings.started,
    results,
    reportPaths: {
      html: htmlReportPath,
    },
  };
}

module.exports = {
  runCollection,
};
