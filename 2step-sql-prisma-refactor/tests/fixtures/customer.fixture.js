const { prisma } = require("../utils/testUtils");

async function insertCustomer(orderId, overrides={}) {
  return prisma.customer.create({
    data:{
      orderId,
      name: "Wonhee",
      phone: "010-1234-5678",
      email: "wonhee@gmail.com",
      ...overrides
    }
  })
}

module.exports = { insertCustomer };