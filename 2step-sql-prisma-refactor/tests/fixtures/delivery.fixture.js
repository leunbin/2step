const { prisma } = require("../utils/testUtils");

async function insertDelivery(orderId, overrides={}) {
  return await prisma.delivery.create({
    data: {
      orderId,
      name: "Minju",
      phone: "010-3452-5675",
      postcode: "45264",
      address: "서울특별시 송파구 올림픽로 300 101동 1203호",
      ...overrides
    }
  })
}

module.exports = { insertDelivery };