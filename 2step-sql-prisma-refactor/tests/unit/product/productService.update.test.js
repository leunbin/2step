const { productOptionDAO } = require("../../../src/data-access");
const commonErrors = require("../../../src/misc/commonErrors");
const productService = require("../../../src/service/productService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let testId;

describe('productService.update', () => {
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

  test('상품 정보 수정하기', async() => {
    const updateProduct = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 200000,
      discountRate: 30,
      description: "New description",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    };

    const updateOptions = [
      { size: "230", color: "white", stock: 10 },
      { size: "240", color: "white", stock: 8 },
      { size: "250", color: "white", stock: 12 },
      { size: "260", color: "red", stock: 20 }
    ];

    const updatedProduct = await productService.updateProduct(testId, updateProduct, updateOptions);
    const updatedOptions = await productOptionDAO.findByProductId(prisma, testId);

    expect(updateProduct.productCode).toBe(updatedProduct.productCode);
    expect(JSON.stringify(updateOptions.map(({ id, ...rest }) => rest))).toBe(JSON.stringify(updatedOptions.map(({ id, productId, ...rest }) => rest)));

    const productInDb = await productService.getproduct(testId);
    const optioinsInDb = await productOptionDAO.findByProductId(prisma, testId);

    expect(updateProduct.price).toBe(productInDb.price);
    expect(JSON.stringify(updateOptions.map(({ id, ...rest }) => rest))).toBe(JSON.stringify(optioinsInDb.map(({ id, productId, ...rest }) => rest)));
  })

  test("수정하려는 상품이 없으면 `해당 상품을 찾을 수 없습니다.` 에러 반환", async () => {
    const givenId = testId + 10;

    const updateProduct = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 200000,
      discountRate: 30,
      description: "New description",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    };

    const updateOptions = [
      { size: "230", color: "white", stock: 10 },
      { size: "240", color: "white", stock: 8 },
      { size: "250", color: "white", stock: 12 },
      { size: "260", color: "red", stock: 20 }
    ];

    try{
      await productService.updateProduct(givenId, updateProduct, updateOptions);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("해당 상품을 찾을 수 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  });

  test("수정하려는 옵션에 중복 데이터가 있으면 `중복된 상품 옵션입니다.`에러 반환", async () => {
    const updateProduct = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 200000,
      discountRate: 30,
      description: "New description",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    };

    const updateOptions = [
      { size: "230", color: "white", stock: 10 },
      { size: "230", color: "white", stock: 10 },
    ];

    try {
      await productService.updateProduct(testId, updateProduct, updateOptions);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceDuplicationError);
      expect(e.message).toBe("중복된 상품 옵션입니다.");
      expect(e.httpCode).toBe(409);
    }
  })
})