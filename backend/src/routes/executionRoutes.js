const express = require('express');
const upload = require('../middleware/upload');
const {
  upload: uploadController,
  run,
  getHistory,
  getExecution,
  deleteExecutionById,
  downloadReport,
} = require('../controllers/executionController');

const router = express.Router();

const uploader = upload.fields([
  { name: 'collection', maxCount: 1 },
  { name: 'environment', maxCount: 1 },
]);

router.post('/upload', uploader, uploadController);
router.post('/run-collection', uploader, run);
router.get('/execution-history', getHistory);
router.get('/execution/:id', getExecution);
router.delete('/execution/:id', deleteExecutionById);
router.get('/execution/:id/report/:format', downloadReport);

module.exports = router;
