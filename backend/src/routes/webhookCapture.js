const express = require('express');
const router = express.Router();
const WebhookEndpoint = require('../models/WebhookEndpoint');
const WebhookRequest = require('../models/WebhookRequest');

// Helper: get endpoint by slug/type
async function findEndpoint(type, slug) {
  return WebhookEndpoint.findOne({ slug: `${type}-${slug}` });
}

// Accept all HTTP methods for webhook capture
router.all('/:type/:slug', async (req, res) => {
  const { type, slug } = req.params;
  const endpoint = await WebhookEndpoint.findOne({ slug: `${type}-${slug}` });
  if (!endpoint) return res.status(404).json({ message: 'Webhook endpoint not found' });

  // Security: Secret token
  if (endpoint.secretToken) {
    const provided = req.headers['x-testpilot-secret'];
    if (!provided || provided !== endpoint.secretToken) {
      return res.status(401).json({ message: 'Invalid or missing secret token' });
    }
  }

  // Security: IP whitelist
  if (endpoint.ipWhitelist && endpoint.ipWhitelist.length > 0) {
    const ip = req.ip;
    if (!endpoint.ipWhitelist.includes(ip)) {
      return res.status(403).json({ message: 'IP not allowed' });
    }
  }

  // Capture request
  const request = await WebhookRequest.create({
    endpointId: endpoint._id,
    method: req.method,
    status: 200,
    headers: req.headers,
    queryParams: req.query,
    payload: req.body,
    contentType: req.headers['content-type'],
    sourceIp: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date(),
  });

  // TODO: Validation engine, real-time push

  res.json({ message: 'Webhook received', requestId: request._id });
});

module.exports = router;
