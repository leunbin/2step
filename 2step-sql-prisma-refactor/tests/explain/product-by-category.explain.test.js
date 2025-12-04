const prisma = require("../../src/prismaClient");

describe("EXPLAIN - 카테고리 기반 상품 검색", () => {
  test("Product - categoryId 기반 조회 실행 계획 확인", async() => {
    const categoryId = 1;

    const plan = await prisma.$queryRaw`
      EXPLAIN QUERY PLAN
      SELECT * FROM Product WHERE categoryId = ${categoryId};
    `;

    console.log("\n[categoryId 기반 상품 검색 실행 계획]");
    console.log(plan);
  })
})