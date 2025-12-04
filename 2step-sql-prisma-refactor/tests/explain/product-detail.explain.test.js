const prisma = require("../../src/prismaClient");

describe("EXPLAIN-개별 상품 상세 조회", () => {
  test("상품 id 기반 조회 실행 계획 확인", async() => {
    const productId = 1;

    const plan = await prisma.$queryRaw`
      EXPLAIN QUERY PLAN
      SELECT * FROM Product WHERE id=${productId};
    `

    console.log("\n[상품 상세 조회 실행 계획]");
    console.log(plan);

  })
})