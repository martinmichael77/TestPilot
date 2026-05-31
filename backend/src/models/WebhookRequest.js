const mongoose = require('mongoose');

const WebhookRequestSchema = new mongoose.Schema({
  endpointId: { type: mongoose.Schema.Types.ObjectId, ref: 'WebhookEndpoint', required: true },
  method: { type: String, required: true },
  status: { type: Number },
  headers: { type: Object },
  queryParams: { type: Object },
  payload: { type: Object },
  contentType: { type: String },
  sourceIp: { type: String },
  userAgent: { type: String },
  validationResult: { type: String, enum: ['PASS', 'FAIL', 'WARNING'], default: 'PASS' },
  validationDetails: { type: Object },
  responseTime: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WebhookRequest', WebhookRequestSchema);
