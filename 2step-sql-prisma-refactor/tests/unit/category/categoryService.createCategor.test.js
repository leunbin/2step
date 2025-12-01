const commonErrors = require("../../../src/misc/commonErrors");
const categoryService = require("../../../src/service/categoryService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

describe("categoryService.createCategory", () => {
  beforeEach(async () => {
    await clearDatabase();
  })

  afterAll(async () => {
    await prisma.$disconnect();
  })

  test("카테고리 생성하기", async() => {
    const payload = {
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: true,
      order: 1
    };

    const category = await categoryService.createCategory(payload);

    expect(category).toBeDefined();
    expect(category.id).toBeDefined();

    const categoryInDb = await categoryService.getCategory(category.id);

    expect(categoryInDb.name).toBe(payload.name);
    expect(categoryInDb.code).toBe(payload.code);
  })

  test("name 필드가 비어있다면 `name은 필수값입니다.` 에러 반환", async() => {
    const payload = {
      code: "CAT-SNK-001",
      isActive: true,
      order: 1
    };

    try{
      await categoryService.createCategory(payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("name은 필수값입니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("이미 존재하는 카테고리 생성 시 `이미 사용하는 코드입니다.`에러 반환", async() => {
    const payload = {
      name: "Sneakers",
      code: "CAT-SNK-001",
      isActive: true,
      order: 1
    };

    await categoryService.createCategory(payload);

    const testPayload = {
      name: "Heels",
      code: "CAT-SNK-001",
      isActive: true,
      order: 2
    }

    try{
      await categoryService.createCategory(testPayload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceDuplicationError);
      expect(e.message).toBe("이미 사용하는 코드입니다.");
      expect(e.httpCode).toBe(409);
    }
  })
})