const { prisma } = require("../utils/testUtils");

async function insertOrder(userId, overrides={}) {
  return prisma.order.create({
    data: {
      totalPrice: 0,
      status: "PENDING",
      userId,
      ...overrides
    }
  })
}

module.exports = { insertOrder }