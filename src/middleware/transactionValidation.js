const { BadRequestError } = require("../utils/errors");
const asyncHandler = require("express-async-handler");

const validatePaymentReference = asyncHandler(async (req, res, next) => {
  const { reference } = req.query;

  if (!reference) {
    throw new BadRequestError("Payment reference is required");
  }

  req.paymentReference = reference;
  next();
});

module.exports = { validatePaymentReference };
