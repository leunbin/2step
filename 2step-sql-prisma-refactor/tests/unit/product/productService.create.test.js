const commonErrors = require("../../../src/misc/commonErrors");
const productService = require("../../../src/service/productService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

describe('productService.create', () => {
  beforeEach(async() => {
    await clearDatabase();

    await prisma.category.createMany({
      data: [
        {id: 1, name: 'SNEAKERS'}
      ]
    })
  })

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('상품 기본 정보와 상세 옵션 생성하기', async() => {
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

    const optionsPayload = [
        { size: "230", color: "white", stock: 10 },
        { size: "240", color: "white", stock: 8 },
        { size: "250", color: "white", stock: 12 }
      ]


    const product = await productService.create(productPayload, optionsPayload);

    expect(product).toBeDefined();
    expect(product.id).toBeDefined();

    const productInDb = await prisma.product.findUnique({
      where: {id: product.id},
      include: {options : true}
    });

    const optionsInDb = await prisma.productOption.findMany({
      where: {productId : productInDb.id}
    })

    expect(productInDb).not.toBeNull();
    expect(productInDb.options).toEqual(optionsInDb);
    optionsInDb.forEach((opt) => {
      expect(opt.productId).toBe(productInDb.id);
    })
    
  })

  test('이미 존재하는 상품 생성시 `이미 존재하는 상품 코드 입니다.` 에러 반환하기', async() => {
    const productpayload = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 129000,
      discountRate: 10,
      description: "Classic all-white leather Air Force 1.",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    }

    const optionsPayload = [
        { size: "230", color: "white", stock: 10 },
        { size: "240", color: "white", stock: 8 },
        { size: "250", color: "white", stock: 12 }
      ]

    await productService.create(productpayload, optionsPayload); 

    try{
      await productService.create(productpayload,[]);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceDuplicationError);
      expect(e.message).toBe('이미 존재하는 상품 코드 입니다.');
      expect(e.httpCode).toBe(409);
    }
  });

  test('중복 상품 옵션 생성 시도 시 `중복된 상품 옵션 입니다.`에러 반환', async() => {
    try {
      const productpayload = {
        productCode: "NK-AF1-2025-WH-01",
        name: "Nike Air Force 1 Low",
        price: 129000,
        discountRate: 10,
        description: "Classic all-white leather Air Force 1.",
        company: "Nike",
        imgUrl: "https://example.com/img/airforce1.png",
        categoryId: 1,
      }

      const testOption = [
        {size: "230", color: "white", stock: 8},
        {size: "230", color: "white", stock: 8}
      ];
      await productService.create(productpayload, testOption);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceDuplicationError);
      expect(e.message).toBe('중복된 상품 옵션입니다.');
      expect(e.httpCode).toBe(409);
    }
  })
})