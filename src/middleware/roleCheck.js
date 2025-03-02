const { ForbiddenError } = require("../utils/errors");
const asyncHandler = require("express-async-handler");

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  next();
});

const requireAdminOrSelf = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId || req.body.userId;

  if (req.user.role !== "ADMIN" && req.user.id !== userId) {
    throw new ForbiddenError("Not authorized to access this resource");
  }
  next();
});

module.exports = { requireAdmin, requireAdminOrSelf };
