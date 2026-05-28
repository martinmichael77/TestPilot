const fs = require('fs-extra');
const path = require('path');
const PDFDocument = require('pdfkit');
const { tmpDir } = require('../config');

function createCsv(execution) {
  const rows = [
    ['Request Name', 'Method', 'Status Code', 'Response Time', 'Passed', 'Error Message'],
  ];

  execution.results.forEach((result) => {
    rows.push([
      result.requestName,
      result.method,
      result.statusCode,
      result.responseTime,
      result.passed,
      (result.errorMessage || '').replace(/,/g, ';'),
    ]);
  });

  return rows.map((row) => row.join(',')).join('\n');
}

function createHtml(execution) {
  const rows = execution.results
    .map(
      (result) => `
        <tr>
          <td>${result.requestName}</td>
          <td>${result.method}</td>
          <td>${result.statusCode}</td>
          <td>${result.responseTime} ms</td>
          <td>${result.passed ? 'Passed' : 'Failed'}</td>
          <td>${result.errorMessage || ''}</td>
        </tr>`,
    )
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>TestPilot Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
          h1, h2 { margin-bottom: 8px; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
          .card { padding: 14px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; vertical-align: top; }
          th { background: #eef2ff; }
          .fail { color: #b91c1c; }
          .pass { color: #15803d; }
        </style>
      </head>
      <body>
        <h1>TestPilot Execution Report</h1>
        <p><strong>Collection:</strong> ${execution.collectionName}</p>
        <p><strong>Run Date:</strong> ${execution.runDate}</p>
        <div class="summary">
          <div class="card"><strong>Total Requests</strong><div>${execution.totalRequests}</div></div>
          <div class="card"><strong>Passed</strong><div class="pass">${execution.passedRequests}</div></div>
          <div class="card"><strong>Failed</strong><div class="fail">${execution.failedRequests}</div></div>
        </div>
        <h2>Request Results</h2>
        <table>
          <thead>
            <tr>
              <th>Request Name</th>
              <th>Method</th>
              <th>Status</th>
              <th>Response Time</th>
              <th>Result</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

async function writeCsvReport(execution, filePath) {
  const csv = createCsv(execution);
  await fs.writeFile(filePath, csv, 'utf8');
  return filePath;
}

async function writePdfReport(execution, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);

    stream.on('finish', resolve);
    stream.on('error', reject);

    doc.pipe(stream);
    doc.fontSize(18).text('TestPilot Execution Summary', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Execution ID: ${execution.executionId}`);
    doc.text(`Collection: ${execution.collectionName}`);
    doc.text(`Run Date: ${execution.runDate}`);
    doc.text(`Total Requests: ${execution.totalRequests}`);
    doc.text(`Passed Requests: ${execution.passedRequests}`);
    doc.text(`Failed Requests: ${execution.failedRequests}`);
    doc.text(`Average Response Time: ${execution.averageResponseTime} ms`);
    doc.text(`Duration: ${execution.duration} ms`);
    doc.moveDown();

    execution.results.slice(0, 20).forEach((result, index) => {
      doc.fontSize(11).text(`${index + 1}. ${result.requestName} (${result.method})`);
      doc.fontSize(10).text(`Status: ${result.statusCode} | Response: ${result.responseTime} ms | Passed: ${result.passed}`);
      if (result.errorMessage) {
        doc.fillColor('red').text(`Error: ${result.errorMessage}`);
        doc.fillColor('black');
      }
      doc.moveDown(0.4);
    });

    doc.end();
  });
}

function createTempReportPath(executionId, extension) {
  return path.join(tmpDir, `${executionId}-${Date.now()}.${extension}`);
}

module.exports = {
  createHtml,
  createCsv,
  writeCsvReport,
  writePdfReport,
  createTempReportPath,
};
