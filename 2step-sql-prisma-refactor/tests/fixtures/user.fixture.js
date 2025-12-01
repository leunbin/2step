const { prisma } = require("../utils/testUtils");
const bcrypt = require("bcrypt");

async function insertUser(overrides = {}) {
  const hashed = await bcrypt.hash("password1234!", 10);

  return await prisma.user.create({
    data: {
      email: "fixture@test.com",
      password: hashed,
      firstName: "Fixture",
      lastName: "User",
      address: {
        create: {
          street: "서울시 강남구",
          detailedAddress: "101호",
          postalCode: "12345",
        }
      },
      ...overrides,
    },
    include: {
      address: true,
    },
  });
}

module.exports = { insertUser };
