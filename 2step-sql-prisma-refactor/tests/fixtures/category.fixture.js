const { prisma } = require("../utils/testUtils")

console.log("Prisma URL:", prisma?._engineConfig?.datasourceUrl);
console.log("Provider:", prisma._fetcher?.activeProvider);


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