const commonErrors = require("../../../src/misc/commonErrors");
const categoryService = require("../../../src/service/categoryService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let testId;

describe('categoryService.update', () => {
  beforeEach(async () => {
    await clearDatabase();

    const payload = {
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: true,
      order: 1
    };

    const created = await categoryService.createCategory(payload);
    testId = created.id;
  })

  afterAll(async () => {
    await prisma.$disconnect();
  })

  test("카테고리 정보 수정하기", async() => {
    const payload = {
      id: testId,
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: false,
      order: 3
    };

    const updated = await categoryService.updateCategory(testId, payload);

    expect(updated.name).toBe(payload.name);
    expect(updated.code).toBe(payload.code);
    expect(updated.isActive).toBe(payload.isActive);
    expect(updated.order).toBe(payload.order);

    const found = await categoryService.getCategory(testId);
    expect(found.name).toBe(payload.name);
    expect(found.code).toBe(payload.code);
    expect(found.order).toBe(payload.order);
  })
  
  test("없는 카테고리를 수정 요청 시 `해당 카테고리가 존재하지 않습니다.` 에러 반환", async() => {
    const payloadId = testId + 10;

    const payload = {
      id: payloadId,
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: false,
      order: 3
    };



    try{
      await categoryService.updateCategory(payloadId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("해당 카테고리가 존재하지 않습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
})