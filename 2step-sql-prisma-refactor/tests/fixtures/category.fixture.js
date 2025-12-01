const { prisma } = require("../utils/testUtils");

async function insertCategory(overrides={}) {
  return await prisma.category.create({
    data: {
      name: "Sneakers",
      code: "SNK-001",
      isActive: true,
      ...overrides
    }
  })
}

module.exports = { insertCategory }