const commonErrors = require("../../../src/misc/commonErrors");
const categoryService = require("../../../src/service/categoryService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let testIds = [];

describe('categoryService.updateOrder', () => {
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
    categories.forEach((category) => {
      testIds.push(category.id);
    })
  })

  afterAll(async() => {
    await prisma.$disconnect();
  })
  
  test("카테고리 순서 재정렬하기", async() => {
    const datas = [
      {
        id: testIds[2],
        order: 5,
      },
      {
        id: testIds[3],
        order: 1,
      },
      {
        id: testIds[4],
        order: 2,
      },
    ];

    const result = await categoryService.updateOrder(datas);
    const expectedOrder = [testIds[3], testIds[4], testIds[0], testIds[1], testIds[2]];
    const actualOrder = result.map(item => item.id);
    expect(actualOrder).toEqual(expectedOrder);
    expect(expectedOrder.length).toBe(actualOrder.length);    
  })
  test("id나 order 타입이 다를 때 `id와 order는 숫자여야 합니다.` 에러 반환", async() => {
    const datas = [
      {
        id: testIds[2],
        order: "5",
      },
      {
        id: testIds[3],
        order: 1,
      },
      {
        id: testIds[4],
        order: 2,
      },
    ];

    try{
      await categoryService.updateOrder(datas);
    } catch (e) {
      expect(e.name).toBe(commonErrors.argumentError);
      expect(e.message).toBe("id와 order는 숫자여야 합니다.");
      expect(e.httpCode).toBe(400)
    }
  })
  test("중복된 order 요청이 들어왔을 때 `order 값에 중복이 있습니다.` 에러 반환", async() => {
    const datas = [
      {
        id: testIds[2],
        order: 5,
      },
      {
        id: testIds[3],
        order: 5,
      },
      {
        id: testIds[4],
        order: 2,
      },
    ];

    try{
      await categoryService.updateOrder(datas);
    } catch (e) {
      expect(e.name).toBe(commonErrors.argumentError);
      expect(e.message).toBe("order 값에 중복이 있습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("존재하지 않는 카테고리 id로 요청이 들어왔을 때 `존재하지 않는 카테고리가 포함되어 있습니다.` 에러 반환", async() => {
    const datas = [
      {
        id: testIds[2],
        order: 5,
      },
      {
        id: 9999,
        order: 1,
      },
      {
        id: testIds[4],
        order: 2,
      },
    ];

    try{
      await categoryService.updateOrder(datas);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("존재하지 않는 카테고리가 포함되어 있습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
  test('요청 본문에 데이터가 없을 때 `입력받은 카테고리 목록이 없습니다`에러 반환',async () => {
    const datas = [];
    try{
      await categoryService.updateOrder(datas);
    } catch(e){
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("입력받은 카테고리 목록이 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
})