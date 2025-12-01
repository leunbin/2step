const { productOptionDAO } = require("../../../src/data-access");
const commonErrors = require("../../../src/misc/commonErrors");
const productService = require("../../../src/service/productService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let testId;

describe("productService.delete", () => {
  beforeEach(async () => {
    await clearDatabase();

    await prisma.category.createMany({
      data: [
        {id: 1, name: 'SNEAKERS'}
      ]
    })

    const productPayload = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 129000,
      discountRate: 10,
      description: "Classic all-white leather Air Force 1.",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    };

    const optionPayload = [
        { size: "230", color: "white", stock: 10 },
        { size: "240", color: "white", stock: 8 },
        { size: "250", color: "white", stock: 12 }
    ];

    const created = await productService.create(productPayload, optionPayload);
    testId = created.id;
  })

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("상품 삭제 성공", async () => {
    const result = await productService.deleteProduct(testId);
    expect(result).toBe(true);

    await expect(productService.getproduct(testId))
      .rejects
      .toThrow("해당 상품이 없습니다.");
  });

  test("삭제할 상품이 DB에 없으면 `해당 상품이 없습니다.`에러 반환", async () => {
    const givenId = testId + 10;

    try{
      await productService.deleteProduct(givenId);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("해당 상품이 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
})