import { body, param, query } from "express-validator";

const cropTypes = ["maize", "rice", "yam"];
const roles = ["farmer", "buyer"];

export const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("name must be 2-80 chars"),
  body("phoneNumber")
    .trim()
    .matches(/^\+?[0-9]{9,15}$/)
    .withMessage("phoneNumber must be a valid mobile number"),
  body("role").isIn(roles).withMessage("role must be farmer or buyer"),
  body("location").trim().isLength({ min: 2, max: 80 }).withMessage("location is required"),
];

export const loginValidation = [
  body("phoneNumber")
    .trim()
    .matches(/^\+?[0-9]{9,15}$/)
    .withMessage("phoneNumber must be a valid mobile number"),
];

export const createListingValidation = [
  body("cropType").isIn(cropTypes).withMessage("cropType must be maize, rice, or yam"),
  body("quantity").isFloat({ min: 1 }).withMessage("quantity must be at least 1"),
  body("unit").optional().trim().isLength({ min: 1, max: 20 }).withMessage("unit too long"),
  body("price").isFloat({ min: 0 }).withMessage("price must be non-negative"),
  body("location").trim().isLength({ min: 2, max: 80 }).withMessage("location is required"),
];

export const updateListingValidation = [
  param("id").isMongoId().withMessage("invalid listing id"),
  body("cropType").optional().isIn(cropTypes).withMessage("cropType must be maize, rice, or yam"),
  body("quantity").optional().isFloat({ min: 1 }).withMessage("quantity must be at least 1"),
  body("unit").optional().trim().isLength({ min: 1, max: 20 }).withMessage("unit too long"),
  body("price").optional().isFloat({ min: 0 }).withMessage("price must be non-negative"),
  body("location").optional().trim().isLength({ min: 2, max: 80 }).withMessage("location is required"),
  body("status").optional().isIn(["available", "sold"]).withMessage("invalid status"),
];

export const listingIdValidation = [param("id").isMongoId().withMessage("invalid listing id")];

export const listingQueryValidation = [
  query("cropType").optional().isIn(cropTypes).withMessage("cropType must be maize, rice, or yam"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be non-negative"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be non-negative"),
  query("location").optional().trim().isLength({ min: 2, max: 80 }).withMessage("location too short"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be 1-50"),
];

export const updatePricesValidation = [
  body("prices").isArray({ min: 1 }).withMessage("prices must be a non-empty array"),
  body("prices.*.cropType").isIn(cropTypes).withMessage("invalid cropType in prices[]"),
  body("prices.*.currentPrice").isFloat({ min: 0 }).withMessage("currentPrice must be non-negative"),
  body("prices.*.location").optional().trim().isLength({ min: 2, max: 80 }).withMessage("location too short"),
  body("prices.*.unit").optional().trim().isLength({ min: 1, max: 20 }).withMessage("unit too long"),
];

export const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 80 }).withMessage("name must be 2-80 chars"),
  body("location").optional().trim().isLength({ min: 2, max: 80 }).withMessage("location too short"),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("invalid email"),
  body("whatsappNumber")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^\+?[0-9]{9,15}$/)
    .withMessage("whatsappNumber must be valid"),
];
