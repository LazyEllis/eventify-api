const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError } = require("../utils/errors");

const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
  });
  res.json(user);
});

module.exports = { getProfile, updateProfile };
