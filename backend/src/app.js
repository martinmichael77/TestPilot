const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const executionRoutes = require('./routes/executionRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TestPilot API' });
});

app.use('/api', executionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
