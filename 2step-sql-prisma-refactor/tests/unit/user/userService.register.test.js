const commonErrors = require("../../../src/misc/commonErrors");
const userService = require("../../../src/service/userService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

describe('userService.registerUser', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("회원가입 성공 시 User와 Address가 함께 생성된다", async () => {
    const payload = {
      email: "test@test.com",
      password: "password1234!",
      firstName: "Minsu",
      lastName: "Kim",
      address: {
        street: "서울시 강남구",
        detailedAddress: "101동 101호",
        postalCode: "12345",
      },
    };

    const user = await userService.registerUser(payload);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(payload.email);

    const userInDb = await prisma.user.findUnique({
      where: { id: user.id },
      include: { address: true},
    })

    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(payload.email);
    expect(userInDb.address).not.toBeNull();
    expect(userInDb.address.street).toBe(payload.address.street);
  });

  test('이미 존재하는 이메일로 회원가입 시 `이미 존재하는 이메일입니다` 에러를 던진다', async () => {
    const payload = {
      email: 'dup@example.com',
      password: 'password12345',
      firstName: 'Dup',
      lastName: 'User',
    };

    await userService.registerUser(payload);

    try{
      await userService.registerUser(payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.businessError);
      expect(e.message).toBe('이미 존재하는 이메일입니다.');
      expect(e.httpCode).toBe(400);
    }
  })
})