function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong while processing your request.',
    details: err.details || null,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
