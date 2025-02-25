const asyncHandler = require("express-async-handler");
const { validationResult, body, query } = require("express-validator");

const validate = (validations) =>
  asyncHandler(async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });

const validateRegistration = validate([
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
]);

const validateLogin = validate([
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
]);

const validateEvent = validate([
  body("title").notEmpty().trim(),
  body("description").notEmpty(),
  body("startDate").isISO8601().toDate(),
  body("endDate").isISO8601().toDate(),
  body("capacity").isInt({ min: 1 }),
  body("category").notEmpty(),
  body("isVirtual").isBoolean().optional(),
  body("virtualLink").isURL().optional(),
  body("location").optional(),
]);

const validateCategory = validate([body("name").notEmpty().trim()]);

const validateTicketType = validate([
  body("name").notEmpty().trim(),
  body("price").isFloat({ min: 0 }),
  body("quantity").isInt({ min: 1 }),
  body("description").optional().trim(),
  body("maxPerUser").isInt({ min: 1 }).default(10),
  body("saleStartDate").isISO8601().toDate(),
  body("saleEndDate")
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.saleStartDate)) {
        throw new Error("Sale end date must be after sale start date");
      }
      return true;
    }),
]);

const validateTicketPurchase = validate([
  body("eventId").notEmpty().isString(),
  body("tickets")
    .isArray({ min: 1 })
    .withMessage("At least one ticket must be specified"),
  body("tickets.*.ticketTypeId")
    .notEmpty()
    .isString()
    .withMessage("Valid ticket type ID required"),
  body("tickets.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
]);

const validateSearch = validate([
  query("search").optional().trim(),
  query("category").optional().trim(),
  query("startDate").optional().isISO8601().toDate(),
  query("endDate").optional().isISO8601().toDate(),
  query("isVirtual").optional().isBoolean(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
]);

const validateMessage = validate([
  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message must be less than 1000 characters"),
]);

const validateInvite = validate([
  body("emails")
    .isArray()
    .withMessage("Emails must be an array")
    .notEmpty()
    .withMessage("Emails array cannot be empty"),
  body("emails.*")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("message").optional().trim().isLength({ max: 500 }),
]);

module.exports = {
  validateRegistration,
  validateLogin,
  validateEvent,
  validateCategory,
  validateTicketType,
  validateTicketPurchase,
  validateSearch,
  validateMessage,
  validateInvite,
};
