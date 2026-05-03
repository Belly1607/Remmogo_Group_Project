const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server.';

  res.status(status).json({ message });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };