const { validationResult, body } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

const eventValidation = [
  body("title").notEmpty().trim(),
  body("description").notEmpty(),
  body("startDate").isISO8601().toDate(),
  body("endDate").isISO8601().toDate(),
  body("capacity").isInt({ min: 1 }),
  body("category").notEmpty(),
  body("isVirtual").isBoolean().optional(),
  body("virtualLink").isURL().optional(),
  body("location").optional(),
];

const categoryValidation = [body("name").notEmpty().trim()];

const ticketTypeValidation = [
  body("name").notEmpty().trim(),
  body("price").isFloat({ min: 0 }),
  body("quantity").isInt({ min: 1 }),
  body("description").optional().trim(),
];

const ticketPurchaseValidation = [
  body("eventId").notEmpty(),
  body("ticketTypeId").notEmpty(),
  body("quantity").isInt({ min: 1 }),
];

module.exports = {
  validateRegistration: validate(registerValidation),
  validateLogin: validate(loginValidation),
  validateEvent: validate(eventValidation),
  validateCategory: validate(categoryValidation),
  validateTicketType: validate(ticketTypeValidation),
  validateTicketPurchase: validate(ticketPurchaseValidation),
};
