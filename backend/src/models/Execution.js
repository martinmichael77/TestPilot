const mongoose = require('mongoose');

const AssertionResultSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    passed: { type: Boolean, default: false },
    expected: { type: mongoose.Schema.Types.Mixed, default: null },
    actual: { type: mongoose.Schema.Types.Mixed, default: null },
    errorReason: { type: String, default: null },
    beginnerExplanation: { type: String, default: null },
  },
  { _id: false },
);

const ResultSchema = new mongoose.Schema(
  {
    requestName: { type: String, required: true },
    method: { type: String, required: true },
    statusCode: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    assertionResults: { type: [AssertionResultSchema], default: [] },
    errorMessage: { type: String, default: null },
    responseStatus: { type: String, default: 'Unknown' },
    responseBodyPreview: { type: String, default: '' },
  },
  { _id: false },
);

const ExecutionSchema = new mongoose.Schema(
  {
    executionId: { type: String, required: true, unique: true, index: true },
    collectionName: { type: String, required: true },
    runDate: { type: String, required: true },
    passPercentage: { type: Number, default: 0 },
    totalRequests: { type: Number, default: 0 },
    passedRequests: { type: Number, default: 0 },
    failedRequests: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    results: { type: [ResultSchema], default: [] },
    reportHtml: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.models.Execution || mongoose.model('Execution', ExecutionSchema);