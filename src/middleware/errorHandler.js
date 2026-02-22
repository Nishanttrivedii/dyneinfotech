// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  console.error('❌ Error:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack
  });

  // Development: send full error details
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack
    });
  } else {
    // Production: send limited error info
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        error: err.message
      });
    } else {
      // Programming or unknown errors: don't leak details
      res.status(500).json({
        success: false,
        error: 'Something went wrong!'
      });
    }
  }
};

// 404 handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async handler wrapper to catch errors in async routes
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
