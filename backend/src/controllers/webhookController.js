const WebhookEndpoint = require('../models/WebhookEndpoint');
const WebhookRequest = require('../models/WebhookRequest');
const { v4: uuidv4 } = require('uuid');

// Helper: Generate unique slug
function generateSlug(name, type) {
  if (type === 'temp') return `temp-${uuidv4().slice(0, 8)}`;
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Create webhook endpoint
exports.createEndpoint = async (req, res) => {
  try {
    const { name, type, expiration, description, tags, validationRules, secretToken, ipWhitelist } = req.body;
    const slug = generateSlug(name, type);
    const endpoint = await WebhookEndpoint.create({
      name,
      slug,
      type,
      expiration: expiration ? new Date(expiration) : undefined,
      description,
      tags,
      validationRules,
      secretToken,
      ipWhitelist,
    });
    res.status(201).json(endpoint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List all endpoints
exports.listEndpoints = async (req, res) => {
  const endpoints = await WebhookEndpoint.find().sort({ createdAt: -1 });
  res.json(endpoints);
};

// Get endpoint details
exports.getEndpoint = async (req, res) => {
  const endpoint = await WebhookEndpoint.findById(req.params.id);
  if (!endpoint) return res.status(404).json({ message: 'Not found' });
  res.json(endpoint);
};

// Delete endpoint
exports.deleteEndpoint = async (req, res) => {
  await WebhookEndpoint.findByIdAndDelete(req.params.id);
  await WebhookRequest.deleteMany({ endpointId: req.params.id });
  res.json({ message: 'Deleted' });
};

// List requests for endpoint
exports.listRequests = async (req, res) => {
  const requests = await WebhookRequest.find({ endpointId: req.params.id }).sort({ timestamp: -1 });
  res.json(requests);
};

// Get request details
exports.getRequest = async (req, res) => {
  const request = await WebhookRequest.findById(req.params.requestId);
  if (!request) return res.status(404).json({ message: 'Not found' });
  res.json(request);
};

// Delete request
exports.deleteRequest = async (req, res) => {
  await WebhookRequest.findByIdAndDelete(req.params.requestId);
  res.json({ message: 'Deleted' });
};

// Test webhook sender (simulate sending a webhook)
exports.sendTestWebhook = async (req, res) => {
  // This would use axios/fetch to send a webhook and return the response
  res.status(501).json({ message: 'Not implemented yet' });
};

// Download report (placeholder)
exports.downloadReport = async (req, res) => {
  res.status(501).json({ message: 'Report generation not implemented yet' });
};
