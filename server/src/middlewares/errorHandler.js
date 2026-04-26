export const notFoundHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || (error.name === "MulterError" ? 400 : 500);
  
  // Log error details to console
  console.error("=== ERROR HANDLER ===");
  console.error("Status Code:", statusCode);
  console.error("Error Name:", error.name);
  console.error("Error Message:", error.message);
  console.error("Error Stack:", error.stack);
  
  const payload = {
    message: error.message || "Internal server error",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.details = error.details || null;
  }

  res.status(statusCode).json(payload);
};
