const { prisma } = require("../utils/testUtils");

async function insertOrderitem(orderId, productId, productOptionId, overrides = {}) {
  return await prisma.orderItem.create({
    data: {
      orderId,
      productId,
      productOptionId,
      quantity: 3,
      price: 0,
      ...overrides
    }
  })
}

module.exports = { insertOrderitem };