export const notFoundHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || (error.name === "MulterError" ? 400 : 500);
  const payload = {
    message: error.message || "Internal server error",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.details = error.details || null;
  }

  res.status(statusCode).json(payload);
};
