const prisma = require("../../src/prismaClient");
console.log('현재 DATABASE_URL:', process.env.DATABASE_URL);


describe("EXPLAIN - 주문 상세 조회",() => {
  test("OrderItem - orderId 기반 조회 실행 계획", async() => {
    const orderId = 1;

    const plan = await prisma.$queryRaw`
      EXPLAIN QUERY PLAN
      SELECT * FROM OrderItem WHERE orderId = ${orderId};
    `;

    console.log("\n[OrderItem 조회 실행 계획]")
    console.log(plan);
  })
})