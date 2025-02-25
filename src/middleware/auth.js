const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const { UnauthorizedError } = require("../utils/errors");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });
    next();
  } else {
    throw new UnauthorizedError("Not authorized, no token");
  }
});

module.exports = { protect };
