const { prisma } = require("../utils/testUtils");

async function insertProduct(categoryId, overrides = {}) {
  return await prisma.product.create({
    data:{
      name: "Nike Air Force 1 'Triple White'",
      price: 200000,
      discountRate: 20,
      productCode: 'NK-AF-1',
      description: "클래식한 올화이트 컬러웨이의 에어포스1.",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1_triple_white.png",
      categoryId,
      ...overrides
    }
  })
}

module.exports = { insertProduct }