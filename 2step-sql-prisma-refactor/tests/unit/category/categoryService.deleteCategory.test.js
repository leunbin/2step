const commonErrors = require("../../../src/misc/commonErrors");
const categoryService = require("../../../src/service/categoryService");
const productService = require("../../../src/service/productService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let testId;
let targetId;

describe("categoryService.deleteCategory", () => {
  beforeEach(async () => {
    await clearDatabase();

    const payload_sneakers = {
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: true,
      order: 1
    };

    const payload_heels = {
      name: "Heels",
      code: "CAT-HEL-002",
      isActive: true,
      order: 2
    };

    
    
    const created = await categoryService.createCategory(payload_sneakers);
    const heels_id = await categoryService.createCategory(payload_heels);
    testId = created.id;
    targetId = heels_id.id;

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

    await productService.create(productpayload_nike, optionsPayload_nike);
    await productService.create(productpayload_newbalance, optionsPayload_newbalance);
  })

  afterAll(async () => {
    await prisma.$disconnect();
  })

  test("카테고리 삭제 시 기존 상품 품절 상태 전환하기", async() => {
    const result = await categoryService.deleteCategory(testId, 'DISCONTINUE_PRODUCTS');
  
    expect(result).toBe(true);
  
    const products = await productService.getproducts({ categoryId: testId, includeDiscontinued: true });
    products.forEach((product) => {
      expect(product.categoryId).toBe(testId);
      expect(product.state).toBe('DISCONTINUED');
    })

    const category = await categoryService.getCategory(testId);
    expect(category.isActive).toBe(false);
  })

  test("카테고리 삭제 시 기존 상품 특정 카테고리로 수정하기", async() => {
    const result = await categoryService.deleteCategory(testId, 'MOVE_TO_CATEGORY', targetId);
    expect(result).toBe(true);
    const products = await productService.getproducts({ categoryId: targetId });
    products.forEach((product) => {
      expect(product.categoryId).toBe(targetId);
    })
  })

  test("삭제하려는 카테고리가 없으면 `삭제할 카테고리가 없습니다.` 에러 반환하기", async() => {
    const payloadId = testId + targetId;
    try{
      await categoryService.deleteCategory(payloadId, "MOVE_TO_CATEGORY", targetId);
    } catch (e){
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("삭제할 카테고리가 없습니다.");
      expect(e.httpCode).toBe(409);
    }
  })

  test("MOVE_TO_CATEGORY 모드에서 target 카테고리가 없으면 `MOVE_TO_CATEGORY 모드에서는 targetId가 필요합니다.` 에러 반환", async () => {
    try{
      await categoryService.deleteCategory(testId, "MOVE_TO_CATEGORY");
    }catch(e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("MOVE_TO_CATEGORY 모드에서는 targetId가 필요합니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("삭제하려는 카테고리와 target 카테고리가 같으면 `같은 카테고리로는 이동할 수 없습니다.` 에러 반환", async () => {
    try{
      await categoryService.deleteCategory(testId, "MOVE_TO_CATEGORY", testId);
    } catch (e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("같은 카테고리로는 이동할 수 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("MODE를 잘못 입력 했을 때 `올바르지 않은 MODE 입니다.` 에러 반환", async () => {
    const payload_mode = 'ERROR_MODE';
    try{
      await categoryService.deleteCategory(testId, payload_mode, targetId);
    } catch (e){
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("올바르지 않은 MODE 입니다.");
      expect(e.httpCode).toBe(400);
    }
  })
})