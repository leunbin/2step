const { prisma } = require("../utils/testUtils");

async function insertProductOptions(productId, overrides = {}) {

  return await prisma.productOption.create({
    data: {
      size: "230", 
      color: "white", 
      stock: 10,
      productId,
      ...overrides 
    }
  });
}

module.exports = { insertProductOptions };