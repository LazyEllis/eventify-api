const asyncHandler = require("express-async-handler");
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("../utils/auth");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const prisma = require("../config/database");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    token: generateToken(user.id),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    token: generateToken(user.id),
  });
});

module.exports = { register, login };
