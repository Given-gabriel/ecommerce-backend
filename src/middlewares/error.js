export function notFound(req, res, next) {
  const error = new Error(`Not Found -${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  //eslint-disable-line
  const status = err.status || 500;
  const payload = {
    ok: false,
    status,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  res.status(status).json(payload);
}
