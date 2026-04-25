import { validationResult } from "express-validator";

export const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error("Validation failed");
  error.statusCode = 400;
  error.details = errors.array().map((item) => ({ field: item.path, message: item.msg }));
  return next(error);
};
