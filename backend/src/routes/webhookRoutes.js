const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// API endpoints
router.post('/create', webhookController.createEndpoint);
router.get('/', webhookController.listEndpoints);
router.get('/:id', webhookController.getEndpoint);
router.delete('/:id', webhookController.deleteEndpoint);
router.get('/:id/requests', webhookController.listRequests);
router.get('/request/:requestId', webhookController.getRequest);
router.delete('/request/:requestId', webhookController.deleteRequest);
router.post('/test', webhookController.sendTestWebhook);
router.get('/report/:id/:format', webhookController.downloadReport);

module.exports = router;
