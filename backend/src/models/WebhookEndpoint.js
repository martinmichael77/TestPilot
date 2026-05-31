const mongoose = require('mongoose');

const WebhookEndpointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['temp', 'persistent'], required: true },
  expiration: { type: Date },
  validationRules: { type: Object, default: {} },
  description: { type: String },
  tags: [{ type: String }],
  secretToken: { type: String },
  ipWhitelist: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WebhookEndpoint', WebhookEndpointSchema);
