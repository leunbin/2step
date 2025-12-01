const authService = require("../../../src/service/authService");
const userService = require("../../../src/service/userService");
const { clearDatabase, prisma } = require("../../utils/testUtils")
const commonErrors = require("../../../src/misc/commonErrors");

describe('userService.deleteUser', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("사용자 탈퇴 시 User와 Address soft-delete", async () => {
    const payload = {
      email: "test@test.com",
      password: "password1234!",
      firstName: "Minsu",
      lastName: "Kim",
      address: {
        street: "서울시 강남구",
        detailedAddress: "101동 101호",
        postalCode: "12345",
      }
    }

    const user = await userService.registerUser(payload);
    const userId = user.id;

    const result = await authService.withdraw(userId);

    expect(result).toBe(true);

    const deletedUser = await prisma.user.findUnique({ where: {id: userId}});
    const deletedAddress = await prisma.address.findUnique({ where: {userId} });

    expect(deletedUser.deletedAt).not.toBeNull();
    expect(deletedAddress.deletedAt).not.toBeNull();
  })

  test("없는 사용자 탈퇴 시 `사용자가 없습니다.` 에러를 던진다.", async () => {
    expect.assertions(3);
    
    const userId = 10;
    
    try{
      await authService.withdraw(userId);
      throw new Error('에러가 발생해야 하는데 발생하지 않았습니다.');
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe('사용자가 없습니다.');
      expect(e.httpCode).toBe(404);
    }
  })
})