const AppError =  require( '../misc/AppError');

function errorMiddleware(err, req, res, next) {
  const status = err instanceof AppError ? err.httpCode : 500;
  const message = err.message || 'Internal Server Error';

  if (err instanceof AppError && err.isOperational && status < 500) {
    return res.status(status).json({
      success: false,
      name: err.name,
      message: err.message,
    });
  }

  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      name: "UniqueConstraintError",
      message: "중복된 값입니다."
    })
  }

  res.status(status).json({
    error: {
      success: false,
      name: err.name || 'Error',
      message,
      status,
    },
  });
}

module.exports = errorMiddleware;