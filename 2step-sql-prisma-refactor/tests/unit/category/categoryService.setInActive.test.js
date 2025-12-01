const commonErrors = require("../../../src/misc/commonErrors");
const categoryService = require("../../../src/service/categoryService");
const productService = require("../../../src/service/productService");
const { clearDatabase } = require("../../utils/testUtils")

let testId;
let inActive_testId;

describe("categoryService.setInActive", () => {
  beforeEach(async () => {
    await clearDatabase();

    const payload_sneakers = {
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: true,
      order: 1
    };

    const payload_running = {
      name: "Running Shoes",
      code: "CAT-RUN-002",
      isActive: false,
      order: 2
    };
    
    const created = await categoryService.createCategory(payload_sneakers);
    const inActiveCreated = await categoryService.createCategory(payload_running);
    testId = created.id;
    inActive_testId = inActiveCreated.id;

    const productpayload_nike = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 129000,
      discountRate: 10,
      description: "Classic all-white leather Air Force 1.",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: testId,
    }

    const optionsPayload_nike = [
        { size: "230", color: "white", stock: 10 },
        { size: "240", color: "white", stock: 8 },
        { size: "250", color: "white", stock: 12 }
    ]

    const productpayload_newbalance = {
      productCode: "NB-990-2025-GR-01",
      name: "New Balance 990v5",
      price: 239000,
      discountRate: 15,
      description: "Premium stability running shoe in classic grey.",
      company: "New Balance",
      imgUrl: "https://example.com/img/nb990v5.png",
      categoryId: testId,
    };


    const optionsPayload_newbalance = [
      { size: "240", color: "grey", stock: 5 },
      { size: "250", color: "grey", stock: 7 },
      { size: "260", color: "grey", stock: 4 },
    ];

    const productpayload_ultraboost = {
      productCode: "AD-UB22-2025-BLK-01",
      name: "Adidas Ultraboost 22",
      price: 189000,
      discountRate: 5,
      description: "Responsive running shoe with Boost cushioning.",
      company: "Adidas",
      imgUrl: "https://example.com/img/ultraboost22.png",
      categoryId: inActive_testId, 
    };

    const optionsPayload_ultraboost = [
      { size: "250", color: "black", stock: 6 },
      { size: "260", color: "black", stock: 9 },
      { size: "270", color: "black", stock: 4 }
    ];

    const productpayload_kayano = {
      productCode: "AS-GK30-2025-BLUE-01",
      name: "Asics Gel-Kayano 30",
      price: 199000,
      discountRate: 12,
      description: "Premium stability running shoe with FF Blast cushioning.",
      company: "Asics",
      imgUrl: "https://example.com/img/gelkayano30.png",
      categoryId: inActive_testId,
    };

    const optionsPayload_kayano = [
      { size: "250", color: "blue", stock: 5 },
      { size: "260", color: "blue", stock: 8 },
      { size: "270", color: "blue", stock: 3 }
    ];



    await productService.create(productpayload_nike, optionsPayload_nike);
    await productService.create(productpayload_newbalance, optionsPayload_newbalance);
    await productService.create(productpayload_ultraboost, optionsPayload_ultraboost);
    await productService.create(productpayload_kayano, optionsPayload_kayano);
  })
  test("카테고리 비활성화하면 카테고리 상품들은 HIDDEN으로", async() => {
    const result = await categoryService.setInActive(testId);
    expect(result.isActive).toBe(false);
    const products = await productService.getproducts({categoryId: testId, includeHidden: true});
    products.forEach((product) => {
      expect(product.categoryId).toBe(testId);
      expect(product.state).toBe("HIDDEN");
    })
  })
  
  test("비활성화 카테고리이면 카테고리 상품들만 HIDDEN으로", async() => {
    const result = await categoryService.setInActive(inActive_testId);
    expect(result.isActive).toBe(false);
    const products = await productService.getproducts({categoryId: inActive_testId, includeHidden: true});
    products.forEach((product) => {
      expect(product.categoryId).toBe(inActive_testId);
      expect(product.state).toBe('HIDDEN');
    })
  })
  test("목표 카테고리가 없으면 `해당 카테고리가 없습니다`에러 반환", async() => {
    const payloadId = testId + inActive_testId;
    try{
      await categoryService.setInActive(payloadId);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe('해당 카테고리가 없습니다.');
      expect(e.httpCode).toBe(409);
    }
  })
})