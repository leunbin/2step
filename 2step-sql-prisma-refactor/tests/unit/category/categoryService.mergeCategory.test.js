const commonErrors = require("../../../src/misc/commonErrors");
const categoryService = require("../../../src/service/categoryService");
const productService = require("../../../src/service/productService");
const { clearDatabase } = require("../../utils/testUtils")

let sneakers_id;
let RunningShoes_id;
let targetId;

describe("categoryService.mergeCategory",() => {
  beforeEach(async() => {
    await clearDatabase();

    const categoriesPayload = [
      {
        name: "Sneakers",
        code: "CAT-SNK-001",
        isActive: true,
        order: 1,
      },
      {
        name: "Running Shoes",
        code: "CAT-RUN-002",
        isActive: true,
        order: 2,
      },
      {
        name: "Basketball Shoes",
        code: "CAT-BSK-003",
        isActive: true,
        order: 3,
      },
      {
        name: "Sandals",
        code: "CAT-SDL-004",
        isActive: true,
        order: 4,
      },
      {
        name: "Boots",
        code: "CAT-BTS-005",
        isActive: true,
        order: 5,
      },
    ];
    for (const category of categoriesPayload) {
      await categoryService.createCategory(category);
    }

    const categories = await categoryService.getCategories();
    sneakers_id = categories[0].id;
    RunningShoes_id = categories[1].id;
    targetId = categories[2].id;

    const productpayload_nike = {
      productCode: "NK-AF1-2025-WH-01",
      name: "Nike Air Force 1 Low",
      price: 129000,
      discountRate: 10,
      description: "Classic all-white leather Air Force 1.",
      company: "Nike",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: sneakers_id,
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
      categoryId: sneakers_id,
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
      categoryId: RunningShoes_id, 
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
      categoryId: RunningShoes_id,
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

  test("입력받은 카테고리를 target 카테고리로 병합하기", async() => {
    const datas = [
      {
        id: sneakers_id,
      },
      {
        id: RunningShoes_id
      }
    ];
    const beforeSneakers = await productService.getproducts({categoryId: sneakers_id}) //2
    const beforeRunning = await productService.getproducts({categoryId: RunningShoes_id}); //2

    const result = await categoryService.mergeCategory(datas, targetId);
    const sneakers_products = await productService.getproducts({categoryId: sneakers_id}); // 0
    const runningshoes_products = await productService.getproducts({categoryId: RunningShoes_id});
    const categories = await categoryService.getCategories({onlyActive: false});

    console.log(beforeSneakers);

    expect(result.newProducts.length).toBe(beforeSneakers.length+beforeRunning.length);
    expect(0).toBe(sneakers_products.length+runningshoes_products.length);

    for(const product of beforeSneakers) {
      const item = await productService.getproduct(product.id);
      expect(item.categoryId).toBe(targetId);
    }

    for(const product of beforeRunning) {
      const item = await productService.getproduct(product.id);
      expect(item.categoryId).toBe(targetId);
    }

    categories.forEach((product) => {
      if(product.id === sneakers_id || product.id === RunningShoes_id) {
        expect(product.isActive).toBe(false);
      }
    })
  })
  test("sourceCategories들이 없을 때 `입력하신 카테고리들이 없습니다.` 에러 반환", async() => {
    const datas = [];
    try{
      await categoryService.mergeCategory(datas, targetId);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("입력하신 카테고리들이 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })

  test("존재하지 않는 카테고리를 입력받았을 때 `존재하지 않는 카테고리 id:` 에러 반환", async() => {
    const datas = [
      {
        id: sneakers_id,
      },
      {
        id: RunningShoes_id
      },
      {
        id: 9999
      }
    ];
    try{
      await categoryService.mergeCategory(datas);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toContain("존재하지 않는 카테고리 id:");
      expect(e.message).toContain('9999');
      expect(e.httpCode).toBe(404)
    }
  })
  test("병합 대상에 targetId를 가지고 있을 때 `병합 대상 ID는 병합 소스 ID 목록에 포함될 수 없습니다.`에러 반환", async() => {
    const datas = [
      {
        id: sneakers_id,
      },
      {
        id: RunningShoes_id
      },
      {
        id: targetId
      }
    ];

    try{
      await categoryService.mergeCategory(datas);
    } catch(e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("병합 대상 ID는 병합 소스 ID 목록에 포함될 수 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
})